# DompetKu — Improvement & Feature Plan

> Dokumen perencanaan untuk pengembangan fitur budgeting dinamis, batas aman harian, forecasting, dan perbaikan konsistensi sistem keuangan DompetKu.

---

## 1. Tujuan Pengembangan

DompetKu saat ini sudah memiliki fondasi utama:

- Dashboard
- Transaksi
- Hutang
- Tabungan
- Sumber Dana
- Laporan
- Pengaturan
- Anggaran Harian
- Target Tabungan
- Backup & Restore

Pengembangan berikut bertujuan mengubah fitur **Anggaran Harian** dari angka manual menjadi sistem yang dapat membantu pengguna menjawab:

> **"Dengan uang yang saya punya sekarang, saya maksimal boleh menghabiskan berapa per hari agar uang saya tetap aman sampai tanggal yang saya tentukan?"**

Fokus utama:

1. Menghitung batas pengeluaran harian secara otomatis.
2. Memperhitungkan tabungan, hutang, pemasukan, dan pengeluaran yang relevan.
3. Menampilkan kondisi keuangan secara mudah dipahami.
4. Memprediksi kapan uang akan habis.
5. Membantu pengguna melakukan simulasi pengeluaran.
6. Memproyeksikan kondisi keuangan ke masa depan.
7. Menjaga agar seluruh angka keuangan di aplikasi konsisten.

---

# 2. Perubahan Konsep Utama

## 2.1 Dari "Anggaran Harian" menjadi "Batas Aman Harian"

Konsep lama:

```text
Anggaran Harian = Rp50.000
```

Konsep baru:

```text
Saldo tersedia
        ↓
Kurangi dana yang tidak boleh digunakan
        ↓
Tentukan target tanggal
        ↓
Hitung jumlah hari
        ↓
Batas Aman Harian
```

Contoh:

```text
Total saldo                 Rp7.706.000
Dana tabungan               Rp1.500.000
Dana yang harus disisihkan    Rp100.000
----------------------------------------
Saldo tersedia              Rp6.106.000

Target bertahan              31 Agustus
Sisa hari                    22 hari

Batas Aman Harian            Rp277.545
```

> Catatan: angka di atas hanya contoh. Sistem harus menghitung berdasarkan data aktual.

---

# 3. Dashboard

## 3.1 Pertahankan Card "Kuota Harian"

Card **Kuota Harian** yang sudah ada sebaiknya tidak dihapus.

Card tersebut dikembangkan menjadi **Batas Aman Harian**.

### Informasi yang ditampilkan

```text
Batas Aman Harian

        Rp277.545
        per hari

Sudah digunakan
Rp161.000

Sisa hari ini
Rp116.545

Target
31 Agustus 2026
```

### Status

Gunakan status:

- 🟢 Aman
- 🟡 Mendekati batas
- 🔴 Melebihi batas

Contoh:

```text
Rp116.545 tersisa
🟢 Aman
```

Jika mendekati batas:

```text
Rp20.000 tersisa
🟡 Mendekati batas
```

Jika melebihi:

```text
-Rp72.455
🔴 Melebihi batas
```

---

# 4. Perhitungan Batas Aman Harian

## 4.1 Saldo yang Bisa Digunakan

Jangan langsung menggunakan `Total Saldo`.

Gunakan konsep:

```text
Saldo Tersedia =
Total Saldo
- Dana Tabungan yang Dialokasikan
- Dana yang Dicadangkan
- Kewajiban yang Sudah Direncanakan
```

Pastikan jangan sampai satu transaksi dihitung dua kali.

---

## 4.2 Rumus Dasar

```text
Batas Aman Harian =
Saldo Tersedia / Jumlah Hari Tersisa
```

Contoh:

```text
Saldo tersedia = Rp6.106.000
Hari tersisa   = 22

Rp6.106.000 / 22
= Rp277.545
```

---

