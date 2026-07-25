# Product Requirements Document (PRD)

## CekDulu — AI Pendeteksi Penipuan Digital

**Versi:** 1.0  
**Status:** MVP Hackathon  
**Role:** Hacker  
**Tagline:** Sebelum percaya dan transfer, CekDulu.

---

## 1. Ringkasan Produk

CekDulu adalah aplikasi web berbasis AI yang membantu masyarakat melakukan pemeriksaan awal terhadap pesan digital yang mencurigakan.

Pengguna dapat menempelkan isi pesan dari WhatsApp, SMS, email, atau media sosial. Sistem kemudian menganalisis pesan dan menampilkan skor risiko, tingkat risiko, tanda-tanda mencurigakan, penjelasan, serta rekomendasi tindakan aman.

Aplikasi dapat digunakan melalui perangkat PC maupun smartphone.

---

## 2. Latar Belakang

Penipuan digital terus berkembang melalui berbagai modus, seperti hadiah palsu, investasi ilegal, lowongan kerja palsu, penyamaran sebagai lembaga resmi, permintaan OTP, dan permintaan transfer dengan tekanan waktu.

Berdasarkan data Indonesia Anti-Scam Centre (IASC), terdapat 411.055 laporan penipuan yang diterima sejak 22 November 2024 sampai 28 Desember 2025.

Banyak pengguna belum mampu mengenali tanda-tanda penipuan dan sering mengambil keputusan sebelum melakukan verifikasi. Oleh karena itu, dibutuhkan alat pemeriksaan awal yang cepat, mudah digunakan, dan memberikan penjelasan dengan bahasa sederhana.

---

## 3. Pernyataan Masalah

Bagaimana membantu masyarakat mengenali indikasi penipuan digital sebelum memberikan data pribadi atau melakukan transaksi keuangan?

---

## 4. Target Pengguna

CekDulu ditujukan untuk:

- Pengguna aktif WhatsApp, SMS, email, dan media sosial.
- Pelajar dan mahasiswa.
- Orang tua dan pengguna yang belum memahami modus penipuan digital.
- Masyarakat yang menerima penawaran atau permintaan transaksi mencurigakan.
- Pengguna yang membutuhkan pemeriksaan awal sebelum mengambil keputusan.

---

## 5. Tujuan Produk

- Membantu pengguna melakukan pemeriksaan sebelum percaya atau transfer.
- Meningkatkan literasi masyarakat mengenai modus penipuan digital.
- Menjelaskan tanda-tanda penipuan dengan bahasa yang mudah dipahami.
- Memberikan rekomendasi tindakan keamanan yang relevan.
- Menyediakan riwayat pemeriksaan untuk dipelajari kembali.

---

## 6. Value Proposition

CekDulu tidak hanya memberikan peringatan bahwa sebuah pesan mencurigakan, tetapi juga menjelaskan alasan di balik penilaian tersebut dan tindakan yang sebaiknya dilakukan pengguna.

**Nilai utama CekDulu:**

- Cepat digunakan.
- Mudah dipahami.
- Memberikan alasan yang transparan.
- Membantu pengguna mengambil keputusan dengan lebih aman.
- Mendorong kebiasaan “cek sebelum percaya”.

---

## 7. Fitur MVP

### 7.1 Autentikasi

- Registrasi menggunakan email dan password.
- Login.
- Logout.
- Setiap pengguna hanya dapat melihat riwayat miliknya.

### 7.2 Analisis Pesan

Pengguna dapat menempelkan pesan mencurigakan ke dalam formulir.

Sistem akan menampilkan:

- Skor risiko antara 0–100.
- Tingkat risiko: rendah, sedang, atau tinggi.
- Jenis atau dugaan modus penipuan.
- Daftar indikator yang mencurigakan.
- Penjelasan hasil analisis.
- Rekomendasi tindakan aman.

### 7.3 Riwayat Analisis

- Menyimpan hasil pemeriksaan ke database Supabase.
- Menampilkan daftar riwayat pemeriksaan.
- Membuka detail hasil pemeriksaan.
- Menghapus riwayat milik pengguna.

### 7.4 Dashboard

Dashboard menampilkan:

- Jumlah pesan yang telah diperiksa.
- Jumlah hasil berisiko tinggi.
- Jumlah hasil berisiko sedang.
- Jumlah hasil berisiko rendah.
- Daftar pemeriksaan terbaru.

### 7.5 Edukasi Keamanan

Aplikasi menampilkan pengingat untuk:

- Tidak memberikan OTP, PIN, atau password.
- Tidak langsung membuka tautan mencurigakan.
- Tidak melakukan transfer karena tekanan waktu.
- Memverifikasi informasi melalui saluran resmi.
- Melaporkan penipuan melalui kanal resmi.

---

## 8. Fitur di Luar MVP

Fitur berikut tidak menjadi prioritas dalam pengerjaan delapan jam:

- Analisis screenshot menggunakan AI Vision.
- Pemeriksaan reputasi nomor telepon.
- Pemeriksaan domain atau tautan secara otomatis.
- Forum laporan masyarakat.
- Notifikasi real-time.
- Aplikasi Android dan iOS.
- Integrasi langsung dengan WhatsApp.

