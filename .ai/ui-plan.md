# Architektura UI dla zamow.to

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika aplikacji zamow.to (MVP) koncentruje się na szybkim, liniowym przepływie tworzenia zamówienia z wklejonej listy produktów. Aplikacja jest desktop‑first. Po uwierzytelnieniu użytkownik natychmiast trafia do głównego widoku wklejania listy. Dalszy proces przebiega przez kreator (wizard) dopasowywania pozycji, stronę podsumowania oraz finalizację zamówienia. Wspierające widoki obejmują: koszyk (dialog), historia zamówień, szczegóły zamówienia, profil oraz stronę sukcesu. Interfejs wykorzystuje komponenty shadcn/ui oraz React dla części interaktywnych, Astro dla stron i layoutów. Nawigacja oparta jest o stały układ (LayoutShell) z bocznym panelem i górnym paskiem, zapewniając dostęp do głównych sekcji, koszyka i wyszukiwarki produktów. Dostępność (ARIA), jednoznaczne stany (loading, empty, error) oraz bezpieczne operacje związane z uwierzytelnieniem (Supabase) stanowią integralną część projektu.

## 2. Lista widoków

### 2.1 Widok: Logowanie

- Ścieżka: `/login`
- Główny cel: Uwierzytelnienie istniejącego użytkownika.
- Kluczowe informacje: Pola e‑mail, hasło, link do resetu hasła, link do rejestracji.
- Kluczowe komponenty widoku: AuthForm (Supabase), Button, Input, Alert (błędy), Link.
- UX / Dostępność / Bezpieczeństwo: Walidacja inline; aria-invalid dla błędnych pól; focus pierwszego pola; komunikaty błędów w aria-live polite; bezpieczne zarządzanie hasłem (typ password); brak automatycznego ujawniania treści błędów z backendu (uogólnienie).

### 2.2 Widok: Rejestracja

- Ścieżka: `/register`
- Główny cel: Założenie konta.
- Kluczowe informacje: E‑mail, hasło, potwierdzenie hasła, link do logowania.
- Komponenty: AuthForm, Input, Button, PasswordStrengthHint (opcjonalnie), Alert.
- UX / Dostępność / Bezpieczeństwo: Spójna nawigacja; kontrola spójności haseł z natychmiastowym feedbackiem; aria-describedby dla wymogów hasła; zapobieganie ujawnianiu informacji o istnieniu konta (neutralny komunikat przy kolizji).

### 2.3 Widok: Reset hasła

- Ścieżka: `/reset-password`
- Główny cel: Wywołanie procesu resetu hasła.
- Kluczowe informacje: Pole e‑mail, komunikat wysłania instrukcji.
- Komponenty: Input, Button, Alert.
- UX / Dostępność / Bezpieczeństwo: Jasny stan "wysłano"; aria-live dla potwierdzenia; brak potwierdzenia czy konto istnieje (neutralność).

### 2.4 Widok: Główny (Wklej listę)

- Ścieżka: `/app`
- Główny cel: Wklejenie surowej listy produktów do przetworzenia.
- Kluczowe informacje: Duże pole textarea, wskazówki formatowania (nowe linie, przecinki, średniki), przycisk "Przetwórz".
- Komponenty: PasteListTextarea, ProcessButton, HelperText, Skeleton (dla późniejszego loadingu), Toast.
- UX / Dostępność / Bezpieczeństwo: Autofokus na textarea; instrukcje w aria-describedby; walidacja pustej listy (disabled ProcessButton); klawisz skrótu (Ctrl+Enter) do przetwarzania.

### 2.5 Widok: Kreator dopasowania (Wizard)

