# Aplikacja - {zamow.to} (MVP)

### Główny problem

Aplikacja maksymalnie upraszcza i przyspiesza zakupy dla użytkownikow.

### Najmniejszy zestaw funkcjonalności

- Logowanie użytkownikow
- Wyszukiwanie produktow
- Obsługa wklejonego tekstu i umozliwienie wyboru produktu sporod kilku i przejscia do kolejnego az uzytkonik przejdzie cala liste
- Przyjazny UI do przejścia przez elementy zamówienia
- Koszyk zakupów
- Składanie zamówien
- Historia zamówień

### Co NIE wchodzi w zakres MVP

- Płatnosci online
- Integracje z hurtowniami czy sklepami / a więc mocki produktów i stanow magazynowych
- Rekomendacje produktów

### Kryteria sukcesu

- Przejrzysty ui dla klienta do skladania szybkich zamowień w systemie
- Obsługa wielu kont klientów
- Inteligentna obsługa wklejonego tekstu z produktami - obsługa wielu formatów listy produktów

1.  Dla kogo dokładnie jest przeznaczona ta aplikacja? Czy możemy zdefiniować profil idealnego użytkownika (np. menedżer biura zamawiający artykuły, osoba prywatna robiąca cotygodniowe zakupy spożywcze)?

    **Rekomendacja**: Aplikacja będzie przeznaczona dla profesjonalnych uzytkowników do składania zamówień, równiez cyklicznych. Początkowo będzie jedna hurtownia/sklep, ale z mozliwością kolejnych integracji.

    Persona FRYZJER
    Fryzjer, który sam jest właścicielem zakładu i zalezy mu na szybkim składaniu zamówień u sprawdzonych dostawców. Często zamawia to co się kończy w zakładzie i chce to szybko wyklikać w przejrzystej aplikacji. Nie lubi on przebywać na platformach zakupowych i szukać najtańszych ofert, bo nie ma na to czasu.

2.  W jaki sposób obecnie użytkownicy radzą sobie z problemem, który aplikacja ma rozwiązać? Jakie narzędzia (lub ich brak) wykorzystują i co sprawia im największą trudność?

    **Rekomendacja**: Zrozumienie obecnych "obejść" i frustracji użytkowników pozwoli nam precyzyjniej zdefiniować unikalną wartość naszej aplikacji i upewnić się, że rozwiązujemy realny i istotny problem.

    Persona FRYZJER
    Obecnie radzi on sobie zakupami przez internet u róznych dostawcow co mu zajmuje za duzo czasu. Alternatywnie robi to tez przez telefon.

3.  Jakie konkretnie formaty wklejanych list produktów powinniśmy obsłużyć w pierwszej kolejności? Czy możemy podać przykłady (np. każdy produkt w nowej linii, produkty oddzielone przecinkami, listy z ilościami)?

    **Rekomendacja**: Zdefiniujmy i skupmy się na 2-3 najpopularniejszych formatach list, aby zapewnić ich niezawodne działanie w ramach MVP. Obsługę bardziej złożonych i nietypowych formatów możemy dodać w kolejnych iteracjach.

    - lista z produktami kazdy od nowej linii
    - lista z produktami po przecinku, sredniku
    - jesli sie uda to i po spacji, ale tutaj jest problem bo niektore produkty moga miec wiecej niz 1 wyraz

4.  W jaki sposób produkty i ich dostępność (stany magazynowe) będą wprowadzane do systemu, skoro nie będzie integracji z hurtowniami?

    **Rekomendacja**: Integracja bedzie oczywiście po MVP. W tym momencie chcę pokazać jak dobrze moze to wygladac, zeby zachecic potencjalnego inwestora.

    Ale jesli starczy czasu to dodatkowo zaplanujmy stworzenie prostego panelu administracyjnego w ramach MVP. Umożliwi on ręczne dodawanie, edytowanie i zarządzanie katalogiem "mockowych" produktów, co jest niezbędne do testowania i działania całej aplikacji.

5.  Jaki jest dokładny proces po złożeniu zamówienia przez użytkownika, biorąc pod uwagę brak płatności online? Co dzieje się dalej?

    **Rekomendacja**: Określmy jasny przepływ "offline". Na przykład, po złożeniu zamówienia system może wysyłać automatyczne powiadomienie e-mail do użytkownika, a płatność będzie realizowana przy odbiorze lub na podstawie faktury. Tę informację należy jasno zakomunikować użytkownikowi w interfejsie.

6.  Jakie konkretne wskaźniki (KPIs) posłużą do zmierzenia sukcesu "przejrzystego UI" i "szybkich zamówień"? Czy będzie to np. czas od zalogowania do złożenia zamówienia, czy liczba kliknięć?

    **Rekomendacja**: Ustalmy mierzalne cele dla MVP, np. "średni czas na złożenie zamówienia z wklejonej listy poniżej 180 sekund" oraz "wskaźnik satysfakcji użytkownika (CSAT) na poziomie 80%". Pozwoli to obiektywnie ocenić sukces projektu.

7.  Co powinien zobaczyć użytkownik, gdy system nie rozpozna produktu z wklejonej listy lub zinterpretuje go błędnie?

    **Rekomendacja**: Zaprojektujmy przyjazny dla użytkownika mechanizm obsługi błędów. System powinien wyraźnie oznaczać nierozpoznane pozycje i umożliwiać użytkownikowi łatwą edycję lub ręczne wyszukanie i dopasowanie produktu z katalogu.

8.  Czy "obsługa wielu kont klientów" oznacza po prostu, że w systemie może zarejestrować się wielu różnych użytkowników, czy też chodzi o bardziej złożoną funkcjonalność, np. możliwość przełączania się między profilami (prywatnym/firmowym) w ramach jednego loginu?

    **Rekomendacja**: W ramach MVP skupmy się na standardowym modelu, gdzie jeden adres e-mail odpowiada jednemu kontu użytkownika. Bardziej złożone struktury kont, jeśli są potrzebne, warto rozważyć w dalszym rozwoju produktu. Mozliwy reset hasła.

9.  Jakie metody logowania i rejestracji planujemy udostępnić w MVP? Czy wystarczy klasyczny e-mail i hasło, czy rozważamy również logowanie przez konta społecznościowe (np. Google)?

    **Rekomendacja**: Zacznijmy od najprostszej i najszybszej w implementacji opcji, czyli rejestracji i logowania za pomocą adresu e-mail i hasła. Integracje z dostawcami zewnętrznymi można dodać później jako udogodnienie.

10. Czy istnieje ryzyko, że użytkownicy będą próbowali zamawiać produkty, których nie ma w naszej "mockowej" bazie? Jak zakomunikujemy im ograniczenia katalogu?

    **Rekomendacja**: Wprowadźmy w interfejsie jasne komunikaty informujące, że aplikacja działa na ograniczonym, demonstracyjnym katalogu produktów. Warto również rozważyć dodanie funkcji "zaproponuj produkt", aby zbierać informacje o tym, czego poszukują użytkownicy.
