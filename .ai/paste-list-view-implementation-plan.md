# Plan implementacji widoku Główny (Wklej listę)

## 1. Przegląd

Widok służy do szybkiego wklejenia surowej listy produktów (tekst), jej lokalnej wstępnej walidacji oraz wysłania do parsera (`POST /api/parser/process`) w celu przekształcenia w uporządkowane pozycje z sugerowanymi dopasowaniami. To pierwszy krok procesu tworzenia zamówienia (User Story US-004).

## 2. Routing widoku

- Ścieżka: `/app`
- Plik strony: `src/pages/app/index.astro`
- Dostęp: tylko zalogowany użytkownik (docelowo przez middleware autoryzujący). Jeśli brak sesji → redirect do strony logowania.

## 3. Struktura komponentów

```
AppPage (Astro)
  └─ PasteListRoot (React) [entry klientowy]
      ├─ HelperText
      ├─ PasteListTextarea
      ├─ ProcessButton
      ├─ ShortcutHint
      ├─ ParsedResultPreview (opcjonalnie po sukcesie) / EmptyState
      ├─ LoadingSkeleton (podczas przetwarzania)
      └─ ToastHost (system powiadomień)
```

## 4. Szczegóły komponentów

### PasteListRoot

- Opis: Kontener logiki widoku; zarządza stanem tekstu, wywołaniem API, wynikami i błędami.
- Elementy: wrapper `<div>`, dzieci komponenty; inicjalizacja hooka `usePasteListParser`.
- Interakcje: przyjęcie `Ctrl+Enter` do uruchomienia procesu; delegacja do `handleProcess()`.
- Walidacja: kontrola długości (`>0` i ≤ maksymalny limit znaków), minimalna liczba pozycji po podziale (>0).
- Typy: `ParsedListDto`, `ParsedListItemDto`, `ParserErrorState`, `ParserStatus`.
- Propsy: brak (root).

### PasteListTextarea

- Opis: Duże pole do wklejenia listy; autofokus; połączone z `aria-describedby` dla instrukcji.
- Elementy: `<textarea id="paste-list" aria-describedby="paste-list-help" />`.
- Interakcje: `onChange`, `onPaste`, klawisz `Ctrl+Enter` (przekazany z rodzica lub nasłuch lokalny). Autofokus w `useEffect`.
- Walidacja: lokalna (puste po trim → invalid), przekazywany komunikat wizualny (np. klasą lub aria-invalid).
- Typy: `RawTextState = string`.
- Propsy: `{ value: string; onChange: (v:string)=>void; disabled: boolean; }`.

### ProcessButton

- Opis: Przycisk wysyłający żądanie; blokowany przy braku danych lub w trakcie przetwarzania.
- Elementy: `<Button variant="default">Przetwórz</Button>` (shadcn/ui).
- Interakcje: `onClick` → `handleProcess()`.
- Walidacja: disabled gdy `rawText.trim()==='' || isProcessing || hasValidationErrors`.
- Typy: używa stanu logicznego z rodzica.
- Propsy: `{ onProcess: ()=>void; disabled: boolean; loading: boolean; }`.

### HelperText

- Opis: Instrukcje formatowania i dostępności dla textarea.
- Elementy: `<p id="paste-list-help" class="text-sm text-muted-foreground">Instrukcje...</p>`.
- Interakcje: brak.
- Walidacja: brak logiki; czysto informacyjne.
- Typy: brak specjalnych.
- Propsy: opcjonalnie `{ className?: string }`.

### ShortcutHint

- Opis: Pokazuje informację o skrócie `Ctrl+Enter`.
- Elementy: `<div class="text-xs text-muted-foreground">Skrót: Ctrl+Enter aby przetworzyć</div>`.
- Interakcje: brak.
- Walidacja: brak.
- Typy: brak.
- Propsy: brak lub `{}`.

### LoadingSkeleton

- Opis: Wizualny placeholder w trakcie oczekiwania na wynik.
- Elementy: komponent `Skeleton` z shadcn/ui.
- Interakcje: brak.
- Walidacja: brak.
- Typy: brak.
- Propsy: `{ lines?: number }`.

### ParsedResultPreview

- Opis: Wstępny podgląd wyników zwróconych przez parser (faza demonstracyjna). Wyświetla liczbę pozycji oraz krótką listę statusów.
- Elementy: `<ul>` z mapowaniem `parsed_items` (ograniczyć do X pierwszych wierszy).
- Interakcje: (przyszłość) kliknięcie pozycji do edycji / wyboru dopasowania.
- Walidacja: jeśli brak wyników → komponent niewidoczny.
- Typy: `ParsedListItemDto[]`.
- Propsy: `{ items: ParsedListItemDto[] }`.

### ToastHost

- Opis: Kontener powiadomień (biblioteka Sonner lub inna z shadcn/ui). Pokazuje sukces, błędy walidacji, błędy sieci i wynik.
- Elementy: `<Toaster />`.
- Interakcje: wywołania `toast.success()`, `toast.error()` z hooka.
- Walidacja: nie dotyczy.
- Typy: bazowe z biblioteki.
- Propsy: biblioteka default.

## 5. Typy

