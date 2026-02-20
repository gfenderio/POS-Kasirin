# POS Kasirin 🚀

Selamat datang di repositori **POS Kasirin**, sebuah sistem **Point of Sales (Kasir)** berskala *Enterprise* yang dirancang tahan banting untuk skenario minimarket ber-trafik tinggi (>50.000 SKU Barang) menggunakan arsitektur termutakhir.

Aplikasi ini tidak sekadar merekam penjualan; ia dibekali fitur canggih seperti **Offline-First Resilience** (Bisa transaksi tanpa kuota internet), **Live Real-time Inventory Stream** (SSE), **AI Restock Alerts (Brain.js LSTM)**, hingga proteksi **Race Condition / Oversell** berbasis Clean Architecture.

## ✨ Fitur Utama (Features)

1. **Modular Monolith**: Pemisahan tegas domain `Inventory`, `Sales`, `Auth` ke Layer Mandiri demi kemudahan scaling dan tracking bug.
2. **Offline-First (Dexie.js)**: Kasir tetap bisa Scan Barcode barang & tekan tombol Bayar walau WiFi mati. Transaksi tersimpan ke *IndexedDB Browser*, dan **otomatis me-lempar sinkronisasi massal** (Auto-Sync) seketika internet pulih. Tanpa satu sen pun data penjualan yang hangus!
3. **Full Keyboard Navigation (Shortcuts)**: Demi Kasir Profesional yang haram memegang Mouse: `F1` (Kolom Search), `Arrow Up/Down` (Pilih Barang), `Enter` (Keranjang), `F2` (Kolom Uang Bayar), `F9` (Checkout Kilat). 
4. **Data Integrity (Free from Oversell)**: Menggunakan Prisma Interactive Transaction atomik. Bila ada 2 Kasir rebutan meng-checkout 1 Indomie terakhir, Backend Database Lock akan menggagalkan salah satu persis layaknya e-Commerce kelas atas. Celah Manipulasi Harga dari Client juga ditutup *Pure Backend Validation*.
5. **Analytics & AI Engine**: Neural Network `brain.js` tersembunyi berdenyut real-time mengunyah data historis PnL (Laba-rugi) 30 hari ke belakang guna memberikan alarm pintar: *"Barang A diprediksi akan ludes minggu depan, Restock sekarang!"*.
6. **Blazing Fast Under Load**: Tersemat indeks `B-Tree` Database, Eager Query Loading (No N+1), LRU In-Memory Node Cache, dan `next/dynamic` Lazy Loading. FCP (Layar muncul) halaman POS terjadi dalam desimal detik dan menembus data 50 ribu SKU bagai mengiris mentega hangat.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Edge Middleware)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode Enabled)
- **Database**: PostgreSQL / MySQL (`db_dikasirinpos`)
- **ORM**: [Prisma Client](https://www.prisma.io/)
- **Styling**: Vanilla CSS / React Hooks (Minified)
- **Security**: JWT ([jose](https://github.com/panva/jose)), Bcrypt Hashed Passwords
- **Intelligence**: [Brain.js](https://github.com/BrainJS/brain.js) (Recurrent Neural Network untuk Prediksi Stok)
- **Charts**: [Recharts](https://recharts.org/)

---

## 💻 Panduan Instalasi (Getting Started)

### Persyaratan Awal (Prerequisites)
Pastikan hal-hal berikut telah siap mekar di Mesin Anda:
1. **Node.js** (v18.x ke atas)
2. **MySQL atau PostgreSQL** berjalan leluasa.
3. Repositori *POS-Kasirin* ter-clone ke *local drive*.

### Langkah Eksekusi (Zero-to-Hero)

**1. Pasang Semua Pustaka (Install Dependencies)**
Dari root proyek kasirin, buka terminal:
```bash
npm install
```

**2. Siapkan Kunci Rahasia (.env)**
Salin atau buatkan file `.env`. Temukan barisan `DATABASE_URL` dan ganti sesuai port kredensial lokal Anda:
```env
# Contoh untuk MySQL Default XAMPP/Laragon
DATABASE_URL="mysql://root:@localhost:3306/db_dikasirinpos"

# Key Pembangkit Token Enkripsi Login (JWT)
JWT_SECRET="super-secret-pos-key-2026-sangat-rahasia"
```

**3. Bangun Rumah Data (Database Migration)**
Baringkan Prisma Schema ke Database fisik Anda. Jika menggunakan sinkronisasi purba bypass:
```bash
npx prisma db push --skip-generate
# ATAU jika ingin full dev:
npx prisma generate
npx prisma db push
```
*(Ingat: Pada environment Next.js saat dev mode, `generate` terkadang memicu tumpang-tindih process lock, sehingga `skip-generate` disematkan demi efektivitas).*

**4. Nyalakan Mesin Penjualan (Run The App)**
Semprotkan bensin ke roda gigi React:
```bash
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

### Panduan Login Default
Jikalau database kosong melompong (Belum ada proses Seeding), registrasikan baris karyawan superadmin secara manual ke dalam Table `tbl_user` pangkalan data. Gunakan password bcrypt standar yang disuka.

---

## 🏛 Clean Architecture Guideline

Bagi kontributor, POS Kasirin didesain menggunakan **SOLID principles**. Pola desain yang ditaati mutlak adalah:
- **API Routes (`/app/api/...`)**: Berlaku murni sebagai *Controller*. Hanya menampung rute masuk HTTP `Request`, dan menyemburkan HTTP `Response` `ApiResponse` yang seragam. HARAM hukumnya meletakkan kalkulasi harga / kueri database yang kompleks di berkas ini.
- **Service Layer (`/lib/services/...`)**: Eksekusi bisnis mutlak berada di mari. (cth: `authService.ts`, `transactionService.ts`). Lapis ini tak kenal *NextResponse* atau *Request*. Ia me-return raw data murni atau menembakkan `AppError`.
- **Core Utilitas (`/lib/core/...`)**: Menampung *Class custom Error* (ex: `ConflictError` jika terjadi rebutan transaksi) alias Exception Handling pusat.

---
*Kode ditulis tanpa henti malam gulita, diseduh secangkir kopi panas. Dipersembahkan oleh penggalang POS Indonesia masa depan.*