## 4.3 Penentuan Hari

Sistem harus mempunyai target:

```text
Bertahan sampai:
31 Agustus 2026
```

Jumlah hari dihitung berdasarkan tanggal sekarang dan tanggal target.

Perhatikan:

- timezone pengguna
- pergantian hari
- apakah hari ini ikut dihitung
- target tanggal yang sudah lewat
- target tanggal hari ini

Gunakan satu aturan yang konsisten di seluruh aplikasi.

---

# 5. Mode Anggaran

Di Pengaturan, ubah Anggaran Harian menjadi sistem dengan dua mode.

## 5.1 Mode Otomatis

```text
○ Otomatis
```

Sistem menghitung:

```text
Saldo tersedia
+/- proyeksi yang relevan
+ target tanggal
→ Batas Aman Harian
```

## 5.2 Mode Manual

```text
○ Manual
```

Pengguna dapat menentukan:

```text
Batas pengeluaran:
Rp50.000 / hari
```

Mode manual berguna bagi pengguna yang memang sudah mempunyai budget tetap.

---

# 6. Pengaturan

Bagian **Anggaran Harian** di halaman Pengaturan sebaiknya diubah menjadi:

## Anggaran & Perencanaan

Isi:

- Aktif/nonaktifkan Batas Aman Harian
- Mode Otomatis / Manual
- Target tanggal
- Batas manual jika mode manual
- Pilihan carry-over
- Pilihan memperhitungkan pemasukan masa depan
- Pilihan memperhitungkan kewajiban terjadwal

Contoh UI:

```text
Anggaran & Perencanaan

Aktifkan Batas Aman Harian              ON

Mode
[ Otomatis ] [ Manual ]

Target uang bertahan sampai
[ 31 Agustus 2026 ]

Batas Aman Hari Ini
Rp277.545 / hari

Saldo tersedia
Rp6.106.000

Sisa hari
22 hari
```

---

# 7. Carry-over Budget

Tambahkan opsi:

```text
Gunakan sisa budget ke hari berikutnya
[ ON / OFF ]
```

## 7.1 Jika Pengeluaran Lebih Kecil

Contoh:

```text
Budget hari ini     Rp277.545
Pengeluaran         Rp150.000
Sisa                Rp127.545
```

Jika carry-over aktif:

```text
Budget besok        Rp277.545
Carry-over          Rp127.545
--------------------------------
Budget besok        Rp405.090
```

## 7.2 Jika Pengeluaran Melebihi Budget

Contoh:

```text
Budget hari ini     Rp277.545
Pengeluaran         Rp350.000
Selisih             -Rp72.455
```

Hari berikutnya:

```text
Budget normal       Rp277.545
Penyesuaian         -Rp72.455
--------------------------------
Budget hari ini     Rp205.090
```

### Catatan UX

Jangan membuat pengguna merasa "dihukum".

Gunakan bahasa informatif:

> "Kemarin kamu menggunakan Rp72.455 lebih banyak dari batas harian. Agar uang tetap bertahan sampai target, batas hari ini disesuaikan menjadi Rp205.090."

---

# 8. Forecast / Prediksi Keuangan

Tambahkan fitur forecasting.

Tujuan:

> Menjawab "Kalau pola pengeluaran saya tetap seperti sekarang, uang saya akan bertahan sampai kapan?"

## 8.1 Data yang digunakan

Minimal:

- Saldo saat ini
- Riwayat pengeluaran
- Rata-rata pengeluaran harian
- Target tanggal
- Dana yang dialokasikan
- Pemasukan masa depan jika tersedia
- Pengeluaran masa depan jika tersedia

---

## 8.2 Contoh

```text
Saldo sekarang
Rp1.500.000

Rata-rata pengeluaran
Rp75.000 / hari

Perkiraan bertahan
20 hari
```

Kemudian:

```text
Target:
31 Agustus

Prediksi:
29 Agustus

🔴 Berpotensi habis 2 hari sebelum target.
```