- Ścieżka: `/app/wizard`
- Główny cel: Iteracyjne potwierdzanie/wybór dopasowań produktów z listy.
- Kluczowe informacje: Indykator postępu "Krok X z Y"; status pozycji; dane produktu/produktów; pole ilości; akcje nawigacyjne.
- Komponenty: WizardContainer, WizardProgress, SingleMatchCard, MultiMatchGrid, NotFoundPanel, QuantityInput, NavigationButtons, SkipButton, RetryButton.
- UX / Dostępność / Bezpieczeństwo: Zarządzanie fokusem przy zmianie kroku; klawisze strzałek/Tab dla wyboru w siatce; aria-selected dla wybranych kart; możliwość pominięcia pozycji; toast przy automatycznym zwiększeniu ilości istniejącego produktu w koszyku; ochronne limity ilości (walidacja liczby > 0).

### 2.6 Widok: Podsumowanie listy (Summary)

- Ścieżka: `/app/summary`
- Główny cel: Przegląd wszystkich zatwierdzonych pozycji przed dodaniem do koszyka.
- Kluczowe informacje: Lista produktów (nazwa, ilość), łączna przewidywana wartość (jeśli cena dostępna), przycisk "Dodaj wszystko do koszyka".
- Komponenty: SummaryTable, AddAllButton, EditQuantityInline (opcjonalnie), EmptyState.
- UX / Dostępność / Bezpieczeństwo: Możliwość edycji ilości przed finalnym dodaniem; wyraźny komunikat gdy lista pusta; aria-live dla komunikatów dodania; zapobieganie wielokrotnemu kliknięciu (loading state AddAllButton).

### 2.7 Overlay: Koszyk (Dialog)

- Dostęp: Ikona w TopBar, skrót (Ctrl+K > "Koszyk"), akcja po dodaniu.
- Główny cel: Przegląd i modyfikacja zawartości koszyka, inicjacja zamówienia.
- Kluczowe informacje: Lista pozycji (nazwa, cena jednostkowa, ilość, subtotal), suma całkowita; akcje: zmień ilość, usuń, "Złóż zamówienie".
- Komponenty: CartDialog, CartItemRow, QuantityInput, RemoveButton, TotalAmountPanel, CheckoutButton.
- UX / Dostępność / Bezpieczeństwo: Focus trap; Esc zamyka; oznaczenie liczby pozycji w badge; disabled CheckoutButton przy pustym koszyku (tooltip wyjaśniający); aria-live przy zmianie ilości; walidacja zakresów (ilość > 0); zabezpieczenie przed przypadkowym podwójnym submit (spinner).

### 2.8 Widok: Finalizacja zamówienia (opcjonalny dialog potwierdzenia)

- Ścieżka: (Dialog na wierzchu koszyka) lub dedykowany `/app/checkout` (MVP może używać tylko dialogu).
- Główny cel: Ostateczne potwierdzenie zawartości przed wysłaniem zamówienia.
- Kluczowe informacje: Podsumowanie ilości, kwota, liczba pozycji.
- Komponenty: ConfirmOrderDialog, OrderSummaryTable, ConfirmButton, CancelButton.
- UX / Dostępność / Bezpieczeństwo: Jasne ostrzeżenie o demonstracyjnym charakterze; aria-describedby dla treści ostrzeżenia; ConfirmButton z loading state podczas POST /api/orders; obsługa błędów (toast + możliwość retry).

### 2.9 Widok: Sukces zamówienia

- Ścieżka: `/app/order/success/[id]`
- Główny cel: Informacja o pomyślnym złożeniu zamówienia i numer ID.
- Kluczowe informacje: Numer zamówienia, skrót listy pozycji (opcjonalnie), link do historii, CTA powrotu do wklejania.
- Komponenty: SuccessPanel, OrderIdBadge, ContinueButton, ViewHistoryLink.
- UX / Dostępność / Bezpieczeństwo: Wyraźny różnicujący styl; aria-live dla komunikatu; możliwość kopiowania numeru zamówienia; brak wrażliwych danych.

### 2.10 Widok: Historia zamówień

