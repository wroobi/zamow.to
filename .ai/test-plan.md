### **Plan Testów dla Aplikacji `zamow.to`**

---

**Wersja:** 1.0
**Data:** 04.12.2025
**Autor:** Doświadczony Inżynier QA

---

### 1. Wprowadzenie i Cele Testowania

#### 1.1. Wprowadzenie

Niniejszy dokument opisuje strategię, zakres, podejście oraz zasoby przeznaczone na proces testowania aplikacji `zamow.to`. Projekt ma na celu umożliwienie użytkownikom szybkiego tworzenia list zakupowych poprzez wklejanie tekstu, który jest automatycznie przetwarzany przez model AI. Plan ten stanowi podstawę do weryfikacji jakości, funkcjonalności, niezawodności i bezpieczeństwa aplikacji przed jej wdrożeniem produkcyjnym.

#### 1.2. Cele Testowania

Głównym celem jest zapewnienie, że aplikacja `zamow.to` spełnia wszystkie wymagania biznesowe i techniczne zdefiniowane w dokumentacji projektu (PRD).

**Cele szczegółowe:**

- **Weryfikacja kluczowej funkcjonalności:** Potwierdzenie, że mechanizm parsowania listy produktów działa dokładnie i niezawodnie dla szerokiego spektrum danych wejściowych.
- **Zapewnienie bezpieczeństwa:** Sprawdzenie, czy dane użytkowników, w tym historia zamówień i dane uwierzytelniające, są w pełni bezpieczne i odizolowane.
- **Potwierdzenie stabilności i wydajności:** Upewnienie się, że aplikacja działa stabilnie i responsywnie pod oczekiwanym obciążeniem.
- **Zapewnienie jakości UI/UX:** Weryfikacja, czy interfejs użytkownika jest intuicyjny, spójny wizualnie, responsywny i zgodny z zasadami dostępności (WCAG).
- **Identyfikacja i eliminacja defektów:** Wykrycie, zaraportowanie i śledzenie błędów w celu ich naprawy przed wdrożeniem.

---

### 2. Zakres Testów

#### 2.1. Funkcjonalności objęte testami:

- **Moduł Uwierzytelniania:**
  - Rejestracja nowego użytkownika.
  - Logowanie i wylogowywanie.
  - Resetowanie hasła.
  - Ochrona tras wymagających autoryzacji.
- **Główna Funkcjonalność - Przetwarzanie Listy Produktów:**
  - Wklejanie i wprowadzanie tekstu w dedykowanym polu.
  - Przetwarzanie listy przez API (`/api/parser/process`).
  - Poprawność interpretacji danych przez model AI (OpenRouter).
  - Wyświetlanie przetworzonych produktów w interfejsie użytkownika.
  - Obsługa różnych formatów list (listy numerowane, nienumerowane, z błędami, puste).
- **Zarządzanie Produktami:**
  - Pobieranie i wyświetlanie produktów (API `/api/products`).
- **Interfejs Użytkownika (UI):**
  - Wygląd i działanie wszystkich komponentów `shadcn/ui`.
  - Responsywność na różnych urządzeniach (desktop, tablet, mobile).
  - Płynność przejść między stronami (Astro View Transitions).

#### 2.2. Funkcjonalności wyłączone z testów:

- Testowanie wewnętrznej logiki komponentów `shadcn/ui` (zakładamy, że są przetestowane przez twórców).
- Bezpośrednie testowanie infrastruktury Supabase i DigitalOcean (skupiamy się na integracji z nimi).

---

### 3. Typy Testów do Przeprowadzenia

Proces testowania zostanie podzielony na kilka poziomów, aby zapewnić kompleksowe pokrycie.

- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja pojedynczych funkcji, komponentów React i usług w izolacji.
  - **Zakres:** Funkcje pomocnicze (`/lib/utils.ts`), customowe hooki React (`/components/hooks`), serwisy (`/lib/services`).
  - **Narzędzia:** Vitest, React Testing Library.
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Sprawdzenie współpracy między różnymi częściami systemu.
  - **Zakres:**
    - Integracja komponentów React z logiką backendową (np. formularz logowania wysyłający dane do API).
    - Integracja middleware Astro z logiką autoryzacji.
    - Integracja z API Supabase (z użyciem mocków).
    - Integracja z API OpenRouter (z użyciem mocków dla przewidywalności wyników).
  - **Narzędzia:** Vitest, React Testing Library, Mock Service Worker (MSW).
