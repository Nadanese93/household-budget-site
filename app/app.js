// app.js — Router hash + state aplikasi Dompet Mahendra.
// State hidup di memori selama halaman dibuka; semua halaman
// membaca dari AppState yang sama sehingga angka selalu konsisten.

const AppState = {
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  bills: BILLS.map((b) => ({ ...b })),
  goals: GOALS.map((g) => ({ ...g })),
  txFilter: { category: "semua", q: "" },
};

const ROUTES = {
  "#/dashboard": { title: "Dashboard", render: renderDashboard, after: drawDashboardCharts },
  "#/transaksi": { title: "Transaksi", render: renderTransactions, after: null },
  "#/anggaran": { title: "Anggaran", render: renderBudget, after: null },
  "#/tagihan": { title: "Tagihan", render: renderBills, after: null },
  "#/tujuan": { title: "Tujuan Tabungan", render: renderGoals, after: null },
};

function currentRoute() {
  const hash = window.location.hash || "#/dashboard";
  return ROUTES[hash] ? hash : "#/dashboard";
}

function render() {
  const hash = currentRoute();
  const route = ROUTES[hash];
  const view = document.getElementById("view");
  view.innerHTML = route.render();
  document.querySelectorAll(".navlink").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === hash);
    if (a.getAttribute("href") === hash) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (route.after) route.after();
  window.scrollTo(0, 0);
}

function nextTxId() {
  return "t" + String(AppState.transactions.length + 1).padStart(2, "0") + "-" + Date.now();
}

// ---- Delegasi event: satu listener untuk seluruh #view ----
document.getElementById("view").addEventListener("submit", (ev) => {
  if (ev.target.id === "addTxForm") {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const amount = Number(fd.get("amount"));
    const desc = String(fd.get("desc") || "").trim();
    const date = String(fd.get("date") || "2026-11-26");
    const category = String(fd.get("category") || "lain");
    if (!desc || !amount || amount <= 0) return;
    AppState.transactions.push({ id: nextTxId(), date, desc, category, amount });
    render();
    const note = document.createElement("p");
    note.className = "ok";
    note.textContent = "Transaksi \"" + desc + "\" sebesar " + formatRupiah(amount) + " sudah ditambahkan.";
    document.getElementById("view").prepend(note);
  }
  if (ev.target.id === "addDepositForm") {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const goal = AppState.goals.find((g) => g.id === String(fd.get("goal")));
    const amount = Number(fd.get("amount"));
    if (!goal || !amount || amount <= 0) return;
    goal.saved += amount;
    render();
    const note = document.createElement("p");
    note.className = "ok";
    note.textContent = "Setoran " + formatRupiah(amount) + " ke \"" + goal.name + "\" sudah dicatat.";
    document.getElementById("view").prepend(note);
  }
});

document.getElementById("view").addEventListener("click", (ev) => {
  const del = ev.target.closest("[data-delete-tx]");
  if (del) {
    const id = del.getAttribute("data-delete-tx");
    AppState.transactions = AppState.transactions.filter((t) => t.id !== id);
    render();
    return;
  }
  const pay = ev.target.closest("[data-pay-bill]");
  if (pay) {
    const bill = AppState.bills.find((b) => b.id === pay.getAttribute("data-pay-bill"));
    if (bill) bill.paid = true;
    render();
  }
});

document.getElementById("view").addEventListener("input", (ev) => {
  if (ev.target.id === "filterCategory") {
    AppState.txFilter.category = ev.target.value;
    render();
    const sel = document.getElementById("filterCategory");
    if (sel) sel.focus();
  }
  if (ev.target.id === "filterSearch") {
    AppState.txFilter.q = ev.target.value;
    const pos = ev.target.selectionStart;
    render();
    const input = document.getElementById("filterSearch");
    if (input) {
      input.focus();
      input.setSelectionRange(pos, pos);
    }
  }
});

window.addEventListener("hashchange", render);
render();
