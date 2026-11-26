// data.js — Semua angka Keluarga Mahendra untuk November 2026.
// Satu sumber kebenaran: total pemasukan, total belanja, dan sisa
// dihitung dari daftar di bawah ini, jadi angka di semua halaman
// selalu konsisten satu sama lain.

const FAMILY = {
  name: "Keluarga Mahendra",
  month: "November 2026",
  members: [
    { role: "Ayah", name: "Budi Mahendra", job: "Staf logistik" },
    { role: "Ibu", name: "Sari Mahendra", job: "Guru SD & penjual kue" },
    { role: "Anak", name: "Raka (12 th)", job: "SMP kelas 7" },
    { role: "Anak", name: "Nara (8 th)", job: "SD kelas 3" },
  ],
};

// Pemasukan bulan ini: 12.500.000 + 6.800.000 + 1.200.000 = 20.500.000
const INCOME = [
  { id: "in1", date: "2026-11-01", desc: "Gaji Budi Mahendra", amount: 12500000 },
  { id: "in2", date: "2026-11-01", desc: "Gaji Sari Mahendra", amount: 6800000 },
  { id: "in3", date: "2026-11-15", desc: "Pesanan kue Sari (12 loyang)", amount: 1200000 },
];

// Kategori belanja: warna dipakai grafik + label di tabel.
const CATEGORIES = [
  { id: "dapur", label: "Belanja Harian & Dapur", short: "Dapur", budget: 4500000, color: "#2e7d5b" },
  { id: "listrik", label: "Listrik & Air", short: "Listrik & Air", budget: 850000, color: "#0e7490" },
  { id: "internet", label: "Internet & Pulsa", short: "Internet", budget: 450000, color: "#7c5cbf" },
  { id: "sekolah", label: "Sekolah Anak", short: "Sekolah Anak", budget: 2400000, color: "#b45309" },
  { id: "transport", label: "Transport & Bensin", short: "Transport", budget: 1600000, color: "#be185d" },
  { id: "kesehatan", label: "Kesehatan", short: "Kesehatan", budget: 600000, color: "#dc2626" },
  { id: "hiburan", label: "Hiburan & Keluarga", short: "Hiburan", budget: 800000, color: "#4d7c0f" },
  { id: "lain", label: "Lain-lain", short: "Lain-lain", budget: 500000, color: "#64748b" },
];