- Ścieżka: `/app/history`
- Główny cel: Lista wcześniejszych zamówień użytkownika.
- Kluczowe informacje: Numer zamówienia, status, kwota, data, paginacja.
- Komponenty: HistoryTable, StatusBadge, PaginationControls, EmptyState, LoadingSkeleton.
- UX / Dostępność / Bezpieczeństwo: Sortowanie domyślne malejąco po dacie; wiersze klikalne (role="button" + aria-label); jasny EmptyState jeśli brak zamówień; ochrona przed nadmiernym pobieraniem (limit parametryzowany).

### 2.11 Widok: Szczegóły zamówienia

- Ścieżka: `/app/history/[id]`
- Główny cel: Szczegółowa lista pozycji i metadanych zamówienia.
- Kluczowe informacje: Numer, data, status, lista pozycji (nazwa, ilość, cena jednostkowa), suma.
- Komponenty: OrderDetailTable, StatusBadge, BackToHistoryLink.
- UX / Dostępność / Bezpieczeństwo: Semantyczne nagłówki tabeli; aria-describedby dla statusu; możliwość szybkiego powrotu; brak edycji (read-only); zabezpieczenie przed dostępem nieautoryzowanym przez RLS (obsługa 404/Unauthorized UI).

### 2.12 Widok: Profil użytkownika

- Ścieżka: `/app/profile`
- Główny cel: Minimalna prezentacja danych konta i wylogowanie.
- Kluczowe informacje: Adres e‑mail, pełne imię (edycja), rola (read-only), przycisk wylogowania.
- Komponenty: ProfilePanel, EditableField (full_name), SaveProfileButton, LogoutButton.
- UX / Dostępność / Bezpieczeństwo: Inline edycja z enter/escape; aria-live przy sukcesie/błędzie zapisu; wylogowanie czyści sesję; brak ekspozycji wrażliwych danych.

### 2.13 Globalny Layout

- Ścieżka: (Layout) `src/layouts/Layout.astro`
- Główny cel: Spójny układ nawigacyjny i kontekst aplikacji.
- Kluczowe informacje: Sidebar nawigacja, TopBar z koszykiem, wyszukiwaniem, profile menu.
- Komponenty: LayoutShell, SidebarNav, TopBar, CartTrigger, CommandPaletteTrigger.
- UX / Dostępność / Bezpieczeństwo: Skip link do main; odpowiedni kontrast; oznaczenie bieżącej sekcji aria-current; responsywność minimalna (nie priorytet); zabezpieczone wyświetlanie elementów tylko po zalogowaniu.

## 3. Mapa podróży użytkownika

1. Uwierzytelnianie: Użytkownik wchodzi na `/login` → loguje się (lub przechodzi do `/register` / reset) → po sukcesie trafia do `/app`.
2. Tworzenie zamówienia z listy: Na `/app` wkleja listę → klika "Przetwórz" → backend parser (`POST /api/parser/process`) → przejście do `/app/wizard`.
3. Wizard: Każda pozycja wyświetlona sekwencyjnie (pojedyncze dopasowanie / wiele / brak). Użytkownik wybiera produkt i ilość lub pomija/edytuje. Postęp rośnie aż wszystkie pozycje zakończone.
4. Podsumowanie: Automatyczne przejście do `/app/summary` → weryfikacja listy → "Dodaj wszystko do koszyka" (seria `POST /api/cart/items`).
5. Koszyk: Ikona w top bar lub automatyczne otwarcie → modyfikacje ilości (PATCH/DELETE) → "Złóż zamówienie" → potwierdzenie (dialog) → `POST /api/orders`.
6. Sukces: Redirect do `/app/order/success/[id]` → możliwość powrotu do `/app` lub wejścia do historii `/app/history`.
7. Historia: Na `/app/history` użytkownik przegląda zamówienia (`GET /api/orders`) → wybiera jedno → `/app/history/[id]` (szczegóły). Powrót do historii lub tworzenia nowego zamówienia.
8. Profil: `/app/profile` umożliwia lekką edycję danych (`PATCH /api/profiles/me`) i wylogowanie.

## 4. Układ i struktura nawigacji

