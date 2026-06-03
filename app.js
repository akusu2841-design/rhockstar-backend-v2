const API = "https://rhockstar-nation-1.onrender.com";

const email = document.getElementById("email");
const password = document.getElementById("password");

const nameInput = document.getElementById("name");
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const paymentType = document.getElementById("paymentType");

let selectedPrice = 0;

/* MENU */
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

/* CLOSE OVERLAY */
document.getElementById("overlay").onclick = () => {
  document.getElementById("navMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
};

/* PAGE SWITCH */
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.getElementById("navMenu").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");

  if (id === "admin") loadOrders();
}

/* SERVICE SELECT */
function selectService(service, price, category) {
  serviceInput.value = service;
  selectedPrice = price;
  serviceInput.dataset.category = category;
  updatePaymentAmount();
  show("dashboard");
}

/* PAYMENT */
function updatePaymentAmount() {
  if (!selectedPrice) return;

  const category = serviceInput.dataset.category;
  const half = (category === "web" || category === "business");

  priceInput.value =
    paymentType.value === "50% Deposit" && half
      ? "₦" + selectedPrice / 2
      : "₦" + selectedPrice;
}

/* ORDER */
async function createOrder() {
  if (!nameInput.value || !phone.value) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch(`${API}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      phone: phone.value,
      service: serviceInput.value,
      price: selectedPrice,
      description: desc.value
    })
  });

  const data = await res.json();
  alert(data.message);
}

/* ADMIN LOGIN */
async function adminLogin() {
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
    alert("Login success");
    show("admin");
  } else {
    alert("Invalid login");
  }
}

/* LOAD ORDERS */
async function loadOrders() {
  const token = localStorage.getItem("token");

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
