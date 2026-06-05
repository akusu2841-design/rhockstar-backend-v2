
/* =========================
   ADMIN ACCESS (UI ONLY)
========================= */
const ADMIN_KEY = "Brue199$";

function openAdmin() {
  const key = prompt("Enter Admin Password:");

  if (key === ADMIN_KEY) {
    show("admin");
    loadAllOrders();
  } else {
    alert("Access Denied");
  }
}

/* =========================
   ORDER FORM SUBMIT
========================= */
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    service: document.getElementById("service").value,
    details: document.getElementById("details").value.trim()
  };

  try {
    const res = await fetch("https://rhockstar-nation-1.onrender.com/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Order submitted successfully!");
      e.target.reset();
      localStorage.removeItem("selectedService");
    } else {
      alert("Failed to submit");
    }

  } catch (err) {
    alert("Network error");
  }
});

/* =========================
   SERVICE CLICK → SAVE
========================= */
document.querySelectorAll(".service-link").forEach(link => {
  link.addEventListener("click", () => {
    const selected = link.getAttribute("data-service");
    localStorage.setItem("selectedService", selected);
  });
});

/* =========================
   AUTO FILL SERVICE
========================= */
window.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("service");
  const saved = localStorage.getItem("selectedService");

  if (select && saved) {
    select.value = saved;
    localStorage.removeItem("selectedService");
  }
});

/* =========================
   HAMBURGER MENU
========================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}
