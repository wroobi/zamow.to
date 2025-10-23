# Dokument wymagań produktu (PRD) - {zamow.to} (MVP)

## 1. Przegląd produktu

Aplikacja {zamow.to} to narzędzie B2B zaprojektowane w celu maksymalnego uproszczenia i przyspieszenia procesu składania zamówień dla użytkowników profesjonalnych. Celem wersji MVP (Minimum Viable Product) jest zademonstrowanie kluczowej funkcjonalności i wartości produktu potencjalnym inwestorom.

Główną propozycją wartości jest inteligentna obsługa wklejonego tekstu, która pozwala użytkownikom na błyskawiczne tworzenie zamówień na podstawie list produktów sporządzonych w zewnętrznych narzędziach (np. notatnik, komunikator). Aplikacja jest skierowana do właścicieli małych firm, takich jak salony fryzjerskie, którzy regularnie zamawiają te same lub podobne produkty i cenią sobie oszczędność czasu ponad poszukiwanie najniższych cen u wielu dostawców.

MVP będzie działać w oparciu o demonstracyjną (mockową) bazę produktów, a procesy płatności i realizacji dostaw będą odbywać się poza systemem.

## 2. Problem użytkownika

Użytkownicy docelowi, tacy jak właściciel salonu fryzjerskiego, obecnie tracą znaczną ilość czasu na proces zamawiania niezbędnych produktów. Ich obecny przepływ pracy jest nieefektywny i rozproszony:

- Muszą przeglądać strony internetowe wielu różnych dostawców, aby skompletować jedno zamówienie.
- Alternatywnie, składają zamówienia telefonicznie, co jest czasochłonne i podatne na błędy.
- Prowadzą listy zakupów w różnych miejscach (notatki, wiadomości), które następnie muszą ręcznie przepisywać lub przenosić do systemów zamówieniowych.

Główną frustracją jest brak jednego, szybkiego narzędzia, które pozwoliłoby zamienić listę potrzebnych produktów w gotowe zamówienie u zaufanego dostawcy w jak najkrótszym czasie. Użytkownik nie chce przeszukiwać katalogów i porównywać ofert; chce szybko i sprawnie uzupełnić zapasy.

## 3. Wymagania funkcjonalne

Poniżej znajduje się lista kluczowych funkcjonalności, które muszą zostać zaimplementowane w ramach MVP.

- FR-01: System Kont Użytkowników
  - Rejestracja nowego użytkownika za pomocą adresu e-mail i hasła.
  - Logowanie do istniejącego konta.
  - Możliwość zresetowania zapomnianego hasła.
- FR-02: Inteligentne Tworzenie Zamówienia z Tekstu
  - Pole tekstowe do wklejania listy produktów.
  - Obsługa list, gdzie produkty są oddzielone nową linią.
  - Obsługa list, gdzie produkty są oddzielone przecinkiem lub średnikiem.
  - Mechanizm przetwarzania listy krok po kroku, który dla każdej pozycji z tekstu wyszukuje pasujące produkty w bazie danych.
  - Interfejs pozwalający użytkownikowi wybrać właściwy produkt, jeśli system znajdzie kilka pasujących pozycji.
  - Możliwość łatwej edycji lub ręcznego wyszukania produktu, jeśli system nie znajdzie żadnego dopasowania.
- FR-03: Katalog Produktów
  - Możliwość ręcznego wyszukiwania produktów w demonstracyjnym katalogu.
- FR-04: Koszyk Zakupów
  - Dodawanie produktów do koszyka (zarówno z przetworzonej listy, jak i z ręcznego wyszukiwania).
  - Przeglądanie zawartości koszyka.
  - Możliwość zmiany ilości produktów w koszyku.
  - Możliwość usunięcia produktów z koszyka.
- FR-05: Proces Składania Zamówienia
  - Finalizacja zamówienia (proces "offline").
  - Wysyłanie automatycznego powiadomienia e-mail z podsumowaniem zamówienia do użytkownika.
- FR-06: Historia Zamówień
  - Dostęp do listy wszystkich historycznych zamówień złożonych przez użytkownika.
  - Możliwość przeglądania szczegółów każdego zamówienia (lista produktów, data).

## 4. Granice produktu

### Co wchodzi w zakres MVP

- Wszystkie funkcjonalności wymienione w sekcji 3.
- Działanie na demonstracyjnej (mockowej) bazie produktów i stanów magazynowych.
- Uproszczony model konta: jeden e-mail to jedno konto.
- Proces zamawiania offline (bez płatności i integracji logistycznych).
- Jasne komunikaty w interfejsie informujące o demonstracyjnym charakterze aplikacji.

### Co NIE wchodzi w zakres MVP