---

# 9. Rata-rata Pengeluaran

Sistem perlu menghitung:

### Rata-rata harian

```text
Total pengeluaran periode
/
Jumlah hari aktif
```

Pertimbangkan dua jenis:

### Average Calendar Day

Menghitung semua hari dalam periode.

### Average Spending Day

Hanya menghitung hari ketika pengguna benar-benar melakukan pengeluaran.

Gunakan keduanya jika memungkinkan agar analisis lebih akurat.

---

# 10. Status Keuangan

Buat sistem status sederhana.

## 🟢 Aman

Pengeluaran aktual dan proyeksi masih berada di bawah batas.

## 🟡 Perlu Perhatian

Pengeluaran mulai mendekati batas atau prediksi menunjukkan risiko.

## 🔴 Berisiko

Dengan pola pengeluaran saat ini, saldo diperkirakan tidak bertahan sampai target.

Contoh:

```text
🟢 Aman
Kamu rata-rata menggunakan 67% dari batas harian.

🟡 Perlu Perhatian
Pengeluaranmu minggu ini 15% lebih tinggi dari rata-rata.

🔴 Berisiko
Saldo diperkirakan habis 4 hari sebelum target.
```

---

# 11. Forecast di Dashboard

Tambahkan card baru:

## Prediksi Keuangan

Contoh:

```text
┌─────────────────────────────────┐
│ 🔮 Prediksi Keuangan             │
│                                  │
│ Dengan pola pengeluaran saat ini │
│                                  │
│ Uang diperkirakan bertahan       │
│ ± 26 hari                        │
│                                  │
│ Target: 31 Agustus               │
│                                  │
│ 🟢 Masih aman                    │
└─────────────────────────────────┘
```

Jika tidak aman:

```text
🔴 Perhatian

Dengan pola pengeluaran sekarang,
uang diperkirakan habis 4 hari
sebelum target.

Kurangi rata-rata pengeluaran
sekitar Rp42.455 / hari.
```

---

# 12. Simulator "Kalau..."

Tambahkan halaman atau modal **Simulator**.

Tujuan:

Pengguna dapat mencoba berbagai skenario tanpa mengubah data asli.

Contoh:

```text
Jika saya menghabiskan:

Rp50.000 / hari
→ Bertahan ±30 hari

Rp75.000 / hari
→ Bertahan ±20 hari

Rp100.000 / hari
→ Bertahan ±15 hari
```

Input:

```text
Pengeluaran per hari
[ Rp75.000 ]

Target tanggal
[ 31 Agustus 2026 ]
```

Output:

```text
Estimasi saldo:
Rp250.000

Status:
🟢 Aman
```

Jika tidak aman:

```text
Status:
🔴 Tidak mencapai target

Kekurangan:
Rp320.000
```

Simulator tidak boleh mengubah transaksi, saldo, atau budget asli.

---

# 13. Laporan

Halaman Laporan saat ini berisi:

- Ringkasan Bulanan
- Pengeluaran per Kategori
- Alokasi per Sumber Dana

Tambahkan:

## Analisis Anggaran

Contoh:

```text
Agustus 2026

Rata-rata pengeluaran
Rp187.500 / hari

Batas aman
Rp277.545 / hari

Penggunaan budget
67,5%
```

Tambahkan grafik:

- Pengeluaran per hari
- Batas Aman Harian
- Rata-rata pengeluaran
- Pemasukan
- Proyeksi jika tersedia

---

# 14. Grafik Pengeluaran Harian

Grafik sebaiknya memperlihatkan perbandingan:

```text
Pengeluaran
│
│            ●
│      ●           ●
│   ●       ●
│────────────────────────
│   Batas Aman Harian
│
└────────────────────────
```

Gunakan garis batas harian agar pengguna bisa melihat hari mana yang:

- di bawah budget
- mendekati budget
- melewati budget

