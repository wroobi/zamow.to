Główne wymagania dotyczące schematu:
Schemat musi obsługiwać pełen cykl życia użytkownika i zamówienia: rejestrację, zarządzanie profilem i adresami, tworzenie i modyfikację koszyka, składanie zamówienia (w tym z parsowanego tekstu) oraz przeglądanie historii zamówień. Struktura została zaprojektowana z myślą o przyszłej rozbudowie, m.in. o panel administratora.

Kluczowe encje i ich relacje:

Użytkownicy: Encja auth.users z Supabase jest rozszerzona o tabelę profiles (relacja 1:1), która przechowuje dodatkowe dane, jak full_name, role i flagę is_deactivated.
Produkty: Tabela products zawiera katalog produktów z ceną, SKU i flagą is_archived. Jest powiązana z tabelą categories.
Koszyk: Każdy użytkownik ma jeden koszyk (carts, relacja 1:1 z users), który zawiera pozycje (cart_items).
Zamówienia: Tabela orders przechowuje historyczne zamówienia, a order_items ich szczegółowe pozycje. Kluczowe dane, jak cena i nazwa produktu, są denormalizowane w order_items w celu zapewnienia historycznej poprawności.
Adresy: Tabela addresses przechowuje adresy użytkowników, które mogą być powiązane z zamówieniami.
Bezpieczeństwo i skalowalność:

Bezpieczeństwo: Podstawą bezpieczeństwa są polityki RLS, które rygorystycznie izolują dane użytkowników. Dostęp do danych jest możliwy tylko dla właściciela lub administratora. Wrażliwe operacje, jak usuwanie kont, są obsługiwane przez mechanizm "soft delete".
Skalowalność: Schemat jest przygotowany na wzrost. Użycie UUID jako kluczy głównych, wprowadzenie indeksów na kluczowych kolumnach (np. orders.user_id) oraz denormalizacja w celu optymalizacji odczytu (np. orders.total_amount) zapewniają dobrą wydajność. Struktura jest elastyczna i gotowa na dodanie nowych funkcji, jak zarządzanie dostawcami czy zaawansowane role.
