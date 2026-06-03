const API = "https://rhockstar-nation-1.onrender.com";

/* =========================
   DOM ELEMENTS
========================= */

const email = document.getElementById("email");
const password = document.getElementById("password");

const fullName = document.getElementById("name"); // FIXED (was "name")
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const paymentType = document.getElementById("paymentType");

const allOrders = document.getElementById("allOrders");
const adminBtn = document.getElementById("adminBtn");

let selectedPrice = 0;

/* =========================
   MENU TOGGLE
========================= */

function toggleMenu() {
  const nav = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  nav?.classList.toggle("active");
  overlay?.classList.toggle("active");
}

/* =========================
   PAGE SWITCH
========================= */

function show(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  document.getElementById("navMenu")?.classList.remove("active");
  document.getElementById("overlay")?.classList.remove("active");

  if (id === "admin") {
    loadOrders();
  }
}

/* =========================
   SERVICE SELECT
========================= */

function selectService(service, price, category) {
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
  if (!selectedPrice) return;

  const category = serviceInput.dataset.category || "other";
  const allowDeposit = (category === "web" || category === "business");

  if (paymentType.value === "50% Deposit" && allowDeposit) {
    priceInput.value = "₦" + (selectedPrice / 2);
  } else {
    priceInput.value = "₦" + selectedPrice;
  }
}

/* =========================
   CREATE ORDER
========================= */

async function createOrder() {
  if (!email.value || !password.value) {
    alert("Please login first");
    return;
  }

  if (!fullName.value.trim() || !phone.value.trim() || !serviceInput.value) {
    alert("Fill all required fields");
    return;
  }

  const category = serviceInput.dataset.category || "other";

  const amountDue =
    (paymentType.value === "50% Deposit" &&
      (category === "web" || category === "business"))
      ? selectedPrice / 2
      : selectedPrice;

  try {
    const res = await fetch(`${API}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName.value.trim(),
        phone: phone.value.trim(),
        service: serviceInput.value,
        price: selectedPrice,
        amountDue,
        paymentType: paymentType.value,
        category,
        description: desc.value.trim()
      })
    });

    const data = await res.json();
    alert(data.message || "Order submitted");

    fullName.value = "";
    phone.value = "";
    desc.value = "";
    serviceInput.value = "";
    priceInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Error submitting order");
  }
}

/* =========================
   ADMIN LOGIN (FIXED)
========================= */

async function adminLogin() {
  try {
    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Admin login successful");
      adminBtn.style.display = "block";
      show("admin");
      loadOrders();
    } else {
      alert("Invalid login");
    }

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

/* =========================
   LOAD ADMIN ORDERS
========================= */

async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No admin token found");
    return;
  }

  try {
    const res = await fetch(`${API}/admin/orders`, {
      headers: { Authorization: token }
    });

    const orders = await res.json();

    allOrders.innerHTML = "";

    if (!Array.isArray(orders)) {
      allOrders.innerHTML = "<p>Error loading orders</p>";
      return;
    }

    orders.forEach(order => {
      allOrders.innerHTML += `
        <div class="card">
          <h3>${order.service}</h3>
          <p><b>Name:</b> ${order.name}</p>
          <p><b>Phone:</b> ${order.phone}</p>
          <p><b>Price:</b> ₦${order.price}</p>
          <p><b>Amount Due:</b> ₦${order.amountDue}</p>
          <p><b>Status:</b> ${order.status}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    allOrders.innerHTML = "<p>Failed to load orders</p>";
  }
}

/* =========================
   AUTO ADMIN BUTTON
========================= */

window.onload = () => {
  const token = localStorage.getItem("token");
  if (token) {
    adminBtn.style.display = "block";
  }
};