---

# 15. Pemasukan Masa Depan

Sistem perlu mendukung pemasukan terjadwal.

Contoh:

```text
15 Agustus
+ Gaji
Rp2.000.000
```

Data ini dapat digunakan untuk forecasting.

Contoh:

```text
Saldo sekarang:
Rp2.000.000

15 Agustus:
+ Rp2.000.000

20 Agustus:
- Rp800.000

Saldo proyeksi:
Rp3.200.000
```

---

# 16. Pengeluaran Masa Depan

Tambahkan konsep pengeluaran terjadwal.

Contoh:

```text
20 Agustus
Bayar kos
-Rp800.000

25 Agustus
Tagihan
-Rp200.000
```

Pengeluaran terjadwal harus diperhitungkan dalam forecast.

---

# 17. Future Cash Flow

Buat sistem proyeksi:

```text
Saldo Sekarang
      ↓
Pemasukan Mendatang
      ↓
Pengeluaran Mendatang
      ↓
Target Tabungan
      ↓
Hutang / Kewajiban
      ↓
Proyeksi Saldo
```

Contoh:

```text
09 Agustus
Rp7.706.000

15 Agustus
+Rp2.000.000

20 Agustus
-Rp800.000

31 Agustus
Rp8.906.000
```

---

# 18. Integrasi dengan Tabungan

Karena DompetKu sudah memiliki fitur Tabungan, dana yang dialokasikan ke target tabungan harus dapat dipisahkan dari uang yang boleh dibelanjakan.

Contoh:

```text
Total Saldo              Rp7.706.000
Tabungan                 Rp1.500.000
--------------------------------------
Saldo untuk pengeluaran  Rp6.206.000
```

Jika tabungan memiliki target tertentu, sistem dapat menampilkan:

```text
Target:
Beli Laptop

Terkumpul:
Rp1.500.000 / Rp5.000.000

30%
```

Dana tersebut tidak dihitung sebagai uang bebas jika pengguna memilih untuk mengunci/alokasikan dana tersebut.

---

# 19. Integrasi dengan Hutang

Hutang aktif harus dapat diperhitungkan dalam perencanaan.

Contoh:

```text
Saldo:
Rp7.706.000

Hutang yang harus dibayar:
Rp100.000

Saldo tersedia:
Rp7.606.000
```

Jika hutang memiliki tanggal jatuh tempo:

```text
20 Agustus
Bayar hutang
Rp100.000
```

maka forecast harus memperhitungkannya sebagai pengeluaran masa depan.

---

# 20. Integrasi dengan Sumber Dana

Fitur Sumber Dana sudah tersedia:

- BABA
- Gopay
- dll.

Untuk tahap awal, perhitungan Batas Aman Harian menggunakan seluruh sumber dana yang tersedia.

Tahap lanjutan dapat menyediakan budget per sumber:

```text
Semua Sumber
Rp277.545 / hari

BABA
Rp200.000 / hari

Gopay
Rp77.545 / hari
```

Jangan jadikan ini prioritas sebelum sistem budgeting utama stabil.

---

# 21. Validasi Konsistensi Angka

Ini sangat penting untuk aplikasi keuangan.

Semua halaman harus menggunakan sumber perhitungan yang konsisten.

Contoh masalah yang harus dihindari:

```text
Pengaturan:
Rp50.000 / hari

Dashboard:
Rp500.000 / hari
```

Angka seperti ini dapat membuat pengguna kehilangan kepercayaan terhadap aplikasi.

Pastikan:

```text
Dashboard
↓
Transaksi
↓
Tabungan
↓
Hutang
↓
Sumber Dana
↓
Laporan
↓
Forecast
```

menggunakan sumber data dan rumus yang konsisten.

---

# 22. Single Source of Truth

Hindari menghitung saldo secara berbeda di setiap halaman.

Buat satu fungsi/service utama untuk perhitungan finansial.

