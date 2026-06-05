// ===============================
// RHOCKSTAR NATION - APP.JS (FIXED)
// ===============================

// SAFE ELEMENT GETTER
const serviceSelect = document.getElementById("service");
const priceDisplay = document.getElementById("priceDisplay");

const orderForm = document.getElementById("orderForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const detailsInput = document.getElementById("details");

// ===============================
// 1. LIVE PRICE UPDATE (HOME PAGE)
// ===============================
if (serviceSelect && priceDisplay) {
  serviceSelect.addEventListener("change", function () {

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const price = selectedOption.getAttribute("data-price");

    priceDisplay.textContent = price
      ? Number(price).toLocaleString()
      : "0";
  });
}

// ===============================
// 2. ORDER FORM SUBMISSION (HOME PAGE)
// ===============================
if (orderForm) {
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

    if (!selectedOption || !selectedOption.getAttribute("data-price")) {
      alert("Please select a service");
      return;
    }

    const serviceName = selectedOption.textContent;
    const price = selectedOption.getAttribute("data-price");

    const order = {
      name: nameInput.value,
      phone: phoneInput.value,
      service: serviceName,
      price: Number(price),
      details: detailsInput.value,
      date: new Date().toLocaleString()
    };

    console.log("NEW ORDER:", order);

    alert(
      `Order Sent!\n\nService: ${serviceName}\nPrice: ₦${Number(price).toLocaleString()}`
    );

    orderForm.reset();
    if (priceDisplay) priceDisplay.textContent = "0";
  });
}

// ===============================
// 3. SERVICES PAGE LOGIC (MODAL)
// ===============================

const cards = document.querySelectorAll(".card");
const modal = document.getElementById("orderModal");

const m_service = document.getElementById("m_service");
const m_price = document.getElementById("m_price");
const m_name = document.getElementById("m_name");
const m_phone = document.getElementById("m_phone");
const m_details = document.getElementById("m_details");

let selectedService = {
  name: "",
  price: 0
};

// ONLY RUN IF MODAL EXISTS
if (modal) {

  cards.forEach(card => {
    card.addEventListener("click", () => {

      const service = card.getAttribute("data-service");
      const price = card.getAttribute("data-price");

      if (!service || !price) return;

      selectedService.name = service;
      selectedService.price = price;

      if (m_service) m_service.value = service;
      if (m_price) m_price.value = "₦" + Number(price).toLocaleString();

      modal.style.display = "block";
    });
  });

  // CLOSE MODAL
  window.closeModal = function () {
    modal.style.display = "none";
  };

  // SUBMIT ORDER
  window.submitOrder = function () {

    const order = {
      service: selectedService.name,
      price: Number(selectedService.price),
      name: m_name?.value || "",
      phone: m_phone?.value || "",
      details: m_details?.value || "",
      date: new Date().toLocaleString()
    };

    fetch("https://YOUR-BACKEND-URL/api/orders/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(data => {
      alert("Order submitted successfully!");
      console.log(data);
    })
    .catch(err => {
      alert("Error submitting order");
      console.log(err);
    });

    if (m_name) m_name.value = "";
    if (m_phone) m_phone.value = "";
    if (m_details) m_details.value = "";

    modal.style.display = "none";
  };
      }
async function loadAdminOrders() {
  try {
    const res = await fetch("https://rhockstar-nation-1.onrender.com");
    const data = await res.json();

    const container = document.getElementById("orders");
    if (!container) return;

    container.innerHTML = "";

    data.reverse().forEach(o => {
      container.innerHTML += `
        <div class="card">
          <h3>${o.service}</h3>
          <p><b>Name:</b> ${o.name}</p>
          <p><b>Phone:</b> ${o.phone}</p>
          <p><b>Price:</b> ₦${o.price}</p>
          <p>${o.details}</p>
          <small>${o.date}</small>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
  }
}

async function loadAdminNews() {
  try {
    const res = await fetch("https://YOUR-BACKEND-URL/api/news");
    const data = await res.json();

    const container = document.getElementById("news");
    if (!container) return;

    container.innerHTML = "";

    data.reverse().forEach(n => {
      container.innerHTML += `
        <div class="card news-card">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          <small>${n.date}</small>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
  }
}

// ONLY RUN ON ADMIN PAGE
if (document.getElementById("orders")) {
  loadAdminOrders();
  setInterval(loadAdminOrders, 5000);
}

if (document.getElementById("news")) {
  loadAdminNews();
  setInterval(loadAdminNews, 5000);
                   }
