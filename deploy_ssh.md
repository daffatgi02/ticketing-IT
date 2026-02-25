# Panduan Deployment ke Server Ubuntu 22.04 menggunakan PM2

Dokumen ini menjelaskan langkah-langkah untuk mendeploy aplikasi **IT Dashboard** (Next.js 16 + Prisma) ke server produksi.

## 1. Persiapan Server
Pastikan server sudah terinstall Node.js (versi 18+ direkomendasikan), npm, dan PM2.

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js (jika belum)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 secara global
sudo npm install pm2 -g
```

## 2. Clone Repository
Masuk ke direktori `/var/www` dan clone project.

```bash
cd /var/www
git clone https://github.com/daffatgi02/ticketing-IT.git it-dashboard
cd it-dashboard
```

## 3. Install Dependensi & Setup Environment
Install package yang dibutuhkan dan buat file `.env`.

```bash
# Install dependencies
npm install

# Buat file .env
nano .env
```

Isi file `.env` dengan konfigurasi produksi (sesuaikan dengan database server):
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
NEXTAUTH_URL="https://it-dashboard.domainanda.com"
NEXTAUTH_SECRET="buat-secret-yang-sangat-kuat-disini"
```

## 4. Prisma Setup
Jalankan migrasi untuk menyesuaikan schema database di server.

```bash
# Generate client
npx prisma generate

# Jalankan migrasi (Hati-hati: ini akan menyesuaikan schema DB server)
npx prisma migrate deploy
```

## 5. Build Aplikasi
Lakukan build produksi.

```bash
npm run build
```

## 6. Jalankan dengan PM2
Gunakan PM2 untuk menjalankan aplikasi di background agar tetap berjalan setelah SSH ditutup.

```bash
# Start aplikasi dengan nama 'it-dashboard'
pm2 start npm --name "it-dashboard" -- start

# Simpan list agar otomatis jalan jika server reboot
pm2 save
sudo pm2 startup
```

## 7. Monitoring & Management
Contoh perintah PM2 yang berguna:
- `pm2 list` : Melihat status aplikasi.
- `pm2 logs it-dashboard` : Melihat error/log real-time.
- `pm2 restart it-dashboard` : Restart aplikasi setelah update code.
- `pm2 stop it-dashboard` : Menghentikan aplikasi.

## 8. Update Aplikasi (CI/CD Manual)
Jika ada update di repository, jalankan langkah berikut di server:

```bash
cd /var/www/it-dashboard
git pull origin master
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart it-dashboard
```

---
**Catatan Penting:**
Pastikan port 3000 (atau port yang digunakan) sudah di-allow di firewall atau di-forward menggunakan Nginx Reverse Proxy.
