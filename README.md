# Gas 3Kg - Frontend

Frontend aplikasi penjualan tabung gas 3kg dengan React + Vite.

## Tech Stack

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API

## Fitur

### Role-Based Access Control

- **OWNER**: Melihat data penjualan, mengelola admin
- **ADMIN**: Mengelola penjualan, pengantaran, dan driver
- **DRIVER**: Melihat dan update tugas pengantaran
- **CUSTOMER**: Membeli gas dan tracking pesanan
- **GUEST**: Akses landing page

### Fitur Utama

- Authentication dengan JWT
- Dashboard untuk setiap role
- Pembelian langsung tanpa keranjang
- Integrasi pembayaran Midtrans Snap
- Upload bukti pengantaran untuk driver
- Status tracking real-time

## Instalasi

1. Clone repository

```bash
git clone <repository-url>
cd gas-3kg-frontend
```

2. Install dependencies

```bash
npm install
```

3. Copy file environment

```bash
cp .env.example .env
```

4. Konfigurasi environment variables
   Edit file `.env` dan sesuaikan dengan konfigurasi Anda:

```
VITE_API_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

5. Update Midtrans Client Key
   Edit file `index.html` dan ganti `YOUR_MIDTRANS_CLIENT_KEY` dengan client key Anda.

6. Jalankan development server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`

## Struktur Folder

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   └── common/          # Common components
├── pages/
│   ├── public/          # Public pages
│   ├── auth/            # Authentication pages
│   ├── admin/           # Admin pages
│   ├── owner/           # Owner pages
│   ├── driver/          # Driver pages
│   └── customer/        # Customer pages
├── routes/              # Route configuration
├── services/            # API services
├── context/             # React Context
├── utils/               # Utility functions
└── main.jsx             # Entry point
```

## API Integration

Backend API harus sudah berjalan di `http://localhost:5000` (atau sesuai konfigurasi).

### Expected API Endpoints:

**Auth:**

- POST `/api/auth/login`
- POST `/api/auth/register`

**Sales:**

- GET `/api/sales`
- GET `/api/sales/:id`
- POST `/api/sales`
- PUT `/api/sales/:id`
- DELETE `/api/sales/:id`

**Deliveries:**

- GET `/api/deliveries`
- GET `/api/deliveries/my-tasks` (for driver)
- PUT `/api/deliveries/:id/status`
- POST `/api/deliveries/:id/proof` (file upload)

**Drivers:**

- GET `/api/drivers`
- POST `/api/drivers`
- PUT `/api/drivers/:id`
- DELETE `/api/drivers/:id`

**Payments:**

- POST `/api/payments/create-transaction`
- GET `/api/payments/status/:orderId`

**Admins:**

- GET `/api/admins`
- POST `/api/admins`
- PUT `/api/admins/:id`
- DELETE `/api/admins/:id`

## Midtrans Integration

1. Daftar di [Midtrans](https://dashboard.midtrans.com/)
2. Gunakan mode Sandbox untuk testing
3. Dapatkan Client Key dari dashboard
4. Update Client Key di:
   - File `index.html`
   - File `.env`

### Test Cards (Sandbox):

- **Success**: 4811 1111 1111 1114
- **Failure**: 4911 1111 1111 1113
- CVV: 123
- Exp: 01/25

## Status Reference

### Delivery Status:

- `READY`: Siap diantar
- `ON_THE_ROAD`: Dalam perjalanan
- `SENT`: Terkirim

### Payment Status:

- `PENDING`: Menunggu pembayaran
- `SUCCESS`: Berhasil
- `FAILED`: Gagal
- `CHALLENGE`: Perlu verifikasi

## Development Guidelines

1. Gunakan komponen reusable dari `components/ui/`
2. Pisahkan business logic dari UI components
3. Handle loading dan error state dengan baik
4. Gunakan Context API untuk state management global
5. Follow React best practices

## Pengembangan Lanjutan

Fitur yang bisa ditambahkan:

- Halaman detail order untuk customer
- Notifikasi real-time
- Export data untuk owner/admin
- Filter dan search untuk list data
- Chart dan analytics
- Multi-language support
- Dark mode

## Troubleshooting

**Error: Network Error**

- Pastikan backend sudah berjalan
- Check VITE_API_URL di file .env

**Error: Snap is not defined**

- Pastikan Midtrans script sudah dimuat di index.html
- Check Client Key sudah benar

**Error: 401 Unauthorized**

- Token expired, silakan login ulang
- Check localStorage untuk token

## License

MIT

## Contact

Untuk pertanyaan dan dukungan, hubungi: info@gas3kg.com