- **Testy End-to-End (E2E):**
  - **Cel:** Symulacja rzeczywistych scenariuszy użytkownika w przeglądarce.
  - **Zakres:** Pełne ścieżki użytkownika, np. "rejestracja -> logowanie -> wklejenie listy -> przetworzenie -> wylogowanie".
  - **Narzędzia:** Playwright .
- **Testy API:**
  - **Cel:** Bezpośrednia weryfikacja endpointów API w `src/pages/api`.
  - **Zakres:** Sprawdzanie poprawności odpowiedzi, kodów statusu, obsługi błędów i walidacji danych wejściowych (Zod).
  - **Narzędzia:** Postman, Vitest (z użyciem `fetch`).
- **Testy Bezpieczeństwa:**
  - **Cel:** Identyfikacja i eliminacja luk w zabezpieczeniach.
  - **Zakres:**
    - Weryfikacja polityk Row Level Security (RLS) w Supabase – upewnienie się, że użytkownik A nie ma dostępu do danych użytkownika B.
    - Testowanie ochrony endpointów API przed nieautoryzowanym dostępem.
    - Sprawdzenie, czy klucze API (np. do OpenRouter) nie są eksponowane po stronie klienta.
  - **Metody:** Manualna inspekcja, automatyczne testy API z różnymi poświadczeniami.
- **Testy Wydajnościowe (opcjonalnie, po MVP):**
  - **Cel:** Ocena szybkości działania aplikacji pod obciążeniem.
  - **Zakres:** Czas odpowiedzi API (zwłaszcza parsera AI), czas ładowania stron (LCP, FCP).
  - **Narzędzia:** Google Lighthouse, `k6`.
- **Testy Wizualnej Regresji:**
  - **Cel:** Wykrywanie niezamierzonych zmian w interfejsie użytkownika.
  - **Zakres:** Kluczowe widoki i komponenty.
  - **Narzędzia:** Playwright (z porównywaniem screenshotów) lub Chromatic.

---

### 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

#### 4.1. Przetwarzanie Listy Produktów (Priorytet: Krytyczny)

| ID Scenariusza | Opis                                                                  | Oczekiwany Rezultat                                                                           |
| :------------- | :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| TC-PAR-001     | Użytkownik wkleja poprawnie sformatowaną, numerowaną listę produktów. | System poprawnie identyfikuje wszystkie produkty, ilości i jednostki.                         |
| TC-PAR-002     | Użytkownik wkleja listę z myślnikami zamiast numerów.                 | System poprawnie identyfikuje wszystkie produkty.                                             |
| TC-PAR-003     | Użytkownik wkleja listę z literówkami i błędami.                      | System podejmuje próbę poprawnej interpretacji, ewentualnie oznacza produkty jako "niepewne". |
| TC-PAR-004     | Użytkownik wkleja pusty tekst.                                        | System wyświetla komunikat informujący o braku danych do przetworzenia.                       |
| TC-PAR-005     | Użytkownik wkleja bardzo długą listę (np. 100 pozycji).               | System przetwarza listę w akceptowalnym czasie, bez zawieszania interfejsu.                   |
| TC-PAR-006     | API OpenRouter zwraca błąd serwera (5xx).                             | System wyświetla użytkownikowi zrozumiały komunikat o błędzie i umożliwia ponowienie próby.   |
| TC-PAR-007     | API OpenRouter jest niedostępne (timeout).                            | System informuje o problemie z połączeniem i sugeruje spróbować ponownie później.             |

#### 4.2. Uwierzytelnianie i Autoryzacja (Priorytet: Krytyczny)

