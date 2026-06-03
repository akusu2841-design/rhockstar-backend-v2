const API = "https://rhockstar-nation-1.onrender.com";

/* =========================
   NEWS SYSTEM
========================= */

const news = [
  "🚀 New website projects coming soon",
  "💼 3 clients onboarded this week",
  "📢 Discount on business systems ends soon",
  "🔥 New portfolio update live"
];

function loadNews() {
  const box = document.getElementById("newsBox");
  if (!box) return;

  let i = 0;

  setInterval(() => {
    box.innerHTML = news[i];
    i = (i + 1) % news.length;
  }, 2500);
}

/* =========================
   SAFE INIT
========================= */

window.addEventListener("DOMContentLoaded", () => {

  loadNews();

  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.onclick = closeMenu;
  }

});

/* =========================
   MENU CONTROL
========================= */

function toggleMenu() {
  const nav = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  if (!nav || !overlay) return;

  nav.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeMenu() {
  const nav = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  nav?.classList.remove("active");
  overlay?.classList.remove("active");
}

/* =========================
   PAGE SWITCH
========================= */

function show(id) {

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const page = document.getElementById(id);

  if (!page) {
    console.error("Page not found:", id);
    return;
  }

  page.classList.add("active");

  closeMenu();

  if (id === "admin") {
    loadOrders();
  }
}

/* =========================
   SERVICE SELECT
========================= */

let selectedPrice = 0;

function selectService(service, price, category) {

  const serviceInput = document.getElementById("serviceInput");

  if (!serviceInput) return;

  serviceInput.value = service;
  selectedPrice = price;

  serviceInput.dataset.category = category || "other";

  updatePaymentAmount();
  show("dashboard");
}

/* =========================
   PAYMENT CALC
========================= */

function updatePaymentAmount() {

  const type = document.getElementById("paymentType");
  const priceInput = document.getElementById("priceInput");
  const serviceInput = document.getElementById("serviceInput");

  if (!type || !priceInput || !serviceInput) return;

  const category = serviceInput.dataset.category || "other";

  const halfAllowed = (category === "web" || category === "business");

  priceInput.value =
    (type.value === "50% Deposit" && halfAllowed)
      ? "₦" + (selectedPrice / 2)
      : "₦" + selectedPrice;
}

/* =========================
   ORDER SYSTEM
========================= */

async function createOrder() {

  const name = document.getElementById("name")?.value;
  const phone = document.getElementById("phone")?.value;
  const service = document.getElementById("serviceInput")?.value;

  if (!name || !phone || !service) {
    alert("Fill all fields");
    return;
  }

  try {

    const res = await fetch(`${API}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        service,
        price: selectedPrice
      })
    });

    const data = await res.json();
    alert(data.message || "Order sent");

  } catch (err) {
    console.error(err);
    alert("Network error");
  }
}

/* =========================
   ADMIN LOGIN
========================= */

async function adminLogin() {

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  try {

    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login success");
      show("admin");
    } else {
      alert("Invalid login");
    }

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

/* =========================
   LOAD ORDERS
========================= */

async function loadOrders() {

  const token = localStorage.getItem("token");
  const box = document.getElementById("allOrders");

  if (!token || !box) return;

  try {

    const res = await fetch(`${API}/admin/orders`, {
      headers: { Authorization: token }
    });

    const orders = await res.json();

    box.innerHTML = "";

    if (!Array.isArray(orders)) {
      box.innerHTML = "<p>Error loading orders</p>";
      return;
    }

    orders.forEach(o => {
      box.innerHTML += `
        <div class="card">
          <p>${o.service}</p>
          <p>${o.name}</p>
          <p>${o.phone}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>Failed to load orders</p>";
  }
}
