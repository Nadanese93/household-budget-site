// views.js — Render tiap halaman dari data nyata di AppState.
// Semua angka dihitung ulang dari transaksi saat ini, jadi tambah /
// hapus transaksi langsung mengubah dashboard, anggaran & grafik.

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function categoryLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function categoryColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : "#64748b";
}

function progressBar(pct, color) {
  const p = Math.min(100, Math.round(pct));
  const cls = pct >= 100 ? "over" : pct >= 90 ? "warn" : "";
  return '<div class="bar"><div class="bar-fill ' + cls + '" style="width:' + p + '%;background:' + color + '"></div></div>';
}

// ---------- Dashboard ----------
function renderDashboard() {
  const income = totalIncome();
  const spent = totalSpent(AppState.transactions);
  const left = income - spent;
  const byCat = spentByCategory(AppState.transactions);
  const unpaid = AppState.bills.filter((b) => !b.paid);
  const unpaidSum = unpaid.reduce((s, b) => s + b.amount, 0);
  const topCats = [...CATEGORIES]
    .map((c) => ({ ...c, spent: byCat[c.id] }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  return `
  <section class="hero">
    <p class="eyebrow">Anggaran Keluarga &middot; ${esc(FAMILY.month)}</p>
    <h1>Dompet ${esc(FAMILY.name)}: uang keluarga terkendali, tanpa tebak-tebakan.</h1>
    <p class="lede">Budi, Sari, Raka, dan Nara mencatat setiap rupiah bulan ini — dari belanja pasar sampai SPP sekolah — supaya di akhir bulan tetap ada sisa untuk ditabung.</p>
  </section>

  <section class="stats">
    <div class="stat"><span class="stat-label">Pemasukan</span><strong class="stat-num green">${formatRupiah(income)}</strong><span class="stat-sub">Gaji Budi + gaji Sari + kue</span></div>
    <div class="stat"><span class="stat-label">Pengeluaran</span><strong class="stat-num">${formatRupiah(spent)}</strong><span class="stat-sub">${AppState.transactions.length} transaksi tercatat</span></div>
    <div class="stat highlight"><span class="stat-label">Sisa bulan ini</span><strong class="stat-num green">${formatRupiah(left)}</strong><span class="stat-sub">${formatRupiah(4000000)} dialokasikan ke tabungan</span></div>
  </section>

  <section class="grid2">
    <div class="card">
      <h2>Belanja vs Anggaran per Kategori</h2>
      <canvas id="barChart" aria-label="Grafik batang belanja per kategori"></canvas>
    </div>
    <div class="card">
      <h2>Ke mana uang pergi?</h2>
      <canvas id="donutChart" aria-label="Grafik lingkaran porsi belanja"></canvas>
    </div>
  </section>

  <section class="grid2">
    <div class="card">
      <h2>Pengeluaran terbesar bulan ini</h2>
      <ol class="toplist">
        ${topCats.map((c, i) => `<li><span class="dot" style="background:${c.color}"></span><span>${i + 1}. ${esc(c.label)}</span><strong>${formatRupiah(c.spent)}</strong></li>`).join("")}
      </ol>
      <p class="hint">Sekolah anak paling besar karena SPP dua anak dibayar di awal bulan.</p>
    </div>
    <div class="card">
      <h2>Tagihan yang masih menunggu</h2>
      ${unpaid.length === 0
        ? "<p class='ok'>Semua tagihan bulan ini sudah lunas. Kerja bagus!</p>"
        : `<p><strong>${unpaid.length} tagihan</strong> belum dibayar, total <strong>${formatRupiah(unpaidSum)}</strong>:</p>
           <ul class="billmini">${unpaid.map((b) => `<li><span>${esc(b.name)}</span><strong>${formatRupiah(b.amount)}</strong><em>jatuh tempo ${formatDateShort(b.due)}</em></li>`).join("")}</ul>
           <p><a class="btn" href="#/tagihan">Lihat semua tagihan &rarr;</a></p>`}
    </div>
  </section>

  <section class="card">
    <h2>Keluarga Mahendra</h2>
    <div class="members">
      ${FAMILY.members.map((m) => `<div class="member"><strong>${esc(m.name)}</strong><span>${esc(m.role)} &middot; ${esc(m.job)}</span></div>`).join("")}
    </div>
    <p class="hint">Anggaran ini disusun bersama tiap awal bulan: kebutuhan pokok dulu, tagihan kedua, tabungan ketiga, hiburan terakhir — dan selalu ada dana darurat.</p>
  </section>`;
}

function drawDashboardCharts() {
  const byCat = spentByCategory(AppState.transactions);
  const bar = document.getElementById("barChart");
  const donut = document.getElementById("donutChart");
  if (bar) drawBarChart(bar, byCat);
  if (donut) drawDonutChart(donut, byCat);
}

// ---------- Transaksi ----------
function renderTransactions() {
  const f = AppState.txFilter;
  const rows = AppState.transactions
    .filter((t) => (f.category === "semua" || t.category === f.category))
    .filter((t) => !f.q || (t.desc + " " + categoryLabel(t.category)).toLowerCase().includes(f.q.toLowerCase()))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const shownTotal = totalSpent(rows);
  const options = CATEGORIES.map((c) => `<option value="${c.id}" ${f.category === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("");

  return `
  <section class="pagehead">
    <h1>Transaksi</h1>
    <p class="lede">Semua pemasukan dan pengeluaran ${esc(FAMILY.name)} bulan ${esc(FAMILY.month)}, tercatat satu per satu.</p>
  </section>

  <section class="card">
    <h2>Tambah transaksi baru</h2>
    <form id="addTxForm" class="formgrid">
      <label>Tanggal<input type="date" name="date" value="2026-11-26" required></label>
      <label>Keterangan<input type="text" name="desc" placeholder="cth: Belanja sayur pasar" maxlength="80" required></label>
      <label>Kategori<select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}</select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="500" placeholder="50000" required></label>
      <button class="btn primary" type="submit">+ Tambah transaksi</button>
    </form>
    <p class="hint">Transaksi baru langsung masuk daftar dan mengubah total di dashboard.</p>
  </section>

  <section class="card">
    <h2>Daftar transaksi <span class="count">${rows.length} baris &middot; total ${formatRupiah(shownTotal)}</span></h2>
    <div class="filters">
      <label>Filter kategori
        <select id="filterCategory"><option value="semua">Semua kategori</option>${options}</select>
      </label>
      <label>Cari
        <input type="search" id="filterSearch" placeholder="cth: pasar, bensin, SPP" value="${esc(f.q)}">
      </label>
    </div>
    <div class="tablewrap">
    <table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead>
      <tbody>
        ${rows.length === 0
          ? `<tr><td colspan="5" class="empty">Tidak ada transaksi yang cocok. Ubah filter atau kata kunci.</td></tr>`
          : rows.map((t) => `<tr>
              <td>${formatDateShort(t.date)}</td>
              <td>${esc(t.desc)}</td>
              <td><span class="chip" style="--chip:${categoryColor(t.category)}">${esc(categoryLabel(t.category))}</span></td>
              <td class="num">${formatRupiah(t.amount)}</td>
              <td><button class="btn small danger" data-delete-tx="${t.id}" type="button">Hapus</button></td>
            </tr>`).join("")}
      </tbody>
    </table>
    </div>
  </section>`;
}

// ---------- Anggaran ----------
function renderBudget() {
  const byCat = spentByCategory(AppState.transactions);
  const spent = totalSpent(AppState.transactions);
  const budget = totalBudget();
  const pctTotal = Math.round((spent / budget) * 100);
  const over = CATEGORIES.filter((c) => byCat[c.id] >= c.budget * 0.9);

  return `
  <section class="pagehead">
    <h1>Anggaran Bulanan</h1>
    <p class="lede">Batas belanja tiap kategori yang disepakati keluarga di awal bulan. Total terpakai <strong>${formatRupiah(spent)}</strong> dari anggaran <strong>${formatRupiah(budget)}</strong> (${pctTotal}%).</p>
  </section>

  ${over.length > 0 ? `<div class="alert"><strong>Perhatian:</strong> ${over.map((c) => esc(c.label)).join(", ")} sudah melewati 90% anggaran — tahan belanja di kategori ini sampai bulan depan.</div>` : ""}

  <section class="budgetlist">
    ${CATEGORIES.map((c) => {
      const s = byCat[c.id];
      const pct = Math.round((s / c.budget) * 100);
      const left = c.budget - s;
      const status = pct >= 100 ? "Lewat anggaran" : pct >= 90 ? "Hampir habis" : "Aman";
      return `<article class="card budgetcard">
        <div class="budget-top"><h2>${esc(c.label)}</h2><span class="pct ${pct >= 90 ? "hot" : ""}">${pct}%</span></div>
        ${progressBar(pct, c.color)}
        <p class="budget-nums"><span>Terpakai <strong>${formatRupiah(s)}</strong></span><span>Anggaran <strong>${formatRupiah(c.budget)}</strong></span><span>Sisa <strong class="${left < 0 ? "neg" : "green"}">${formatRupiah(left)}</strong></span></p>
        <p class="hint">${status}${left < 0 ? " — sudah lewat " + formatRupiah(-left) : " — masih tersisa " + formatRupiah(left) + " untuk bulan ini"}.</p>
      </article>`;
    }).join("")}
  </section>

  <section class="card">
    <h2>Cara keluarga ini menyusun anggaran</h2>
    <ol class="steps">
      <li><strong>Kebutuhan pokok dulu:</strong> dapur, listrik, air, dan sekolah anak dihitung dari rata-rata tiga bulan terakhir.</li>
      <li><strong>Tagihan dicatat tanggalnya</strong> supaya tidak ada yang telat — lihat halaman Tagihan.</li>
      <li><strong>Tabungan dipotong di awal,</strong> bukan dari sisa: Rp 4.000.000 langsung dipindah begitu gaji masuk.</li>
      <li><strong>Sisa anggaran boleh dipakai</strong> untuk hiburan keluarga, tapi tidak boleh mengambil jatah kategori lain.</li>
    </ol>
  </section>`;
}

// ---------- Tagihan ----------
function renderBills() {
  const paid = AppState.bills.filter((b) => b.paid);
  const unpaid = AppState.bills.filter((b) => !b.paid);
  const paidSum = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidSum = unpaid.reduce((s, b) => s + b.amount, 0);

  const row = (b) => `<tr>
    <td>${esc(b.name)}</td>
    <td class="num">${formatRupiah(b.amount)}</td>
    <td>${formatDateShort(b.due)}</td>
    <td>${b.paid ? '<span class="badge ok">Lunas</span>' : '<span class="badge due">Belum lunas</span>'}</td>
    <td>${b.paid ? "" : `<button class="btn small primary" data-pay-bill="${b.id}" type="button">Tandai lunas</button>`}</td>
  </tr>`;

  return `
  <section class="pagehead">
    <h1>Tagihan Rutin</h1>
    <p class="lede">Semua tagihan bulanan ${esc(FAMILY.name)}: <strong>${paid.length} lunas (${formatRupiah(paidSum)})</strong> dan <strong>${unpaid.length} belum lunas (${formatRupiah(unpaidSum)})</strong>.</p>
  </section>

  <section class="card">
    <h2>Belum lunas</h2>
    ${unpaid.length === 0
      ? "<p class='ok'>Semua tagihan sudah lunas.</p>"
      : `<div class="tablewrap"><table><thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th></th></tr></thead><tbody>${unpaid.map(row).join("")}</tbody></table></div>`}
  </section>

  <section class="card">
    <h2>Sudah lunas</h2>
    <div class="tablewrap"><table><thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th>Jatuh tempo</th><th>Status</th><th></th></tr></thead><tbody>${paid.map(row).join("")}</tbody></table></div>
    <p class="hint">Tagihan yang ditandai lunas di sini tercatat sudah dibayar dan tidak muncul lagi di daftar menunggu di dashboard.</p>
  </section>`;
}

// ---------- Tujuan / Tabungan ----------
function renderGoals() {
  const totalSaved = AppState.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = AppState.goals.reduce((s, g) => s + g.target, 0);

  return `
  <section class="pagehead">
    <h1>Tujuan Tabungan</h1>
    <p class="lede">Tiga target keluarga tahun ini. Total terkumpul <strong>${formatRupiah(totalSaved)}</strong> dari target <strong>${formatRupiah(totalTarget)}</strong> (${Math.round((totalSaved / totalTarget) * 100)}%).</p>
  </section>

  <section class="card">
    <h2>Tambah setoran</h2>
    <form id="addDepositForm" class="formgrid">
      <label>Tujuan
        <select name="goal">${AppState.goals.map((g) => `<option value="${g.id}">${esc(g.name)}</option>`).join("")}</select>
      </label>
      <label>Jumlah setoran (Rp)<input type="number" name="amount" min="10000" step="10000" placeholder="500000" required></label>
      <button class="btn primary" type="submit">+ Tambah setoran</button>
    </form>
    <p class="hint">Setoran langsung menambah progress tujuan yang dipilih.</p>
  </section>

  <section class="goallist">
    ${AppState.goals.map((g) => {
      const pct = Math.round((g.saved / g.target) * 100);
      const left = g.target - g.saved;
      return `<article class="card goalcard">
        <div class="budget-top"><h2>${esc(g.name)}</h2><span class="pct">${pct}%</span></div>
        ${progressBar(pct, "#2e7d5b")}
        <p class="budget-nums"><span>Terkumpul <strong>${formatRupiah(g.saved)}</strong></span><span>Target <strong>${formatRupiah(g.target)}</strong></span><span>Kurang <strong>${formatRupiah(left)}</strong></span></p>
        <p class="hint">${esc(g.note)}</p>
      </article>`;
    }).join("")}
  </section>

  <section class="card">
    <h2>Aturan tabungan keluarga</h2>
    <ol class="steps">
      <li><strong>Dana darurat tidak boleh disentuh</strong> kecuali kehilangan penghasilan atau darurat medis.</li>
      <li><strong>Setoran dilakukan tiap tanggal 1,</strong> begitu gaji masuk — sebelum belanja apa pun.</li>
      <li><strong>Liburan dibayar dari tabungan liburan,</strong> bukan dari kartu kredit atau utang.</li>
    </ol>
  </section>`;
}
