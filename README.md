# Lumivara

Lumivara adalah prototype web statis untuk platform kolaborasi belajar dengan AI assistant dan gamification. Dibangun menggunakan HTML, CSS, dan JavaScript murni (tanpa framework/backend).

## Fitur
- Landing, Login, Register, Dashboard, dan Chat Room
- Simulasi auth + data user via localStorage
- AI assistant "Lumi" dengan perintah `/ask`, `/summary`, `/explain`
- Gamification: XP, level up, achievements + toast
- Seed chat 820+ pesan manusiawi
- Auto-reply peer + typing indicator
- UI modern, lembut, dan responsif

## Struktur
- `index.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `chat.html`
- `css/style.css`
- `js/storage.js`
- `js/auth.js`
- `js/gamification.js`
- `js/ai.js`
- `js/chat.js`

## Demo
Buka `index.html` di browser, lalu register untuk mulai.

Tombol **Reset Demo** akan menghapus data localStorage dan mengembalikan ke landing.

## GitHub Pages
Workflow `Deploy GitHub Pages` sudah disiapkan.
- Pastikan GitHub Pages di repo di-set ke **GitHub Actions**.
- Setelah push ke `main`, halaman akan otomatis terdeploy.

## Catatan
Jika seed chat tidak muncul, hapus key `lumivara_messages` di Local Storage dan reload.
