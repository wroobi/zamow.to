# API Endpoint Implementation Plan: GET /api/products

## 1. Przegląd punktu końcowego

Ten punkt końcowy jest odpowiedzialny za pobieranie listy produktów z katalogu. Zapewnia funkcje wyszukiwania, filtrowania według kategorii oraz paginacji, umożliwiając klientom efektywne przeglądanie dostępnych produktów. Domyślnie zwraca pierwszą stronę z 20 produktami.

## 2. Szczegóły żądania

- **Metoda HTTP**: `GET`
- **Struktura URL**: `/api/products`
- **Parametry zapytania (Query Parameters)**:
  - **Opcjonalne**:
    - `search` (string): Termin do wyszukania w nazwie produktu.
    - `category_id` (uuid): UUID kategorii do filtrowania produktów.
    - `page` (integer, domyślnie: 1): Numer strony do pobrania.
    - `limit` (integer, domyślnie: 20): Liczba produktów na stronie (maksymalnie 100).

## 3. Wykorzystywane typy

- **DTO (Data Transfer Objects)**:
  - `ProductListItemDto`: Reprezentuje pojedynczy produkt na liście.
    ```typescript
    // src/types.ts
    export type ProductListItemDto = Pick<Product, "id" | "name" | "description" | "price" | "sku" | "category_id">;
    ```
  - `PaginatedResponse<T>`: Generyczny typ dla paginowanych odpowiedzi, który zostanie dodany do `src/types.ts`.
    ```typescript
    // src/types.ts
    export interface PaginatedResponse<T> {
      data: T[];
      pagination: {
        page: number;
        limit: number;
        total: number;
      };
    }
    ```
- **Modele poleceń (Command Models)**: Brak, ponieważ jest to żądanie typu `GET`.

## 4. Przepływ danych

1.  Żądanie `GET` trafia do pliku `src/pages/api/products.ts`.
2.  Parametry zapytania (`search`, `category_id`, `page`, `limit`) są odczytywane z `Astro.url.searchParams`.
3.  Schemat walidacji `zod` jest używany do walidacji i transformacji parametrów. W przypadku błędu zwracany jest status `400 Bad Request`.
4.  Wywoływana jest metoda `getProducts` z nowo utworzonego serwisu `src/lib/services/product.service.ts`, przekazując zwalidowane parametry.
5.  Serwis `ProductService` używa klienta `Supabase` (z `context.locals.supabase`) do zbudowania zapytania:
    - Rozpoczyna od `supabase.from('products').select('*, category:categories(name)', { count: 'exact' })`.
    - Dodaje warunek `where('is_archived', 'eq', false)`, aby wykluczyć produkty zarchiwizowane.
    - Jeśli parametr `search` jest obecny, dodaje filtr `ilike('name', \`%${search}%\`)`.
    - Jeśli parametr `category_id` jest obecny, dodaje filtr `eq('category_id', category_id)`.
    - Stosuje paginację za pomocą `.range((page - 1) * limit, page * limit - 1)`.
6.  Baza danych wykonuje zapytanie i zwraca listę produktów oraz całkowitą liczbę pasujących rekordów.
7.  Serwis mapuje wyniki na `PaginatedResponse<ProductListItemDto>` i zwraca je do kontrolera.
8.  Kontroler w `src/pages/api/products.ts` serializuje odpowiedź do formatu JSON i wysyła ją z kodem statusu `200 OK`.

## 5. Względy bezpieczeństwa

- **Walidacja wejścia**: Wszystkie parametry zapytania są rygorystycznie walidowane za pomocą `zod`, aby zapobiec nieoczekiwanym danym wejściowym.
- **Ochrona przed SQL Injection**: Użycie klienta Supabase zapewnia parametryzację zapytań, co eliminuje ryzyko SQL Injection.
- **Kontrola dostępu**: Zapytanie filtruje produkty, aby wykluczyć te oznaczone jako zarchiwizowane (`is_archived = false`), uniemożliwiając ich publiczne wyświetlanie.
- **Ochrona przed DoS**: Maksymalna wartość parametru `limit` jest ograniczona do 100, aby zapobiec nadmiernemu obciążeniu bazy danych przez żądania dużej ilości danych.

## 6. Obsługa błędów

- **`400 Bad Request`**: Zwracany, gdy walidacja parametrów zapytania (`page`, `limit`, `category_id`) nie powiodła się. Odpowiedź będzie zawierać szczegóły błędu walidacji z `zod`.
- **`500 Internal Server Error`**: Zwracany w przypadku nieoczekiwanych problemów po stronie serwera, takich jak błąd połączenia z bazą danych lub inny błąd wykonania w serwisie. Błąd zostanie zalogowany na konsoli serwera w celu dalszej analizy.

## 7. Rozważania dotyczące wydajności

- **Paginacja**: Kluczowy element zapewniający wydajność. Ograniczenie `limit` do 100 zapobiega pobieraniu zbyt dużych zbiorów danych.
- **Indeksowanie bazy danych**: Aby zapewnić szybkie wyszukiwanie i filtrowanie, należy upewnić się, że kolumny `name` i `category_id` w tabeli `products` są odpowiednio zindeksowane.
- **Liczba zapytań**: Zapytanie jest zoptymalizowane do jednego wywołania bazy danych, które jednocześnie pobiera dane i zlicza całkowitą liczbę rekordów (`{ count: 'exact' }`), co minimalizuje narzut komunikacyjny.

## 8. Etapy wdrożenia

1.  **Aktualizacja typów**: Zdefiniuj generyczny interfejs `PaginatedResponse<T>` w pliku `src/types.ts`.
2.  **Utworzenie serwisu**: Stwórz nowy plik `src/lib/services/product.service.ts`.
3.  **Implementacja logiki serwisu**: W `product.service.ts` zaimplementuj metodę `getProducts`, która będzie zawierać logikę budowania i wykonywania zapytania do Supabase.
4.  **Utworzenie pliku endpointu**: Stwórz plik `src/pages/api/products.ts`.
5.  **Implementacja walidacji**: W `products.ts` dodaj schemat walidacji `zod` dla parametrów zapytania.
6.  **Implementacja obsługi żądania**: W `products.ts` zaimplementuj logikę obsługi żądania `GET`, w tym walidację, wywołanie serwisu `ProductService` oraz obsługę błędów.
7.  **Zapewnienie indeksów w bazie danych**: Sprawdź, czy w migracji Supabase (`supabase/migrations/*`) istnieją indeksy dla kolumn `products(name)` i `products(category_id)`. Jeśli nie, dodaj je.
8.  **Testowanie**: Przygotuj i przeprowadź testy manualne lub automatyczne, uwzględniając różne kombinacje parametrów (`search`, `category_id`, `page`, `limit`) oraz scenariusze błędów.
