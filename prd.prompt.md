Jesteś doświadczonym menedżerem produktu, którego zadaniem jest stworzenie kompleksowego dokumentu wymagań produktu (PRD) w oparciu o poniższe opisy:

<project_description>

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

</project_description>

<project_details>

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

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania PRD (Product Requirements Document) dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:

1. Opis projektu
2. Zidentyfikowany problem użytkownika
3. Historia rozmów zawierająca pytania i odpowiedzi
4. Zalecenia dotyczące zawartości PRD

Twoim zadaniem jest:

1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem PRD.
2. Dopasowanie zaleceń modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotuj szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania funkcjonalne produktu
   b. Kluczowe historie użytkownika i ścieżki korzystania
   c. Ważne kryteria sukcesu i sposoby ich mierzenia
   d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatuj wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<prd_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</prd_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu tworzenia PRD.
</project_details>

Wykonaj następujące kroki, aby stworzyć kompleksowy i dobrze zorganizowany dokument:

1. Podziel PRD na następujące sekcje:
   a. Przegląd projektu
   b. Problem użytkownika
   c. Wymagania funkcjonalne
   d. Granice projektu
   e. Historie użytkownika
   f. Metryki sukcesu

2. W każdej sekcji należy podać szczegółowe i istotne informacje w oparciu o opis projektu i odpowiedzi na pytania wyjaśniające. Upewnij się, że:

   - Używasz jasnego i zwięzłego języka
   - W razie potrzeby podajesz konkretne szczegóły i dane
   - Zachowujesz spójność w całym dokumencie
   - Odnosisz się do wszystkich punktów wymienionych w każdej sekcji

3. Podczas tworzenia historyjek użytkownika i kryteriów akceptacji
   - Wymień WSZYSTKIE niezbędne historyjki użytkownika, w tym scenariusze podstawowe, alternatywne i skrajne.
   - Przypisz unikalny identyfikator wymagań (np. US-001) do każdej historyjki użytkownika w celu bezpośredniej identyfikowalności.
   - Uwzględnij co najmniej jedną historię użytkownika specjalnie dla bezpiecznego dostępu lub uwierzytelniania, jeśli aplikacja wymaga identyfikacji użytkownika lub ograniczeń dostępu.
   - Upewnij się, że żadna potencjalna interakcja użytkownika nie została pominięta.
   - Upewnij się, że każda historia użytkownika jest testowalna.

Użyj następującej struktury dla każdej historii użytkownika:

- ID
- Tytuł
- Opis
- Kryteria akceptacji

4. Po ukończeniu PRD przejrzyj go pod kątem tej listy kontrolnej:

   - Czy każdą historię użytkownika można przetestować?
   - Czy kryteria akceptacji są jasne i konkretne?
   - Czy mamy wystarczająco dużo historyjek użytkownika, aby zbudować w pełni funkcjonalną aplikację?
   - Czy uwzględniliśmy wymagania dotyczące uwierzytelniania i autoryzacji (jeśli dotyczy)?

5. Formatowanie PRD:
   - Zachowaj spójne formatowanie i numerację.
   - Nie używaj pogrubionego formatowania w markdown ( \*\* ).
   - Wymień WSZYSTKIE historyjki użytkownika.
   - Sformatuj PRD w poprawnym markdown.

Przygotuj PRD z następującą strukturą:

```markdown
# Dokument wymagań produktu (PRD) - {{app-name}}

## 1. Przegląd produktu

## 2. Problem użytkownika

## 3. Wymagania funkcjonalne

## 4. Granice produktu

## 5. Historyjki użytkowników

## 6. Metryki sukcesu
```

Pamiętaj, aby wypełnić każdą sekcję szczegółowymi, istotnymi informacjami w oparciu o opis projektu i nasze pytania wyjaśniające. Upewnij się, że PRD jest wyczerpujący, jasny i zawiera wszystkie istotne informacje potrzebne do dalszej pracy nad produktem.

Ostateczny wynik powinien składać się wyłącznie z PRD zgodnego ze wskazanym formatem w markdown, który zapiszesz w pliku .ai/prd.md