- Płatności online: Brak integracji z bramkami płatniczymi.
- Integracje z systemami zewnętrznymi: Brak połączeń API z hurtowniami, sklepami czy systemami magazynowymi.
- Rekomendacje produktów: System nie będzie sugerował użytkownikowi dodatkowych produktów.
- Zamówienia cykliczne: Brak funkcji automatycznego tworzenia powtarzających się zamówień.
- Zaawansowane zarządzanie kontem: Brak ról użytkowników, kont firmowych itp.
- Panel administracyjny do zarządzania produktami (opcjonalnie, jeśli czas pozwoli).

## 5. Historyjki użytkowników

### Zarządzanie kontem

- ID: US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik, chcę móc założyć konto w aplikacji używając mojego adresu e-mail i hasła, aby uzyskać dostęp do jej funkcjonalności.
- Kryteria akceptacji:

  1.  Formularz rejestracji zawiera pola na adres e-mail, hasło i potwierdzenie hasła.
  2.  System waliduje poprawność formatu adresu e-mail.
  3.  System sprawdza, czy hasła w obu polach są identyczne.
  4.  Po pomyślnej rejestracji, jestem automatycznie zalogowany i przekierowany na główny ekran aplikacji.
  5.  Jeśli adres e-mail jest już zajęty, system wyświetla czytelny komunikat o błędzie.

- ID: US-002
- Tytuł: Logowanie do systemu
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji podając mój e-mail i hasło, aby móc składać zamówienia.
- Kryteria akceptacji:

  1.  Formularz logowania zawiera pola na adres e-mail i hasło.
  2.  Po poprawnym wprowadzeniu danych, jestem zalogowany i przekierowany na główny ekran aplikacji.
  3.  W przypadku podania błędnego e-maila lub hasła, system wyświetla stosowny komunikat.

- ID: US-003
- Tytuł: Resetowanie zapomnianego hasła
- Opis: Jako użytkownik, który zapomniał hasła, chcę mieć możliwość jego zresetowania, aby odzyskać dostęp do mojego konta.
- Kryteria akceptacji:
  1.  Na stronie logowania znajduje się link "Zapomniałem hasła".
  2.  Po kliknięciu linku, mogę wpisać mój adres e-mail, aby otrzymać instrukcje resetowania.
  3.  System wysyła na podany adres e-mail link do strony, na której mogę ustawić nowe hasło.
  4.  Po pomyślnej zmianie hasła, mogę zalogować się przy użyciu nowych danych.

### Proces zamawiania

- ID: US-004
- Tytuł: Tworzenie zamówienia przez wklejenie listy
- Opis: Jako fryzjer, chcę wkleić listę produktów skopiowaną z notatnika, aby aplikacja automatycznie przetworzyła ją i przygotowała do dodania do koszyka.
- Kryteria akceptacji:

  1.  Na głównym ekranie widoczne jest duże pole tekstowe do wklejania tekstu.
  2.  Po wklejeniu tekstu i kliknięciu przycisku "Przetwórz", system rozpoczyna analizę.
  3.  Aplikacja poprawnie dzieli na osobne pozycje tekst, w którym produkty są w nowych liniach.
  4.  Aplikacja poprawnie dzieli na osobne pozycje tekst, w którym produkty są rozdzielone przecinkiem lub średnikiem.

- ID: US-005
- Tytuł: Dopasowywanie produktów z przetworzonej listy
- Opis: Jako użytkownik, po przetworzeniu mojej listy, chcę przejść przez każdą pozycję, aby potwierdzić lub wybrać właściwy produkt z bazy danych.
- Kryteria akceptacji:

  1.  Po przetworzeniu listy, system prezentuje mi pierwszą pozycję z listy i znalezione dla niej dopasowania.
  2.  Jeśli znaleziono dokładnie jeden pasujący produkt, jest on domyślnie sugerowany.
  3.  Jeśli znaleziono kilka pasujących produktów, mogę wybrać właściwy z listy.
  4.  Mogę określić zamawianą ilość dla danego produktu.
  5.  Po zatwierdzeniu wyboru dla jednej pozycji, produkt jest dodawany do tymczasowej listy, a system pokazuje mi kolejną pozycję z wklejonego tekstu.
  6.  Proces jest kontynuowany aż do przejścia przez wszystkie pozycje z listy.
  7.  Na końcu procesu mogę dodać wszystkie zweryfikowane produkty do koszyka jednym kliknięciem.

