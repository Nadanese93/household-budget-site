// charts.js — Grafik batang & lingkaran digambar dari data nyata
// dengan canvas murni (tanpa library, tanpa gambar statis).

function setupCanvas(canvas, heightCss) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = heightCss;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, width, height };
}

// Grafik batang: belanja aktual per kategori vs anggarannya.
function drawBarChart(canvas, spent) {
  const { ctx, width, height } = setupCanvas(canvas, 260);
  const rows = CATEGORIES.map((c) => ({
    label: c.short,
    spent: spent[c.id],
    budget: c.budget,
    color: c.color,
  }));
  const max = Math.max(...rows.map((r) => r.budget)) * 1.08;
  const padL = 118, padR = 70, padT = 14, padB = 26;
  const plotW = width - padL - padR;
  const rowH = (height - padT - padB) / rows.length;
  const barH = Math.min(16, rowH * 0.42);
  ctx.clearRect(0, 0, width, height);
  ctx.font = "13px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  rows.forEach((r, i) => {
    const y = padT + i * rowH + rowH / 2;
    ctx.fillStyle = "#334155";
    ctx.textAlign = "right";
    ctx.fillText(r.label, padL - 8, y);
    // Batang anggaran (latar, abu-abu muda)
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.roundRect(padL, y - barH / 2, (r.budget / max) * plotW, barH, 4);
    ctx.fill();
    // Batang belanja aktual
    ctx.fillStyle = r.spent > r.budget * 0.9 ? "#dc2626" : r.color;
    ctx.beginPath();
    ctx.roundRect(padL, y - barH / 2, Math.max(2, (r.spent / max) * plotW), barH, 4);
    ctx.fill();
    // Angka Rp (juta)
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "left";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.fillText("Rp " + (r.spent / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " jt", padL + (r.budget / max) * plotW + 6, y);
    ctx.font = "13px system-ui, sans-serif";
  });
  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Batang hijau/teal = belanja aktual · batang abu-abu = anggaran · merah = di atas 90% anggaran", padL, height - 8);
}

// Grafik lingkaran: porsi tiap kategori dari total belanja.
function drawDonutChart(canvas, spent) {
  const tall = canvas.clientWidth < 480;
  const { ctx, width, height } = setupCanvas(canvas, tall ? 330 : 260);
  const total = Object.values(spent).reduce((a, b) => a + b, 0);
  const narrow = width < 480;
  const cx = narrow ? width / 2 : 130;
  const cy = narrow ? 118 : 130;
  const rOuter = narrow ? 96 : 104;
  const rInner = narrow ? 58 : 62;
  let angle = -Math.PI / 2;
  ctx.clearRect(0, 0, width, height);
  for (const c of CATEGORIES) {
    const v = spent[c.id];
    if (v <= 0) continue;
    const sweep = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rOuter, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = c.color;
    ctx.fill();
    angle += sweep;
  }
  // Lubang tengah
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 17px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Rp " + (total / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " jt", cx, cy - 6);
  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("total belanja", cx, cy + 14);
  // Legenda: di kanan pada layar lebar, di bawah lingkaran pada layar sempit.
  ctx.textAlign = "left";
  ctx.font = "13px system-ui, sans-serif";
  if (narrow) {
    const items = CATEGORIES.filter((c) => spent[c.id] > 0);
    const cols = 2;
    const colW = width / cols;
    items.forEach((c, i) => {
      const lx = (i % cols) * colW + 8;
      const ly = 232 + Math.floor(i / cols) * 24;
      const pct = Math.round((spent[c.id] / total) * 100);
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, ly - 6, 12, 12);
      ctx.fillStyle = "#334155";
      ctx.fillText(c.short + " " + pct + "%", lx + 18, ly);
    });
    return;
  }
  let ly = 26;
  for (const c of CATEGORIES) {
    const v = spent[c.id];
    if (v <= 0) continue;
    const pct = Math.round((v / total) * 100);
    ctx.fillStyle = c.color;
    ctx.fillRect(258, ly - 6, 12, 12);
    ctx.fillStyle = "#334155";
    ctx.fillText(c.label + " — " + pct + "%", 276, ly);
    ly += 28;
  }
}