Contoh konsep:

```text
FinancialCalculator

getCurrentBalance()
getAvailableBalance()
getDailyBudget()
getDailySpending()
getRemainingDailyBudget()
getAverageDailySpending()
getProjectedBalance()
getProjectedEndDate()
getFinancialStatus()
```

Semua halaman menggunakan fungsi yang sama.

---

# 23. Edge Cases

Sistem harus menangani:

### Saldo = 0

```text
Batas aman:
Rp0
```

### Target tanggal sudah lewat

Minta pengguna menentukan target baru atau otomatis menonaktifkan budget.

### Target = hari ini

Jangan melakukan pembagian dengan 0.

### Tidak ada transaksi

Forecast berdasarkan saldo dan target, bukan rata-rata transaksi.

### Pengeluaran lebih besar dari saldo

Tampilkan kondisi negatif dengan jelas.

### Ada pemasukan masa depan

Masukkan hanya jika statusnya benar-benar dianggap terjadwal/terkonfirmasi.

### Tabungan lebih besar dari saldo bebas

Jangan menghasilkan saldo tersedia negatif tanpa penanganan UI.

### Hutang jatuh tempo

Masukkan ke proyeksi sesuai tanggal.

---

# 24. Prioritas Implementasi

## Phase 1 — Core Budget

Prioritas paling tinggi:

- [ ] Ubah konsep Anggaran Harian menjadi Batas Aman Harian
- [ ] Mode otomatis
- [ ] Mode manual
- [ ] Target tanggal
- [ ] Perhitungan saldo tersedia
- [ ] Perhitungan sisa hari
- [ ] Dashboard card
- [ ] Status Aman / Perhatian / Berisiko
- [ ] Sinkronisasi angka Dashboard dan Pengaturan

---

## Phase 2 — Smart Budget

- [ ] Pengeluaran hari ini
- [ ] Sisa budget hari ini
- [ ] Carry-over
- [ ] Penyesuaian budget setelah over-budget
- [ ] Riwayat penggunaan budget
- [ ] Rata-rata pengeluaran

---

## Phase 3 — Forecast

- [ ] Prediksi uang habis
- [ ] Prediksi saldo
- [ ] Forecast berdasarkan histori
- [ ] Future income
- [ ] Future expense
- [ ] Hutang jatuh tempo
- [ ] Target tabungan

---

## Phase 4 — Simulator

- [ ] Simulator pengeluaran harian
- [ ] Simulasi target tanggal
- [ ] Simulasi perubahan pengeluaran
- [ ] Simulasi pemasukan
- [ ] Simulasi pengeluaran masa depan
- [ ] Tampilan hasil tanpa mengubah data asli

---

## Phase 5 — Advanced Budgeting

- [ ] Budget per kategori
- [ ] Budget per sumber dana
- [ ] Flexible budget
- [ ] Analisis kebiasaan pengeluaran
- [ ] Rekomendasi penghematan
- [ ] Proyeksi jangka panjang

---

# 25. Prioritas UI

Dashboard sebaiknya memiliki hierarchy:

```text
1. Total Saldo
2. Batas Aman Harian
3. Pemasukan / Pengeluaran
4. Forecast
5. Target Tabungan
6. Grafik Pengeluaran
7. Sumber Dana
8. Transaksi Terakhir
```

Informasi yang paling penting untuk keputusan harian harus berada paling atas.

---

# 26. Konsep Dashboard Akhir

Rekomendasi struktur:

