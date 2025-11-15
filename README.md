# Projekt przepisania aplikacji Ting Tong z WordPressa na React/Node.js

## Cel projektu

Ten projekt ma na celu przepisanie istniejącej aplikacji "Ting Tong", pierwotnie zbudowanej jako motyw WordPress, na nowoczesny stos technologiczny składający się z:

-   **Frontend:** React (Vite)
-   **Backend:** Node.js (Express)
-   **Wdrożenie:** Vercel

## Kod źródłowy starej aplikacji (Legacy)

Pełen kod źródłowy oryginalnego motywu WordPress został zarchiwizowany i znajduje się w folderze `legacy/legacy-wordpress-theme.zip`. Służy on jako punkt odniesienia dla implementowanych funkcjonalności.

## Obecny stan prac

Aplikacja jest na wczesnym etapie rozwoju. Dotychczas zaimplementowano:

-   **Strukturę projektu:** Przygotowano podział na `client/` (frontend) i `server/` (backend).
-   **Szkielet backendu:** Uruchomiono serwer Node.js z obsługą podstawowych endpointów.
-   **Mock bazy danych:** Backend korzysta z tymczasowej, mockowanej bazy danych do testów.
-   **System uwierzytelniania:** Stworzono strony i logikę do rejestracji i logowania użytkowników.
-   **Zalążek głównej funkcjonalności:** Dodano stronę `VideoPlayerPage`, która docelowo ma zastąpić "interaktywną ścianę" ze starej wersji.

## Dalsze kroki (do zrobienia)

Aby doprowadzić projekt do końca, należy zaimplementować następujące funkcjonalności, wzorując się na starej wersji:

1.  **Pełna implementacja "interaktywnej ściany"** na stronie `VideoPlayerPage`.
2.  **System napiwków (tipping).**
3.  **System komentarzy.**
4.  **Połączenie z docelową bazą danych** (zamiast mocków).
5.  **Migracja danych** użytkowników i treści z bazy WordPress.
6.  **Pełna stylizacja interfejsu użytkownika (UI/UX),** aby aplikacja wyglądała nowocześnie i była intuicyjna w obsłudze.
7.  Implementacja pozostałych, mniejszych funkcjonalności i podstron.