Fitur tersebut dapat dikembangkan setelah MVP selesai.

---

## 9. User Flow

1. Pengguna membuka halaman CekDulu.
2. Pengguna membaca manfaat aplikasi.
3. Pengguna membuat akun atau login.
4. Pengguna membuka halaman pemeriksaan.
5. Pengguna menempelkan pesan mencurigakan.
6. Pengguna menekan tombol **Analisis Sekarang**.
7. Sistem mengirim pesan ke LLM API.
8. AI mengembalikan hasil analisis terstruktur.
9. Sistem menyimpan hasil ke Supabase.
10. Pengguna melihat skor, indikator, penjelasan, dan rekomendasi.
11. Pengguna dapat membuka hasil tersebut melalui halaman riwayat.

---

## 10. Struktur Halaman

### Halaman Publik

- Landing page
- Login
- Registrasi

### Halaman Pengguna

- Dashboard
- Periksa Pesan
- Detail Hasil Analisis
- Riwayat Pemeriksaan

---

## 11. Kebutuhan Fungsional

- Sistem harus memungkinkan pengguna mendaftar dan login.
- Sistem harus menerima teks pesan dari pengguna.
- Sistem harus mengirimkan pesan ke LLM API.
- Sistem harus menerima respons AI dalam format terstruktur.
- Sistem harus menghitung dan menampilkan tingkat risiko.
- Sistem harus menyimpan hasil analisis ke Supabase.
- Sistem harus membatasi data berdasarkan pengguna.
- Sistem harus dapat digunakan di PC dan smartphone.
- Sistem harus menampilkan pesan kesalahan ketika analisis gagal.

---

## 12. Kebutuhan Nonfungsional

- Tampilan harus responsif.
- Waktu analisis diupayakan kurang dari 15 detik.
- API key tidak boleh disimpan dalam source code.
- API key hanya digunakan melalui server.
- Password pengguna dikelola oleh Supabase Authentication.
- Database harus menggunakan Row Level Security.
- Aplikasi harus dapat diakses melalui URL publik.
- Bahasa antarmuka menggunakan Bahasa Indonesia.

---

## 13. Struktur Data

Tabel utama yang digunakan adalah `analyses`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | ID unik hasil analisis |
| user_id | UUID | ID pengguna |
| input_text | TEXT | Pesan yang diperiksa |
| risk_score | INTEGER | Skor risiko 0–100 |
| risk_level | TEXT | Rendah, sedang, atau tinggi |
| scam_type | TEXT | Dugaan jenis penipuan |
| indicators | JSONB | Daftar indikator mencurigakan |
| explanation | TEXT | Penjelasan hasil analisis |
| recommendations | JSONB | Daftar tindakan yang disarankan |
| created_at | TIMESTAMPTZ | Waktu pemeriksaan |

---

## 14. Teknologi

- **Framework:** Next.js
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **Autentikasi:** Supabase Authentication
- **Database:** Supabase PostgreSQL
- **LLM API:** Gemini API
- **Deployment:** Vercel
- **Version Control:** Git dan GitHub

---

## 15. Indikator Keberhasilan

MVP dinyatakan berhasil apabila:

- Pengguna dapat membuat akun.
- Pengguna dapat login dan logout.
- Pengguna dapat memasukkan pesan mencurigakan.
- AI dapat menghasilkan analisis terstruktur.
- Hasil analisis dapat disimpan di Supabase.
- Pengguna dapat melihat riwayat pemeriksaan.
- Data antar pengguna tidak dapat saling diakses.
- Aplikasi dapat digunakan di PC dan HP.
- Aplikasi dapat diakses melalui URL publik Vercel.
- Repository memiliki commit history yang terstruktur.

---

## 16. Batasan dan Disclaimer

CekDulu merupakan alat edukasi dan pemeriksaan awal. Hasil analisis tidak dapat dijadikan sebagai keputusan hukum atau jaminan bahwa suatu pesan pasti aman maupun pasti merupakan penipuan.

Pengguna tetap perlu melakukan verifikasi melalui saluran resmi dan tidak boleh memasukkan informasi rahasia seperti:

- Password.
- PIN.
- OTP.
- Nomor kartu lengkap.
- CVV.
- Data pribadi sensitif lainnya.

---

## 17. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| AI menghasilkan penilaian yang keliru | Tampilkan alasan, indikator, dan disclaimer |
| Pengguna memasukkan data sensitif | Tampilkan peringatan sebelum analisis |
| Respons AI tidak sesuai format | Gunakan validasi respons pada server |
| API gagal atau kuota habis | Tampilkan pesan kesalahan yang mudah dipahami |
| Data pengguna dapat diakses pihak lain | Terapkan Row Level Security Supabase |
| API key terlihat di browser | Jalankan pemanggilan AI melalui server |

---

## 18. Rencana Pengembangan

Setelah MVP, CekDulu dapat dikembangkan dengan:

- Analisis screenshot.
- Deteksi tautan mencurigakan.
- Basis data modus penipuan.
- Pelaporan anonim dari masyarakat.
- Peta tren penipuan berdasarkan kategori.
- Integrasi kanal pelaporan resmi.
- Ekstensi browser atau aplikasi mobile.