// 28 transaksi nyata. Total belanja = Rp 8.820.000
// (dapur 3.010.000 + listrik 605.000 + internet 450.000 + sekolah 2.375.000
//  + transport 1.330.000 + kesehatan 320.000 + hiburan 450.000 + lain 280.000)
const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", desc: "Pasar tradisional — sayur & buah", category: "dapur", amount: 185000 },
  { id: "t02", date: "2026-11-02", desc: "SPP sekolah Raka & Nara", category: "sekolah", amount: 1800000 },
  { id: "t03", date: "2026-11-03", desc: "Supermarket — beras 10 kg & minyak", category: "dapur", amount: 425000 },
  { id: "t04", date: "2026-11-03", desc: "Internet IndiHome bulanan", category: "internet", amount: 350000 },
  { id: "t05", date: "2026-11-04", desc: "Bensin motor", category: "transport", amount: 250000 },
  { id: "t06", date: "2026-11-05", desc: "Pasar tradisional — lauk mingguan", category: "dapur", amount: 210000 },
  { id: "t07", date: "2026-11-05", desc: "Token listrik PLN", category: "listrik", amount: 420000 },
  { id: "t08", date: "2026-11-07", desc: "Les matematika Raka", category: "sekolah", amount: 400000 },
  { id: "t09", date: "2026-11-08", desc: "Supermarket mingguan", category: "dapur", amount: 385000 },
  { id: "t10", date: "2026-11-09", desc: "Bensin mobil", category: "transport", amount: 400000 },
  { id: "t11", date: "2026-11-10", desc: "Warung — telur & tempe", category: "dapur", amount: 95000 },
  { id: "t12", date: "2026-11-10", desc: "Tagihan air PDAM", category: "listrik", amount: 185000 },
  { id: "t13", date: "2026-11-11", desc: "Apotek — vitamin & obat", category: "kesehatan", amount: 320000 },
  { id: "t14", date: "2026-11-12", desc: "Pasar tradisional — sayur & buah", category: "dapur", amount: 175000 },
  { id: "t15", date: "2026-11-12", desc: "Pulsa & paket data", category: "internet", amount: 100000 },
  { id: "t16", date: "2026-11-14", desc: "Buku & alat tulis anak", category: "sekolah", amount: 175000 },
  { id: "t17", date: "2026-11-15", desc: "Supermarket mingguan", category: "dapur", amount: 410000 },
  { id: "t18", date: "2026-11-16", desc: "Tol & parkir", category: "transport", amount: 250000 },
  { id: "t19", date: "2026-11-16", desc: "Nonton bioskop keluarga", category: "hiburan", amount: 260000 },
  { id: "t20", date: "2026-11-17", desc: "Ayam & ikan pasar", category: "dapur", amount: 230000 },
  { id: "t21", date: "2026-11-18", desc: "Perbaikan kran bocor", category: "lain", amount: 280000 },
  { id: "t22", date: "2026-11-19", desc: "Pasar tradisional — lauk mingguan", category: "dapur", amount: 190000 },
  { id: "t23", date: "2026-11-21", desc: "Ojek online", category: "transport", amount: 180000 },
  { id: "t24", date: "2026-11-22", desc: "Supermarket mingguan", category: "dapur", amount: 395000 },
  { id: "t25", date: "2026-11-23", desc: "Bensin motor", category: "transport", amount: 250000 },
  { id: "t26", date: "2026-11-23", desc: "Makan di luar — akhir pekan", category: "hiburan", amount: 190000 },
  { id: "t27", date: "2026-11-24", desc: "Warung — bumbu dapur & gas", category: "dapur", amount: 165000 },
  { id: "t28", date: "2026-11-25", desc: "Buah & susu anak", category: "dapur", amount: 145000 },
];

// Tagihan rutin bulanan. "Lunas" berarti sudah tercatat di transaksi.
const BILLS = [
  { id: "b1", name: "SPP Sekolah Raka & Nara", amount: 1800000, due: "2026-11-02", paid: true },
  { id: "b2", name: "Internet IndiHome", amount: 350000, due: "2026-11-03", paid: true },
  { id: "b3", name: "Listrik PLN (token)", amount: 420000, due: "2026-11-05", paid: true },
  { id: "b4", name: "Air PDAM", amount: 185000, due: "2026-11-10", paid: true },
  { id: "b5", name: "Iuran RT & keamanan", amount: 150000, due: "2026-11-15", paid: false },
  { id: "b6", name: "Asuransi kesehatan keluarga", amount: 650000, due: "2026-11-20", paid: false },
  { id: "b7", name: "Langganan streaming film", amount: 79000, due: "2026-11-25", paid: true },
  { id: "b8", name: "Cicilan motor", amount: 850000, due: "2026-11-28", paid: false },
];

// Target tabungan keluarga.
const GOALS = [
  { id: "g1", name: "Dana Darurat", note: "6 bulan pengeluaran pokok, disimpan di rekening terpisah", target: 30000000, saved: 18500000 },
  { id: "g2", name: "Liburan Keluarga ke Yogyakarta", note: "Berangkat libur sekolah Desember — kereta, hotel & makan", target: 8000000, saved: 3250000 },
  { id: "g3", name: "Pendidikan Anak", note: "Biaya masuk SMP Raka & tabungan kuliah, dicicil tiap bulan", target: 50000000, saved: 12750000 },
];

// ---- Hitungan turunan (dipakai semua halaman) ----
function totalIncome() {
  return INCOME.reduce((s, x) => s + x.amount, 0);
}
function totalSpent(list) {
  return list.reduce((s, x) => s + x.amount, 0);
}
function spentByCategory(list) {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of list) {
    if (out[t.category] !== undefined) out[t.category] += t.amount;
  }
  return out;
}
function totalBudget() {
  return CATEGORIES.reduce((s, c) => s + c.budget, 0);
}
function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
