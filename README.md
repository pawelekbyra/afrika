# Zaktualizowany Plan Migracji Projektu do Next.js (App Router)

## ETAP 1: Fundament Architektoniczny, Typowanie i UI Base (Większość ZREALIZOWANA)
**Status:** Architektura Next.js, TypeScript i podstawowe style są gotowe.

- **Szkielet Next.js:** ZREALIZOWANO. Ustanowienie struktury projektu (App Router, TS).
- **Typowanie Kodu (TypeScript):** ZREALIZOWANO. Modele danych (User, Comment, Slide, Donation) są na miejscu.
- **Styling i RWD:** W TRAKCIE. Podstawowe style (VideoPlayerPage.css, AuthPages.css) są przeniesione. Wdrożenie Tailwind CSS jest w trakcie/potwierdzone.
- **UI Component Library (MODYFIKACJA):** Wdrożenie Shadcn UI lub biblioteki headless.
- **Assets:** Migracja Globalnych Stylów CSS i kluczowych assetów graficznych do katalogu `public/`.
- **Wczesna Konfiguracja Internacjonalizacji (PRZYSPIESZONA):** Wdrożenie biblioteki i18n (next-intl) i konfiguracja routingu pod obsługę języków (`/[lang]/app/*`) jako priorytet, zanim powstanie więcej stron.

## ETAP 2: Backend Core, Autoryzacja i Czytanie Danych (Server-First)
**Status:** Modele danych i Route Handlers są na miejscu. Potrzebna weryfikacja stabilności DB.

- **Baza Danych (WERYFIKACJA STABILNOŚCI):** Upewnienie się, że połączenie z bazą danych (Mongoose) jest zoptymalizowane pod Serverless (np. użycie memoizacji połączenia lub natywnego sterownika Serverless DB), aby uniknąć problemów z connection poolingiem.
- **Autoryzacja / Zabezpieczenia (Middleware):** ZREALIZOWANO (Custom JWT). Wdrożenie Next.js Middleware do weryfikacji JWT/sesji i ochrony ścieżek. (Opcjonalna optymalizacja: Rozważenie migracji do Auth.js dla standardowej implementacji).
- **Logika Uwierzytelniania:** ZREALIZOWANO. Logika logowania/rejestracji jest przeniesiona do Route Handlers (`/api/auth/`).
- **Pobieranie Danych (Server Components - MODYFIKACJA):** Przeniesienie głównej logiki pobierania danych (SLIDES, USERS) do asynchronicznych Server Components (read-only), wykorzystując natywne funkcje `fetch` i Next.js Caching.
- **Logika Użytkownika:** Implementacja logiki wymuszenia uzupełnienia profilu (First Login Modal).

## ETAP 3: Infrastruktura i Logika Zapisu (KRYTYCZNA KONWERSJA NA SERVER ACTIONS)
**Status:** Logika mutacji jest w API Routes – MUSI zostać przeniesiona do Server Actions. Logika Stripe jest zmigrowana.

- **Mutacje Danych (KONWERSJA Z API ROUTES NA SERVER ACTIONS - KLUCZOWA ZMIANA):**
  - **PRIORYTET:** Przekształcenie logiki z Route Handlers POST/PUT/DELETE (np. `/api/slides/[id]/like/route.ts`, `/api/comments/[id]/route.ts`, `/api/users/profile/route.ts`) na funkcje Server Actions (`'use server'`).
  - Wdrożenie `revalidatePath` i `revalidateTag` wewnątrz Server Actions do natychmiastowej rewalidacji danych w Server Components po mutacji.
- **Oddzielny Storage Assetów + Optymalizacja Obrazów:** Zmigrowanie zasobów statycznych (avatary, wideo, obrazy) na Oddzielny Storage (S3/Vercel Blob). Wdrożenie komponentu `next/image` z custom loaderem.
- **Dostarczanie Wideo (KRYTYCZNE):** Wdrożenie CDN (Cloudflare Stream/AWS S3) i ustawienie transkodowania Adaptive Streaming (HLS/DASH).
- **Własny System Komentarzy (Backend):** Konwersja logiki komentarzy na Server Actions (pobierania, dodawania, edytowania, usuwania, polubień).
- **Płatności i Zewnętrzne API (API Routes):** ZREALIZOWANO. Utrzymanie API Routes tylko dla operacji zewnętrznych:
  - Logika inicjowania płatności Stripe.
  - Obsługa webhooka Stripe (tutaj API Route jest poprawnym wyborem).
- **Rate Limiting:** Zaimplementowanie Rate Limiting na krytycznych Server Actions i API Routes.

## ETAP 4: Funkcjonalności Zaawansowane i Wiernie Odtworzenie Komponentów
**Status:** Komponenty (np. `CommentsSection.tsx`, `TippingModal.tsx`) są przeniesione i gotowe do integracji z Server Actions.

- **Global State & Video UX:** Wdrożenie Zustand do zarządzania lekkim stanem UI (modal komentarzy, stan gracza wideo).
- **Zarządzanie Formularzami:** Wdrożenie React Hook Form do walidacji i kontroli pól.
- **React Query (MODYFIKACJA STRATEGII):** Integracja React Query tylko na Client Components, aby:
  - Obsługiwać złożony, asynchroniczny stan klienta.
  - Unikać duplikacji mechanizmów cache'owania — poleganie na Server Actions do mutacji i rewalidacji danych serwera.
- **Real-Time Updates:** Zintegrowanie External Service (Pusher/Ably) do obsługi Real-Time (dla polubień slajdów i komentarzy).
- **Własny System Komentarzy (Frontend):** Odtworzenie komponentu `CommentsSection.jsx` i jego integracja z logiką Server Actions / Real-Time.
- **Notyfikacje Web Push (Pełne Wdrożenie):** Wdrożenie Service Worker (`public/sw.js`), implementacja UI oraz logika subskrypcji/anulowania na stronie klienta.
- **UI/UX Wiernie Odtworzone:** Odtworzenie wizualne kluczowych komponentów i interfejsu strony konta.

## ETAP 5: Optymalizacja i Wygładzanie (Produkcja)
- **Monitorowanie Błędów:** Zintegrowanie Sentry do monitorowania błędów serwera (Server Actions) i klienta.
- **Analityka:** Dodanie Google Analytics 4 / Amplitude w `app/layout.tsx`.
- **SEO i Metadane:** Wprowadzenie Dynamicznych Metadanych Next.js (Open Graph/Twitter Cards) dla każdej strony wideo.
- **Internacjonalizacja (i18n):** Wypełnienie wszystkich brakujących tłumaczeń (na podstawie wczesnej struktury z Etapu 1).
- **Generowanie Zasobów:** Automatyczne generowanie map witryny (sitemaps) i kanałów RSS.