```text
Dashboard

┌─────────────────────────────────────────┐
│ Total Saldo                             │
│ Rp7.706.000                             │
│                                         │
│ Rp1.500.000 dialokasikan untuk tabungan │
└─────────────────────────────────────────┘

┌──────────────────────┐ ┌───────────────┐
│ Batas Aman Harian    │ │ Forecast      │
│                      │ │               │
│ Rp277.545            │ │ ±26 hari      │
│ Rp116.545 tersisa    │ │ 🟢 Aman       │
│ 🟢 Aman              │ │               │
└──────────────────────┘ └───────────────┘

┌────────────┐ ┌────────────┐
│ Pemasukan  │ │ Pengeluaran│
└────────────┘ └────────────┘

┌─────────────────────────────────────────┐
│ Pengeluaran Minggu Ini                  │
│                                         │
│ Grafik + Batas Aman                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Target Tabungan                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Ringkasan Sumber Dana                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Transaksi Terakhir                      │
└─────────────────────────────────────────┘
```

---

# 27. Prinsip UX

DompetKu jangan hanya menjadi tempat mencatat transaksi.

Tujuan akhirnya:

> **Membantu pengguna mengambil keputusan keuangan.**

Jadi sistem sebaiknya menjawab tiga pertanyaan:

### 1. "Uang saya sekarang berapa?"

→ Total Saldo

### 2. "Hari ini saya boleh menghabiskan berapa?"

→ Batas Aman Harian

### 3. "Kalau saya terus seperti ini, uang saya aman sampai kapan?"

→ Forecast

Tiga informasi tersebut harus menjadi inti pengalaman Dashboard.

---

# 28. Fitur yang Jangan Dipaksakan di Versi Awal

Jangan langsung menambahkan semuanya.

Hindari membuat sistem terlalu kompleks sebelum core stabil.

Untuk versi pertama, cukup:

```text
Saldo
  ↓
Saldo tersedia
  ↓
Target tanggal
  ↓
Batas Aman Harian
  ↓
Pengeluaran hari ini
  ↓
Status
```

Setelah itu baru tambahkan forecast dan future cash flow.

---

# 29. Definition of Done — Phase 1

Phase 1 dianggap selesai jika:

- [ ] User dapat mengaktifkan Batas Aman Harian.
- [ ] User dapat memilih mode otomatis/manual.
- [ ] User dapat menentukan target tanggal.
- [ ] Sistem menghitung saldo tersedia.
- [ ] Sistem menghitung sisa hari.
- [ ] Sistem menghitung Batas Aman Harian.
- [ ] Pengeluaran hari ini mengurangi budget hari ini.
- [ ] Dashboard menampilkan budget yang sama dengan Pengaturan.
- [ ] Tabungan dan kewajiban yang relevan tidak dihitung sebagai uang bebas.
- [ ] Target tanggal dapat diubah.
- [ ] Sistem menangani saldo 0 dan target hari ini.
- [ ] Semua perhitungan menggunakan sumber data yang sama.

---

# 30. Ringkasan Akhir

Fokus pengembangan DompetKu bukan sekadar menambahkan banyak fitur.

Fokus utamanya adalah membuat DompetKu mampu menjawab:

> **"Dengan kondisi keuangan saya sekarang, berapa uang yang aman saya habiskan hari ini dan apakah uang saya akan bertahan sampai target?"**

Arsitektur fitur:

```text
                 DOMPETKU
                     │
             ┌───────┴───────┐
             │               │
          DATA AKTUAL     RENCANA
             │               │
        ┌────┴────┐      ┌───┴────┐
        │         │      │        │
     Saldo    Transaksi  Target  Future Cash Flow
        │         │      │        │
        └────┬────┘      └───┬────┘
             │               │
             └───────┬───────┘
                     ↓
             SALDO TERSEDIA
                     ↓
             BATAS AMAN HARIAN
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      Status       Forecast    Simulator
        │            │            │
        └────────────┴────────────┘
                     ↓
              KEPUTUSAN USER
```

Prioritas utama:

**Batas Aman Harian → Smart Budget → Forecast → Simulator → Advanced Budgeting**

Dengan pendekatan ini, DompetKu berkembang dari **expense tracker** menjadi **personal financial planning tool** yang benar-benar membantu pengguna merencanakan uangnya.