- `ProcessListCommand` (z `@types.ts`): `{ text: string }`.
- `ParsedListItemDto`: pola: `original_text`, `status`, `suggested_product`, `potential_matches`.
- `ParsedListDto`: `{ parsed_items: ParsedListItemDto[] }`.
- Nowe (lokalne):
  - `ParserStatus = 'idle' | 'validating' | 'processing' | 'success' | 'error'`.
  - `ParserErrorState = { message: string; code?: 'VALIDATION' | 'NETWORK' | 'SERVER'; } | null`.
  - `LocalParsedItemViewModel` (rozszerzenie na przyszłość): `{ base: ParsedListItemDto; selectedProductId?: string; quantity?: number; }`.
  - `RawTextMetrics = { charCount: number; lineCount: number; itemCountAfterSplit: number; }`.

## 6. Zarządzanie stanem

- Hook `usePasteListParser()` (lokalny w `src/components/hooks`):
  - Stan: `rawText`, `status`, `error`, `parsedItems`, `metrics`.
  - Funkcje: `setRawText`, `validateRawText()`, `processText()`, `reset()`.
  - Logika walidacji (trim, limit znaków, min pozycji). `processText()` wykonuje fetch POST, aktualizuje `status`, ustawia wyniki albo błąd.
- Przechowywanie wyłącznie w pamięci (brak global store na tym etapie).

## 7. Integracja API

- Endpoint: `POST /api/parser/process`.
- Żądanie: body JSON `{ text: rawText }` gdzie `rawText` jest oryginalnym tekstem; walidacja lokalna zanim wyśle.
- Odpowiedź: `ParsedListDto` → zapis do `parsedItems`.
- Obsługa statusów HTTP:
  - `200`: sukces → `status = 'success'`, toast z liczbą pozycji.
  - `400`: walidacja serwera → `status='error'`, toast z komunikatem.
  - `500`: błąd przetwarzania AI → toast z komunikatem ogólnym + sugestia ponowienia.
- Nagłówki: `Content-Type: application/json`.

## 8. Interakcje użytkownika

- Wklejenie / wpisanie tekstu → aktualizacja `rawText` i obliczenie `metrics`.
- Skrót `Ctrl+Enter` lub kliknięcie przycisku → `processText()` (jeśli walidacja OK).
- Podczas przetwarzania: przycisk disabled, textarea disabled (zapobiegnięcie zmianom).
- Po sukcesie: wyświetlenie podglądu + toast.
- Po błędzie: toast + możliwość korekty tekstu bez resetu.

## 9. Warunki i walidacja

- `rawText.trim().length > 0`.
- Limit znaków np. 500 (konfigurowalne stałą `MAX_CHARS`).
- Po podzieleniu na elementy (split wg: nowa linia, przecinek, średnik) wynikowa lista > 0.
- Usunięcie pustych tokenów po split. Normalizacja wielokrotnych separatorów.
- Błędne warunki → blokada przycisku + komunikat (toast lub inline).

## 10. Obsługa błędów

- Lokalna walidacja: komunikat typu "Wklej listę produktów" / "Lista jest pusta" / "Przekroczono limit znaków".
- Sieć (fetch reject, timeout): toast "Błąd sieci. Spróbuj ponownie".
- Server 400: wyświetl szczegóły jeśli dostępne (np. pola błędne).
- Server 500: komunikat ogólny + log `console.error` dla diagnostyki.
- Fallback: każdy nieznany błąd → toast "Nieoczekiwany błąd".

## 11. Kroki implementacji

1. Utwórz stronę `src/pages/app/index.astro` z layoutem `Layout.astro` i kontenerem root React dla widoku.
2. Dodaj plik hooka `src/components/hooks/usePasteListParser.ts` (stany + funkcje + typy lokalne).
3. Zdefiniuj stałe: `MAX_CHARS`, wzorzec splitowania (`SPLIT_REGEX = /[\n,;]+/`).
4. Zaimplementuj komponenty: `PasteListRoot.tsx`, `PasteListTextarea.tsx`, `ProcessButton.tsx`, `HelperText.tsx`, `ShortcutHint.tsx`, `ParsedResultPreview.tsx`, `LoadingSkeleton.tsx`.
5. Dodaj integrację Toast (Sonner lub shadcn/ui) w `PasteListRoot` (instancja `Toaster`).
6. Implementuj obsługę skrótu klawiaturowego (listener `keydown` w root lub textarea). Filtr: `ctrlKey && key==='Enter'`.
7. Walidacja: funkcja `validateRawText()` zwraca listę błędów; jeśli pusta → pozwól procesować.
8. Implementuj `processText()`: ustaw `status='processing'`, wykonaj fetch, obsłuż JSON, ustaw wyniki lub błąd.
9. Dodaj wyświetlanie `LoadingSkeleton` gdy `status==='processing'`.
10. Dodaj `ParsedResultPreview` gdy `status==='success'` i są `parsedItems`.
11. Testy manualne: pusty input, duży input, poprawny, błędny endpoint (zasymulowany), skrót klawiatury.
12. Refaktoryzacja i drobne ulepszenia dostępności (aria-invalid, role status dla wyników).
13. Dokumentacja krótkich komentarzy w hooku (tylko kluczowe fragmenty) + aktualizacja `README` sekcji dla widoku (opcjonalnie).
14. Weryfikacja z PRD: zgodność z US-004 (textarea, przetwarzanie, separatory, skrót, disabled gdy pusto).

---

Plan gotowy do wdrożenia; kolejne etapy mogą rozszerzyć logikę o wybór dopasowań i dodawanie do koszyka.
