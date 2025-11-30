# 🍽️ Recipe Share - Penetration Testing Project

Proyek berbasis **React (Frontend)** dan **Express/Node.js (Backend)** yang sengaja dibuat memiliki Vulnerability untuk Penetration Testing dalam pemenuhan Proyek Akhir Keamanan Jaringan.

Topik Vulnerability:
1.  **Stored XSS (Cross-Site Scripting)** pada fitur Komentar.
2.  **Insecure File Upload** pada fitur Upload Foto Masakan.

---

## 📂 Struktur Proyek

```text
Proyek_Pentest/
│
├── Backend/                 # Server Node.js (Express)
│   ├── uploads/             # Direktori penyimpanan file (Vulnerable)
│   ├── server.js            # [TARGET] Backend dengan kode Vulnerable
│   ├── server_remediation.js # [PATCH] Backend yang sudah diamankan
│   └── package.json
│
└── recipe-frontend/         # Client React + Vite
    ├── src/
    │   ├── pages/           # Halaman Home & Detail
    │   ├── App.jsx          # Routing Utama
    │   └── App.css          # Styling Modern Responsif
    └── package.json
```
# 🚀 Instalasi dan Set Up
## 1. Set Up Backend (Vulnerable Server running on http://localhost:3000)
```bash
cd Backend
npm install                # Install dependencies (express, multer, cors, dll)
node server.js             # Jalankan server Vulnerable (Port 3000)
```
## 2. Set Up Frontend (Running on http://localhost:5173)
``` bash
cd recipe-frontend
npm install                # Install dependencies (react, axios, router)
npm run dev                # Jalankan frontend (Port 5173)
```
> Open in recipe-frontend folder

# 🛡️ Pentest Stages
## Target 1: Stored XSS (Cross-Site Scripting)
- Lokasi: Halaman Detail Resep > Kolom Komentar.
- Deskripsi: Input pengguna tidak disanitasi sebelum disimpan ke database (array) dan di-*render( secara raw HTML di frontend.
- Payload Test: <script>alert(document.cookie)</script>
- Dampak: Pencurian Session Cookie milik Admin saat Admin membuka Dashboard.
## Target 2: Insecure File Upload
- Lokasi: Halaman Detail Resep > Upload Your Result.
- Deskripsi: Backend tidak memvalidasi ekstensi file atau isi konten (MIME type).
- Payload Test: File .html berisi script jahat.
- Dampak: Defacement, Phishing, atau Remote Code Execution (RCE) jika server salah konfigurasi.

# 🔧 Mitigasi & Remediasi
``` Bash
node server_remediation.js
```
Pembaruan Vulnerable Website, antara lain: 
- Library xss untuk sanitasi input komentar
- Whitelist Validation (hanya jpg/png) pada file upload.
- File Renaming untuk mencegah path traversal.

# 🚄 Alur Simulasi Pent Test
### **A. Tahap Persiapan (Set Up)**
1.  Pastikan `Backend` berjalan dengan `node server.js` (Vulnerable Mode).
2.  Pastikan `Frontend` berjalan dengan `npm run dev`.
3.  Browser:
    * **Tab 1 (User/Attacker):** `http://localhost:5173` (Tampilan Aplikasi Resep).
    * **Tab 2 (Admin/Korban):** `http://localhost:3000/admin/dashboard` (Tampilan Dashboard Admin yang memuat semua komentar).
### **B. Tahap Eksploitasi (The Attack)**
**Skenario 1: Serangan Stored XSS**
1.  Pada Tab User, pilih resep **"Nasi Goreng Mafia"**.
2.  Scroll ke bagian **Review/Comment**.
3.  Masukkan Nama: `Hacker X`.
4.  Masukkan Review (Payload):
    ```html
    <script>alert('Session Admin Dicuri: ' + document.cookie)</script>
    ```
5.  Klik **POST REVIEW**.
6.  **Bukti Sukses:**
    * Refresh halaman resep -> Alert box muncul.
    * Buka **Tab Admin** dan refresh -> Alert box akan muncul berisi `secret_admin_session`, membuktikan skrip berhasil menyerang Admin.

**Skenario 2: Serangan File Upload**
1.  Buat file bernama `promo.html` palsu di komputer Anda, isinya:
    ```html
    <h1>WEBSITE INI TELAH DIRETAS!</h1>
    <script>alert('Hacked via Upload')</script>
    ```
2.  Pada halaman resep, cari bagian **Upload Photo**.
3.  Pilih file `promo.html` tersebut.
4.  Klik **UPLOAD**.
5.  **Bukti Sukses:**
    * Muncul pesan sukses "✅ Photo uploaded!".
    * Klik kanan pada gambar yang rusak (broken image) hasil upload -> **Open Image in New Tab**.
    * Browser akan membuka file tersebut dan mengeksekusi script di dalamnya (tampilan halaman berubah jadi pesan peretas).
#### **C. The Remediation**
1.  Matikan terminal Backend (`Ctrl + C`).
2.  Jalankan:
    ```bash
    node server_remediation.js
    ```
3.  Ulangi langkah eksploitasi di atas.
#### **D. Tahap Akhir (Verification)**
1.  **Cek XSS:** Masukkan payload `<script>...` lagi.
    * **Hasil:** Script tidak berjalan, hanya tampil sebagai teks biasa (ter-encode aman).
2.  **Cek Upload:** Upload file `promo.html` lagi.
    * **Hasil:** Backend menolak dengan pesan error *"Security Error: Only image files are allowed!"*.