- ID: US-006
- Tytuł: Obsługa nierozpoznanych produktów z listy
- Opis: Jako użytkownik, jeśli aplikacja nie może znaleźć produktu z mojej listy, chcę mieć możliwość łatwej korekty lub ręcznego wyszukania, aby dokończyć zamówienie.
- Kryteria akceptacji:

  1.  Gdy dla danej pozycji z listy system nie znajduje żadnego produktu, wyświetla czytelny komunikat "Nie znaleziono produktu".
  2.  System udostępnia pole edycji, w którym mogę poprawić nazwę nierozpoznanej pozycji.
  3.  System udostępnia przycisk/link do ręcznego wyszukiwania produktu w katalogu.
  4.  Mogę pominąć nierozpoznaną pozycję i przejść do następnej.

- ID: US-007
- Tytuł: Ręczne wyszukiwanie i dodawanie produktu
- Opis: Jako użytkownik, chcę móc ręcznie wyszukać produkt w katalogu i dodać go do koszyka.
- Kryteria akceptacji:
  1.  W aplikacji znajduje się pole wyszukiwania.
  2.  Podczas wpisywania nazwy produktu, system na bieżąco wyświetla pasujące wyniki.
  3.  Z poziomu listy wyników mogę dodać produkt bezpośrednio do koszyka, określając jego ilość.

### Koszyk i finalizacja

- ID: US-008
- Tytuł: Zarządzanie koszykiem
- Opis: Jako użytkownik, chcę mieć dostęp do widoku koszyka, aby przejrzeć moje zamówienie i dokonać ewentualnych zmian przed jego złożeniem.
- Kryteria akceptacji:

  1.  W interfejsie aplikacji widoczna jest ikona koszyka z liczbą produktów.
  2.  Po kliknięciu w ikonę, widzę listę wszystkich dodanych produktów.
  3.  Dla każdego produktu widzę jego nazwę, cenę (jeśli dotyczy) i ilość.
  4.  Mogę zmienić ilość każdego produktu.
  5.  Mogę usunąć dowolny produkt z koszyka.
  6.  Widzę podsumowanie całkowitej wartości zamówienia.

- ID: US-009
- Tytuł: Składanie zamówienia
- Opis: Jako użytkownik, po zweryfikowaniu zawartości koszyka, chcę móc złożyć zamówienie.
- Kryteria akceptacji:
  1.  W widoku koszyka znajduje się przycisk "Złóż zamówienie".
  2.  Po kliknięciu przycisku, system wyświetla ekran z podsumowaniem zamówienia do ostatecznego potwierdzenia.
  3.  Po ostatecznym potwierdzeniu, zamówienie jest zapisywane w systemie.
  4.  System wyświetla komunikat o pomyślnym złożeniu zamówienia.
  5.  Na mój adres e-mail zostaje wysłana wiadomość z potwierdzeniem i szczegółami zamówienia.

### Historia zamówień

- ID: US-010
- Tytuł: Przeglądanie historii zamówień
- Opis: Jako użytkownik, chcę mieć dostęp do listy moich poprzednich zamówień, aby móc sprawdzić, co zamawiałem w przeszłości.
- Kryteria akceptacji:

  1.  W menu aplikacji znajduje się pozycja "Historia zamówień".
  2.  Po przejściu do tej sekcji, widzę listę wszystkich moich wcześniejszych zamówień.
  3.  Każda pozycja na liście zawiera co najmniej numer zamówienia, datę złożenia i jego sumaryczną wartość.
  4.  Lista jest posortowana od najnowszego do najstarszego zamówienia.

- ID: US-011
- Tytuł: Podgląd szczegółów historycznego zamówienia
- Opis: Jako użytkownik, chcę móc zobaczyć szczegóły konkretnego zamówienia z historii.
- Kryteria akceptacji:
  1.  Kliknięcie na pozycję na liście historii zamówień przenosi mnie do widoku szczegółowego.
  2.  W widoku szczegółowym widzę wszystkie informacje o zamówieniu: numer, datę, status oraz pełną listę zamówionych produktów wraz z ilościami i cenami.

## 6. Metryki sukcesu

Sukces MVP będzie mierzony za pomocą następujących wskaźników:

- Kluczowy Wskaźnik Wydajności (KPI 1 - Szybkość): Średni czas od zalogowania do złożenia zamówienia przy użyciu funkcji wklejania listy.
  - Cel: Poniżej 180 sekund.
- Kluczowy Wskaźnik Wydajności (KPI 2 - Satysfakcja): Wskaźnik satysfakcji użytkownika (CSAT).
  - Cel: 80% lub więcej.
  - Metoda pomiaru: Krótka, opcjonalna ankieta wyświetlana po złożeniu zamówienia.
- Metryka Jakościowa (Przejrzystość UI): Ocena łatwości obsługi i intuicyjności interfejsu.
  - Metoda pomiaru: Sesje testów użyteczności z reprezentantami grupy docelowej.
- Metryka Techniczna (Niezawodność Parsowania): Procent poprawnie rozpoznanych produktów z wklejanych list w obsługiwanych formatach.
  - Cel: Powyżej 95%.
