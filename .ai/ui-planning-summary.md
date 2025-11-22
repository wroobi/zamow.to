# Podsumowanie Planowania Architektury UI

## Podjęte Decyzje

- **Aplikacja w wersji MVP będzie przeznaczona wyłącznie na komputery stacjonarne**; responsywność mobilna nie jest priorytetem.
- **Główną i jedyną funkcjonalnością MVP będzie tworzenie zamówienia poprzez wklejenie listy produktów i przejście przez kreator (wizard).** Nie będzie możliwości ręcznego przeglądania katalogu produktów.
- **Do uwierzytelniania (logowanie, rejestracja) zostaną wykorzystane gotowe komponenty z biblioteki `@supabase/auth-ui-react`.**
- **Kreator parsowania listy będzie nawigowany za pomocą przycisków "Poprzedni" i "Następny" oraz będzie wyświetlał wskaźnik postępu** (np. "Krok 2 z 5").
- **Interfejs kreatora będzie się różnił w zależności od wyniku dopasowania:**
  - Jeden wynik: Duża karta produktu ze zdjęciem, nazwą, ceną i polem do wpisania ilości.
  - Wiele wyników: Siatka 3-4 mniejszych kart produktów do wyboru.
  - Brak wyników: Komunikat informacyjny i możliwość przejścia do kolejnego kroku.
- **Po zakończeniu pracy z kreatorem, użytkownik zostanie przeniesiony na osobną stronę podsumowania (`/summary`), z której będzie mógł dodać wszystkie wybrane produkty do koszyka jednym kliknięciem.**
- **Koszyk będzie zaimplementowany jako komponent Dialog (panel boczny/modal), służący do szybkiego podglądu zawartości bez opuszczania bieżącego widoku.**
- **Po złożeniu zamówienia nastąpi przekierowanie na dedykowaną stronę z podziękowaniem i numerem zamówienia.**
- **W przypadku próby dodania do koszyka produktu, który już w nim jest, jego ilość zostanie automatycznie zwiększona.**
- **Nie ma potrzeby implementacji mechanizmu przywracania stanu kreatora po odświeżeniu strony (localStorage) w MVP.**

## Kluczowe Rekomendacje

- Główny widok po zalogowaniu będzie minimalistycznym interfejsem skoncentrowanym na jednej akcji: wklejeniu listy produktów do pola tekstowego.
- Do zarządzania stanem zostaną wykorzystane dedykowane "store'y" (Zustand/Jotai): jeden globalny dla koszyka, synchronizowany z API, oraz drugi, lokalny, dla stanu kreatora zamówień.
- Interfejs będzie konsekwentnie wykorzystywał komponenty z biblioteki **shadcn/ui** (`Card`, `Input`, `Button`, `Dialog`, `Table`, `Sonner`) w celu zapewnienia spójności wizualnej i przyspieszenia dewelopmentu.
- Stany ładowania danych będą sygnalizowane za pomocą komponentów **Skeleton**, a błędy i powiadomienia za pomocą **Alert** lub **Sonner** (toasty).
- Widok historii zamówień zostanie zaimplementowany jako tabela (`Table`) z kluczowymi informacjami, a kliknięcie w wiersz przeniesie do widoku szczegółowego.
- Profil użytkownika w MVP będzie ograniczony do minimum: wyświetlanie adresu e-mail i przycisku "Wyloguj".
- Zostaną zainstalowane niezbędne pakiety: `shadcn/ui` (z komponentami: card, input, select, table, dialog, sonner), `zustand` oraz `@supabase/auth-ui-react`.
- Zostanie przyjęta klarowna struktura folderów, oddzielająca strony (`pages`), komponenty-kontenery (`components/features`), komponenty reużywalne (`components/shared`) oraz logikę stanu (`lib/stores`).

---

## Szczegółowy Plan Architektury UI

Na podstawie przeprowadzonych rozmów, plan architektury UI dla MVP aplikacji **zamow.to** przedstawia się następująco:

### Główne wymagania dotyczące architektury UI

Architektura będzie skoncentrowana na desktopowym, wysoce wyspecjalizowanym przepływie pracy. Priorytetem jest szybkość i prostota, minimalizująca liczbę kroków i decyzji po stronie użytkownika. Całość zostanie oparta o stack technologiczny **Astro + React** z biblioteką komponentów **shadcn/ui**.

### Kluczowe widoki, ekrany i przepływy użytkownika

#### Przepływ Uwierzytelniania

- `/login` i `/register`: Dedykowane strony Astro wykorzystujące gotowe komponenty z `@supabase/auth-ui-react` do obsługi formularzy.

#### Główny Przepływ Tworzenia Zamówienia (Wizard)

- `/app`: Główny, chroniony widok po zalogowaniu. Zawiera pole tekstowe (`Textarea`) do wklejenia listy produktów i przycisk "Przetwórz".
- `/app/wizard`: Interfejs kreatora zamówień. Jest to dynamiczny komponent React, który renderuje kolejne kroki na podstawie stanu.
  - **Krok 1 (Dopasowano 1 produkt):** Widok z dużą kartą produktu, polem ilości i przyciskami nawigacyjnymi.
  - **Krok 2 (Dopasowano wiele produktów):** Widok z siatką produktów do wyboru.
  - **Krok 3 (Nie dopasowano):** Widok z komunikatem informacyjnym.
- `/app/summary`: Strona podsumowania po przejściu kreatora. Wyświetla listę wybranych produktów i przycisk "Dodaj wszystko do koszyka".

#### Przepływ Finalizacji Zamówienia

- **Koszyk (Dialog):** Dostępny z nawigacji, pozwala na podgląd i modyfikację koszyka. Zawiera przycisk "Złóż zamówienie".
- `/app/order/success/[id]`: Strona wyświetlana po pomyślnym złożeniu zamówienia, zawierająca podziękowanie i numer zamówienia.

#### Przepływ Historii Zamówień

- `/app/history`: Strona z tabelaryczną listą historycznych zamówień.
- `/app/history/[id]`: Strona ze szczegółami konkretnego zamówienia.

### Strategia integracji z API i zarządzania stanem

- **Zarządzanie stanem:** Wykorzystanie Zustand.
  - `cart-store`: Globalny stan koszyka, inicjowany danymi z `GET /api/cart` i synchronizowany z API po każdej modyfikacji.
  - `wizard-store`: Lokalny stan dla kreatora, przechowujący kroki, wybory użytkownika i wyniki z `POST /api/parser/process`.
- **Integracja z API:** Komponenty React będą wywoływać odpowiednie endpointy API (`/api/parser/process`, `/api/cart/...`, `/api/orders`) w odpowiedzi na akcje użytkownika. Sukces lub błąd zapytania będzie aktualizował odpowiedni store i UI.

### Kwestie dotyczące responsywności, dostępności i bezpieczeństwa

- **Responsywność:** MVP skupia się na wersji desktopowej.
- **Dostępność:** Wykorzystanie komponentów shadcn/ui zapewnia dobrą bazę pod kątem dostępności (ARIA, nawigacja klawiaturą).
- **Bezpieczeństwo:** Uwierzytelnianie i autoryzacja będą w pełni obsługiwane przez Supabase (JWT, RLS). Strony wymagające zalogowania będą chronione przez middleware w Astro, który będzie weryfikował sesję użytkownika.

---

## Nierozwiązane Kwestie

Brak nierozwiązanych kwestii. Plan jest gotowy do przejścia do etapu implementacji.
