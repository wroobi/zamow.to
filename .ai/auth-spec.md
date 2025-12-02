# Specyfikacja Techniczna: Moduł Autentykacji Użytkowników

Data: 02.12.2025

## 1. Przegląd

Niniejszy dokument opisuje architekturę i plan implementacji modułu autentykacji (rejestracja, logowanie, odzyskiwanie hasła) dla aplikacji `zamow.to`. Specyfikacja bazuje na wymaganiach zdefiniowanych w PRD (US-001, US-002, US-003), wybranym stosie technologicznym (Astro, React, Supabase) oraz szczegółowych instrukcjach integracji `supabase-auth.mdc`.

Celem jest wdrożenie bezpiecznego i wydajnego systemu zarządzania tożsamością użytkownika, który będzie w pełni zintegrowany z istniejącą architekturą aplikacji opartą o Astro i SSR.

## 2. Architektura Interfejsu Użytkownika (Frontend)

### 2.1. Nowe Strony (Astro)

W celu obsługi procesów autentykacji, utworzone zostaną następujące strony w katalogu `src/pages/auth/`:

- `src/pages/auth/login.astro`: Strona logowania. Będzie renderować komponent `LoginForm.tsx`.
- `src/pages/auth/register.astro`: Strona rejestracji. Będzie renderować komponent `RegisterForm.tsx`.
- `src/pages/auth/reset-password.astro`: Strona do inicjowania procesu resetowania hasła. Będzie renderować komponent `ResetPasswordForm.tsx`.
- `src/pages/auth/update-password.astro`: Strona do ustawiania nowego hasła, na którą użytkownik trafia z linku w mailu. Będzie renderować komponent `UpdatePasswordForm.tsx`.

Wszystkie powyższe strony będą korzystać z nowego layoutu `AuthLayout.astro` i będą renderowane po stronie serwera (`export const prerender = false;`), aby zapewnić, że użytkownicy już zalogowani będą mogli być automatycznie przekierowani do panelu aplikacji.

### 2.2. Nowy Layout (Astro)

- `src/layouts/AuthLayout.astro`: Prosty layout przeznaczony dla stron autentykacji. Będzie zawierał logo aplikacji i wyśrodkowany kontener na formularze React. Nie będzie zawierał nawigacji dostępnej dla zalogowanego użytkownika.

### 2.3. Nowe Komponenty (React)

Formularze będą zaimplementowane jako komponenty React, aby zapewnić dynamiczną walidację po stronie klienta i interaktywną obsługę błędów bez przeładowywania strony. Zostaną umieszczone w `src/components/auth/`.

- `LoginForm.tsx`:
  - **Pola**: Email, Hasło.
  - **Przyciski**: "Zaloguj się".
  - **Linki**: "Nie masz konta? Zarejestruj się", "Zapomniałeś hasła?".
  - **Logika**: Walidacja pól (formularz nie może być pusty, poprawny format email). Po submisji, wysyła zapytanie `POST` do `/api/auth/login`. Obsługuje stany ładowania i błędu (np. "Nieprawidłowy email lub hasło"). Po sukcesie, przekierowuje na stronę główną aplikacji (`/app`).
- `RegisterForm.tsx`:
  - **Pola**: Email, Hasło, Potwierdź Hasło.
  - **Przyciski**: "Zarejestruj się".
  - **Linki**: "Masz już konto? Zaloguj się".
  - **Logika**: Walidacja pól (niepuste, email, hasła muszą być identyczne). Po submisji, wysyła zapytanie `POST` do `/api/auth/register`. Obsługuje błędy (np. "Użytkownik o tym adresie email już istnieje"). Po sukcesie, użytkownik jest automatycznie logowany i przekierowywany na stronę główną aplikacji (`/app`), zgodnie z logiką Supabase `signUp`, która od razu tworzy sesję.
- `ResetPasswordForm.tsx`:
  - **Pola**: Email.
  - **Przyciski**: "Zresetuj hasło".
  - **Logika**: Po submisji, wysyła zapytanie `POST` do `/api/auth/reset-password`. Po sukcesie, wyświetla komunikat informujący o wysłaniu instrukcji na podany adres email.
- `UpdatePasswordForm.tsx`:
  - **Pola**: Nowe Hasło, Potwierdź Nowe Hasło.
  - **Przyciski**: "Ustaw nowe hasło".
  - **Logika**: Komponent odczyta token z parametrów URL. Po submisji, wyśle zapytanie `POST` do `/api/auth/update-password` wraz z nowym hasłem. Po sukcesie, przekieruje na stronę logowania (`/auth/login`) z komunikatem o pomyślnej zmianie hasła.

Do budowy formularzy i walidacji wykorzystane zostaną biblioteki `react-hook-form` i `zod`, co zapewni spójność walidacji na froncie i backendzie. Komponenty UI zostaną zbudowane w oparciu o `shadcn/ui`.

### 2.4. Modyfikacja Istniejących Elementów

- `src/layouts/Layout.astro`: Główny layout aplikacji zostanie zmodyfikowany, aby dynamicznie renderować interfejs w zależności od stanu zalogowania użytkownika (`Astro.locals.user`).
  - **Stan zalogowany**: Wyświetli nawigację z opcjami takimi jak "Historia zamówień", "Koszyk" oraz przycisk/link "Wyloguj się", który będzie realizował akcję `POST` na `/api/auth/logout`.
  - **Stan niezalogowany**: Wyświetli przyciski "Zaloguj się" i "Zarejestruj się".
- `src/pages/app/index.astro`: Strona główna aplikacji będzie teraz chroniona. Na początku pliku znajdzie się sprawdzenie `Astro.locals.user`. Jeśli użytkownik nie jest zalogowany, zostanie przekierowany na stronę `/auth/login`.