| ID Scenariusza | Opis                                                                   | Oczekiwany Rezultat                                                               |
| :------------- | :--------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| TC-AUTH-001    | Użytkownik rejestruje się z unikalnym adresem e-mail.                  | Konto zostaje utworzone, użytkownik jest zalogowany i przekierowany do aplikacji. |
| TC-AUTH-002    | Użytkownik próbuje zarejestrować się z już istniejącym adresem e-mail. | System wyświetla komunikat o zajętym adresie e-mail.                              |
| TC-AUTH-003    | Użytkownik loguje się z poprawnymi danymi.                             | Użytkownik jest zalogowany, sesja (cookie) jest ustawiona.                        |
| TC-AUTH-004    | Użytkownik loguje się z niepoprawnym hasłem.                           | System wyświetla komunikat o błędnych danych logowania.                           |
| TC-AUTH-005    | Niezalogowany użytkownik próbuje uzyskać dostęp do strony `/app`.      | Użytkownik jest przekierowany na stronę logowania (`/auth/login`).                |
| TC-AUTH-006    | Użytkownik A (zalogowany) próbuje odpytać API o dane użytkownika B.    | Dostęp zostaje zablokowany (dzięki RLS w Supabase).                               |

#### 4.2.1 Plan pokrycia testami jednostkowymi logowania

Plan obejmuje moduły `src/components/auth/LoginForm.tsx`, `src/pages/api/auth/login.ts` oraz `src/middleware/index.ts`. Testy przygotowujemy w Vitest z wykorzystaniem React Testing Library i globalnych mocków konfigurowanych w `vitest.setup.ts`. Każdy scenariusz TC-AUTH otrzymuje dedykowany zestaw przypadków testowych odwzorowujących oczekiwane ścieżki oraz obsługę błędów.

- **TC-AUTH-003 – logowanie z poprawnymi danymi**
  - LoginForm: mock `global.fetch` (`ok: true`), `toast.success` i `window.location.assign`; asercje na wysłanie żądania `POST`, blokadę przycisku oraz przekierowanie po sukcesie.
  - Endpoint `/api/auth/login`: mock `createSupabaseServerInstance` z pozytywnym wynikiem `signInWithPassword`; weryfikacja statusu `200`, poprawnej walidacji Zod i przekazania ciasteczek/nagłówków.

- **TC-AUTH-004 – logowanie z błędnym hasłem**
  - LoginForm: `fetch` zwraca `ok: false`; oczekujemy `toast.error` i braku zmiany lokalizacji.
  - Endpoint `/api/auth/login`: `signInWithPassword` zwraca błąd; asercja statusu `401` oraz komunikatu. Dodatkowy test walidacji schematu (np. krótkie hasło) -> status `400`.

- **TC-AUTH-005 – ochrona tras przed gościem**
  - Middleware: symulacja `url.pathname = "/app"` oraz `getUser` zwracającego `null`; spodziewamy się wywołania `redirect("/auth/login")` i niedopuszczenia do `next()`.
  - Ścieżki publiczne: test kontrolny z `url.pathname = "/auth/login"` sprawdzający, że `next()` jest wywoływane bez redirectu.

- **TC-AUTH-006 – separacja danych zalogowanych użytkowników**
  - Middleware: `getUser` zwraca obiekt użytkownika; asercja, że `locals.user` jest uzupełnione i `next()` wykonuje się bez przekierowania.
  - Endpoint `/api/auth/login`: weryfikacja, że `createSupabaseServerInstance` otrzymuje `cookies` i nagłówki żądania (podstawa dla dalszych zapytań objętych RLS). Scenariusz z błędem sesji powinien zwrócić `401`.

- **Mocki i narzędzia wspólne**
  - Globalne mocki w `vitest.setup.ts`: `sonner` (`toast.success`, `toast.error`), `window.location` oraz fabryka supabase.
  - W testach komponentów używamy React Testing Library z `userEvent` oraz `await waitFor`. Po każdym teście `vi.resetAllMocks()`.

---

### 5. Środowisko Testowe

- **Środowisko lokalne:** Komputery deweloperskie z uruchomioną aplikacją w trybie deweloperskim (`npm run dev`).
- **Środowisko Staging/Pre-produkcyjne:** Dedykowana instancja aplikacji wdrożona na DigitalOcean, połączona z osobną, testową bazą danych Supabase. To środowisko będzie repliką środowiska produkcyjnego.
- **Przeglądarki:** Testy będą przeprowadzane na najnowszych wersjach Chrome, Firefox i Safari.

