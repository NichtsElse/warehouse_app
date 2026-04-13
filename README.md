# Warehouse Management System

Aplikasi web untuk mengelola operasional gudang, mencakup manajemen produk, kategori, lokasi penyimpanan, transaksi stok, serta laporan dan ekspor data.

---

## Fitur Utama

- Autentikasi pengguna berbasis JWT dengan sesi 60 menit
- Manajemen produk dengan atribut SKU, kategori, lokasi, harga, dan stok minimum
- Manajemen kategori dan lokasi penyimpanan
- Transaksi stok masuk (IN) dan keluar (OUT) dengan pembaruan stok secara atomik
- Dashboard dengan visualisasi grafik stok per kategori dan tren transaksi
- Peringatan produk dengan stok di bawah batas minimum
- Ekspor data produk dan riwayat transaksi ke format CSV

---

## Prasyarat

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

---

## Instalasi dan Menjalankan Proyek

### 1. Clone repositori

```bash
git clone <url-repositori>
cd warehouse-app
```

### 2. Konfigurasi environment backend

```bash
cp backend/.env.example backend/.env
```

Isi file `backend/.env` dengan nilai yang sesuai:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
JWT_SECRET="<kunci-rahasia-anda>"
PORT=3001
```

### 3. Install dependensi

```bash
# Install semua dependensi (backend + frontend sekaligus via npm workspaces)
npm install
```

### 4. Jalankan migrasi database

```bash
cd backend
npx prisma migrate dev
```

### 5. Seed data awal

```bash
cd backend
npm run seed
```

Perintah ini membuat akun admin default:

| Field    | Nilai                 |
|----------|-----------------------|
| Email    | admin@warehouse.com   |
| Password | admin123              |

### 6. Jalankan aplikasi

```bash
# Dari root warehouse-app/

# Backend (port 3001)
npm run dev:backend

# Frontend (port 5173)
npm run dev:frontend
```

Akses aplikasi di `http://localhost:5173`.

---

## Struktur Folder

```
warehouse-app/
├── backend/
│   ├── prisma/
│   │   ├── migrations/        # Riwayat migrasi database
│   │   ├── schema.prisma      # Definisi skema database
│   │   └── seed.ts            # Data awal (admin user)
│   ├── src/
│   │   ├── middleware/        # JWT auth guard, error handler
│   │   ├── routes/            # Express router per resource
│   │   ├── services/          # Logika bisnis
│   │   ├── validators/        # Skema validasi Zod
│   │   └── app.ts             # Entry point Express
│   ├── .env                   # Variabel environment (tidak di-commit)
│   ├── .env.example           # Template variabel environment
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── charts/        # Komponen grafik Recharts
    │   │   ├── layout/        # Sidebar dan Navbar
    │   │   └── ui/            # Komponen shadcn/ui
    │   ├── hooks/             # Custom React hooks
    │   ├── pages/             # Satu file per halaman
    │   ├── services/          # Fungsi pemanggilan API (Axios)
    │   └── main.tsx           # Entry point React
    └── package.json
```

---

## API Endpoints

Semua endpoint kecuali `/api/auth/login` memerlukan header `Authorization: Bearer <token>`.

| Method          | Endpoint                    | Deskripsi                        |
|-----------------|-----------------------------|----------------------------------|
| POST            | /api/auth/login             | Login pengguna                   |
| GET             | /api/auth/me                | Info pengguna aktif              |
| POST            | /api/auth/logout            | Logout pengguna                  |
| GET/POST        | /api/categories             | Daftar dan tambah kategori       |
| GET/PUT/DELETE  | /api/categories/:id         | Detail, ubah, hapus kategori     |
| GET/POST        | /api/locations              | Daftar dan tambah lokasi         |
| GET/PUT/DELETE  | /api/locations/:id          | Detail, ubah, hapus lokasi       |
| GET/POST        | /api/products               | Daftar dan tambah produk         |
| GET/PUT/DELETE  | /api/products/:id           | Detail, ubah, hapus produk       |
| GET/POST        | /api/transactions           | Daftar dan tambah transaksi      |
| GET             | /api/transactions/:productId| Riwayat transaksi per produk     |
| GET             | /api/dashboard/summary      | Ringkasan statistik gudang       |
| GET             | /api/dashboard/stock-by-category | Stok per kategori           |
| GET             | /api/dashboard/transaction-trend | Tren transaksi 30 hari      |
| GET             | /api/dashboard/low-stock    | 5 produk stok terendah           |
| GET             | /api/dashboard/recent-transactions | 10 transaksi terbaru      |
| GET             | /api/export/products        | Ekspor produk ke CSV             |
| GET             | /api/export/transactions    | Ekspor transaksi ke CSV          |

---

## Teknologi yang Digunakan

### Backend

| Teknologi       | Versi   | Keterangan                        |
|-----------------|---------|-----------------------------------|
| Node.js         | >= 18   | Runtime JavaScript                |
| Express         | ^4.18   | Framework HTTP                    |
| TypeScript      | ^5.0    | Superset JavaScript bertipe       |
| Prisma          | ^5.0    | ORM untuk PostgreSQL              |
| PostgreSQL       | >= 14   | Database relasional               |
| jsonwebtoken    | ^9.0    | Autentikasi stateless             |
| Zod             | ^3.22   | Validasi skema input              |
| bcryptjs        | ^2.4    | Hashing password                  |
| csv-writer      | ^1.6    | Ekspor data ke CSV                |
| nodemon         | ^3.0    | Hot-reload saat development       |

### Frontend

| Teknologi       | Versi   | Keterangan                        |
|-----------------|---------|-----------------------------------|
| React           | ^18.2   | Library UI                        |
| TypeScript      | ^5.0    | Superset JavaScript bertipe       |
| Vite            | ^5.0    | Build tool                        |
| Tailwind CSS    | ^3.4    | Utility-first CSS framework       |
| shadcn/ui       | -       | Komponen UI berbasis Radix        |
| Recharts        | ^2.10   | Library grafik                    |
| Axios           | ^1.6    | HTTP client dengan interceptor JWT|
| React Router    | ^6.22   | Routing sisi klien                |
