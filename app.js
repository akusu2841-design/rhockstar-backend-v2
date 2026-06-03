const API = "https://rhockstar-nation-1.onrender.com";

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

window.addEventListener("DOMContentLoaded", loadNews);

/* SAFE INIT */
window.addEventListener("DOMContentLoaded", () => {

  document.getElementById("overlay").onclick = closeMenu;

});

/* MENU */
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

function closeMenu() {
  document.getElementById("navMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

/* PAGE SWITCH */
function show(id) {

  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const page = document.getElementById(id);

  if (!page) {
    console.error("Missing page:", id);
    return;
  }

  page.classList.add("active");

  closeMenu();

  if (id === "admin") {
    loadOrders();
  }
}

/* SERVICE */
let selectedPrice = 0;

function selectService(service, price, category) {

  document.getElementById("serviceInput").value = service;
  selectedPrice = price;

  const input = document.getElementById("serviceInput");
  input.dataset.category = category || "other";

  updatePaymentAmount();
  show("dashboard");
}

/* PAYMENT */
function updatePaymentAmount() {

  const type = document.getElementById("paymentType").value;
  const priceInput = document.getElementById("priceInput");

  const category = document.getElementById("serviceInput").dataset.category;

  const halfAllowed = (category === "web" || category === "business");

  priceInput.value =
    (type === "50% Deposit" && halfAllowed)
      ? "₦" + selectedPrice / 2
      : "₦" + selectedPrice;
}

/* ORDER */
async function createOrder() {

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
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
        service: document.getElementById("serviceInput").value,
        price: selectedPrice
      })
    });

    const data = await res.json();
    alert(data.message || "Order sent");

  } catch (err) {
    alert("Network error");
  }
}

/* ADMIN LOGIN */
async function adminLogin() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
    alert("Login error");
  }
}

/* LOAD ORDERS */
async function loadOrders() {

  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await fetch(`${API}/admin/orders`, {
    headers: { Authorization: token }
  });

  const orders = await res.json();

  const box = document.getElementById("allOrders");
  box.innerHTML = "";

  orders.forEach(o => {
    box.innerHTML += `
      <div class="card">
        <p>${o.service}</p>
        <p>${o.name}</p>
        <p>${o.phone}</p>
      </div>
    `;
  });
}