---

### 6. Narzędzia do Testowania

- **Framework do testów jednostkowych i integracyjnych:** Vitest
- **Biblioteka do testowania komponentów React:** React Testing Library
- **Framework do testów E2E:** Playwright
- **Mockowanie API:** Mock Service Worker (MSW)
- **Testy manualne API:** Postman
- **CI/CD:** GitHub Actions (do automatycznego uruchamiania testów przy każdym pushu i pull requeście)
- **Zarządzanie zadaniami i błędami:** GitHub Issues

---

### 7. Harmonogram Testów

Proces testowania będzie prowadzony równolegle z procesem deweloperskim.

- **Sprint 1-2 (Rozwój MVP):**
  - Tworzenie i utrzymanie testów jednostkowych dla nowo powstałych funkcji.
  - Konfiguracja i implementacja testów API dla kluczowych endpointów.
  - Rozpoczęcie budowy szkieletu testów E2E.
- **Sprint 3 (Stabilizacja MVP):**
  - Intensywne testy integracyjne i E2E.
  - Przeprowadzenie pełnej rundy testów manualnych dla wszystkich scenariuszy.
  - Testy bezpieczeństwa (weryfikacja RLS).
- **Przed wdrożeniem:**
  - Testy regresji w celu upewnienia się, że ostatnie poprawki nie zepsuły istniejących funkcjonalności.
  - Ostateczna akceptacja testów.

---

### 8. Kryteria Akceptacji Testów

#### 8.1. Kryteria Wejścia (Rozpoczęcia Testów)

- Funkcjonalność jest zaimplementowana i dostępna na środowisku testowym.
- Testy jednostkowe dla danej funkcjonalności zostały napisane i przechodzą pomyślnie.

#### 8.2. Kryteria Wyjścia (Zakończenia Testów)

- **Dla MVP:**
  - 100% scenariuszy testowych o priorytecie "Krytyczny" zakończonych pomyślnie.
  - Minimum 95% scenariuszy o priorytecie "Wysoki" zakończonych pomyślnie.
  - Brak otwartych błędów o statusie "Blokujący" lub "Krytyczny".
  - Pokrycie kodu testami jednostkowymi na poziomie min. 70%.

---

### 9. Role i Odpowiedzialności

- **Deweloperzy:**
  - Pisanie testów jednostkowych dla swojego kodu.
  - Naprawianie błędów zgłoszonych przez zespół QA.
  - Utrzymanie środowiska CI/CD.
- **Inżynier QA:**
  - Tworzenie i utrzymanie planu testów.
  - Projektowanie i implementacja testów integracyjnych, E2E i API.
  - Przeprowadzanie testów manualnych i eksploracyjnych.
  - Raportowanie i weryfikacja błędów.
  - Końcowa akceptacja jakości produktu.
- **Product Owner:**
  - Dostarczanie wymagań i kryteriów akceptacji.
  - Ustalanie priorytetów dla błędów.

---

### 10. Procedury Raportowania Błędów

Wszystkie zidentyfikowane błędy będą raportowane w systemie **GitHub Issues**.

**Każdy raport o błędzie musi zawierać:**

- **Tytuł:** Zwięzły i jednoznaczny opis problemu.
- **Środowisko:** Wersja aplikacji, przeglądarka, system operacyjny.
- **Kroki do odtworzenia:** Szczegółowa, numerowana lista kroków prowadzących do wystąpienia błędu.
- **Obserwowany rezultat:** Co się stało.
- **Oczekiwany rezultat:** Co powinno się stać.
- **Dowody:** Zrzuty ekranu, nagrania wideo, logi z konsoli.
- **Priorytet:**
  - **Blokujący (Blocker):** Uniemożliwia dalsze testowanie kluczowych funkcjonalności.
  - **Krytyczny (Critical):** Błąd w głównej funkcjonalności, utrata danych, luka bezpieczeństwa.
  - **Wysoki (High):** Znaczący błąd funkcjonalny, który ma obejście.
  - **Średni (Medium):** Błąd w UI, drobny błąd funkcjonalny.
  - **Niski (Low):** Literówka, problem kosmetyczny.