- LayoutShell: Stały kontener z Sidebar oraz TopBar.
- SidebarNav: Linki do: "Nowe zamówienie" (`/app`), "Kreator" (aktywny tylko w trakcie), "Podsumowanie" (tylko gdy dostępne), (raczej nie "Produkty" (`/app/products`)), "Historia" (`/app/history`), "Profil" (`/app/profile`). Oznaczenie bieżącego widoku aria-current.
- TopBar: Logo/tytuł, ikona koszyka (badge ilości), skrót do CommandPalette (Ctrl+K), avatar/profile quick menu (wyloguj), wskaźniki stanu (opcjonalny offline banner).
- Dialogi (Koszyk, Potwierdzenie, Command Palette) stosują focus trap i ESC close.
- Nawigacja klawiaturą: Tab order logiczny; w wizardzie strzałki dla wyboru; Enter potwierdza; Shift+Tab umożliwia powrót do poprzednich kontrolek.
- Skróty: Ctrl+Enter (przetwarzanie listy), Ctrl+K (paleta), Alt+ArrowRight / Alt+ArrowLeft (nawigacja między krokami wizardu jeśli aktywne).
- Ochrona tras: Middleware upewnia się, że `/app/*` wymagają zalogowania; niezalogowany redirect do `/login` z komunikatem.

## 5. Kluczowe komponenty

- LayoutShell: Ogólny kontener strony z regionami nawigacji i treści (ARIA landmarks: `nav`, `main`).
- SidebarNav: Lista głównych linków; odpowiedzialna za aria-current.
- TopBar: Pasek górny z akcjami globalnymi i stanem koszyka.
- PasteListTextarea: Duże pole tekstowe z instrukcjami formatowania.
- ProcessButton: Akcja inicjująca parsing; zarządza loading state.
- WizardContainer: Logika kroków, zarządza stanem, dostarcza kontekst do widoków kroków.
- WizardProgress: Pasek/tekst postępu (Krok X z Y) z aria-valuenow/aria-valuemax.
- SingleMatchCard: Prezentacja pojedynczego produktu z polem ilości.
- MultiMatchGrid: Siatka kart produktów dla wielu dopasowań; obsługa wyboru klawiaturą.
- NotFoundPanel: Komunikat braku dopasowania; akcje edycji/pominięcia/wyszukiwania.
- QuantityInput: Ustandaryzowany komponent do ilości z walidacją i klawiaturą (ArrowUp/ArrowDown).
- SummaryTable: Lista wybranych pozycji przed dodaniem do koszyka.
- CartDialog: Modal z zawartością koszyka; edycja ilości, usuwanie, suma.
- CartItemRow: Wiersz koszyka z ilością, ceną, subtotalem.
- ConfirmOrderDialog: Potwierdzenie przed finalizacją; wyświetla sumaryczne dane.
- SuccessPanel: Podziękowanie + numer zamówienia.
- SearchBar: Pole wyszukiwania produktów (z debounce, aria-label).
- ProductCard / ProductTable: Prezentacja produktu w katalogu; przycisk dodania do koszyka.
- HistoryTable: Lista zamówień z klikalnymi wierszami.
- OrderDetailTable: Szczegóły pojedynczego zamówienia.
- ProfilePanel: Prezentacja danych profilu; edycja full_name.
- CommandPalette: Szybkie akcje i wyszukiwanie; sekcje i elementy komend.
- LoadingSkeleton: Placeholder dla stanów ładowania.
- EmptyState: Spójny komponent dla pustych kolekcji.
- ErrorAlert / ToastNotifications: Komunikaty błędów i sukcesu (aria-live).
- StatusBadge: Wizualizacja statusu zamówienia.
- PaginationControls: Nawigacja paginacją (przy katalogu i historii).

---

Architektura powyżej odwzorowuje wszystkie wymagania funkcjonalne (FR-01 – FR-06) oraz mapuje user stories (US-001 – US-011) na konkretne widoki i komponenty, uwzględniając integrację z API, dostępność, bezpieczeństwo oraz redukcję punktów bólu użytkownika poprzez uproszczony, przewidywalny przepływ i spójne wzorce interakcji.