## 3. Logika Backendowa

### 3.1. Struktura API

Zgodnie z instrukcją `supabase-auth.mdc`, utworzone zostaną następujące endpointy w `src/pages/api/auth/`:

- `POST /api/auth/login`:
  - **Model Danych (Request)**: `{ email: string, password: string }`
  - **Logika**: Wywołuje `supabase.auth.signInWithPassword`. W przypadku sukcesu, Supabase automatycznie zarządza sesją poprzez cookies.
  - **Odpowiedź (Sukces)**: `200 OK` z danymi użytkownika.
  - **Odpowiedź (Błąd)**: `400 Bad Request` lub `401 Unauthorized` z komunikatem błędu.
- `POST /api/auth/register`:
  - **Model Danych (Request)**: `{ email: string, password: string }`
  - **Logika**: Wywołuje `supabase.auth.signUp`. Ta metoda w Supabase domyślnie loguje użytkownika po pomyślnej rejestracji, tworząc sesję.
  - **Odpowiedź (Sukces)**: `201 Created` z danymi użytkownika.
  - **Odpowiedź (Błąd)**: `400 Bad Request` z komunikatem błędu (np. "User already registered").
- `POST /api/auth/logout`:
  - **Logika**: Wywołuje `supabase.auth.signOut`. Po wylogowaniu, użytkownik jest przekierowywany na stronę logowania.
  - **Odpowiedź (Sukces)**: Przekierowanie (np. `302 Found`) na `/auth/login`.
  - **Odpowiedź (Błąd)**: `500 Internal Server Error`.
- `POST /api/auth/reset-password`:
  - **Model Danych (Request)**: `{ email: string }`
  - **Logika**: Wywołuje `supabase.auth.resetPasswordForEmail`, podając URL do strony `update-password`.
  - **Odpowiedź**: Zawsze `200 OK`, aby nie ujawniać, czy dany email istnieje w bazie.
- `POST /api/auth/update-password`:
  - **Model Danych (Request)**: `{ password: string }`
  - **Logika**: Endpoint będzie obsługiwał sesję użytkownika zainicjowaną przez token z linku mailowego. Wywoła `supabase.auth.updateUser` do ustawienia nowego hasła.
  - **Odpowiedź (Sukces)**: `200 OK`.
  - **Odpowiedź (Błąd)**: `400 Bad Request` (np. token wygasł, hasło nie spełnia wymagań).

### 3.2. Walidacja i Obsługa Błędów

- **Walidacja**: Wszystkie dane wejściowe w endpointach API będą walidowane przy użyciu biblioteki `zod`. Schematy walidacji będą współdzielone z frontendem (w miarę możliwości), aby zapewnić spójność reguł.
- **Obsługa Błędów**: Błędy zwracane przez Supabase będą mapowane na zrozumiałe dla użytkownika komunikaty i odpowiednie kody statusu HTTP.

### 3.3. Renderowanie Server-Side

Plik `astro.config.mjs` zostanie skonfigurowany z `output: 'server'`, aby włączyć tryb SSR dla całej aplikacji. Jest to kluczowe dla prawidłowego działania middleware'u autentykacji i ochrony stron.

## 4. System Autentykacji (Supabase)

### 4.1. Konfiguracja

- **Zmienne Środowiskowe**: Plik `.env` zostanie utworzony i uzupełniony o `SUPABASE_URL` i `SUPABASE_KEY`. Plik `src/env.d.ts` zostanie zaktualizowany o definicje tych zmiennych.
- **Klient Supabase**: Istniejący plik `src/db/supabase.client.ts` zostanie rozszerzony lub zastąpiony implementacją z `supabase-auth.mdc`, która wykorzystuje `@supabase/ssr` do tworzenia klienta serwerowego zdolnego do zarządzania cookies w kontekście Astro.

### 4.2. Middleware

- `src/middleware/index.ts`: Istniejący middleware zostanie rozszerzony o logikę autentykacji.
  - **Ścieżki publiczne**: Zostanie zdefiniowana tablica `PUBLIC_PATHS`, zawierająca wszystkie nowe strony i endpointy API z `src/pages/auth/`.
  - **Logika**: Dla każdego żądania niebędącego na liście publicznej, middleware będzie:
    1.  Tworzyć instancję Supabase za pomocą `createSupabaseServerInstance`.
    2.  Wywoływać `supabase.auth.getUser()`, aby pobrać sesję użytkownika z cookies.
    3.  Jeśli użytkownik jest zalogowany, jego dane zostaną zapisane w `Astro.locals.user`.
    4.  Jeśli użytkownik nie jest zalogowany, nastąpi przekierowanie do `/auth/login`.
  - **Aktualizacja `PUBLIC_PATHS`**:
    ```typescript
    const PUBLIC_PATHS = [
      "/auth/login",
      "/auth/register",
      "/auth/reset-password",
      "/auth/update-password", // Strona dostępna publicznie (z tokenem)
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/reset-password",
      "/api/auth/update-password",
      "/api/auth/logout",
    ];
    ```

### 4.3. Aktualizacja Typów

Plik `src/env.d.ts` zostanie zaktualizowany o definicję `Astro.locals`, aby zapewnić type-safety dla obiektu `user`:

```typescript
// src/env.d.ts

// ... existing definitions

declare namespace App {
  interface Locals extends Astro.Locals {
    user?: {
      id: string;
      email?: string;
    };
    supabase: import("@supabase/supabase-js").SupabaseClient;
  }
}
```

Ta zmiana zapewni, że w całej aplikacji będziemy mieli dostęp do danych zalogowanego użytkownika w sposób bezpieczny i przewidywalny.
