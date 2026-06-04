// ===============================
// RHOCKSTAR NATION - APP.JS
// ===============================

// GET ELEMENTS
const serviceSelect = document.getElementById("service");
const priceDisplay = document.getElementById("priceDisplay");

const orderForm = document.getElementById("orderForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const detailsInput = document.getElementById("details");

// ===============================
// 1. LIVE PRICE UPDATE
// ===============================
serviceSelect.addEventListener("change", function () {
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const price = selectedOption.getAttribute("data-price");

  if (price) {
    priceDisplay.textContent = Number(price).toLocaleString();
  } else {
    priceDisplay.textContent = "0";
  }
});

// ===============================
// 2. FORM SUBMISSION
// ===============================
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const serviceName = selectedOption.value;
  const price = selectedOption.getAttribute("data-price");

  const name = nameInput.value;
  const phone = phoneInput.value;
  const details = detailsInput.value;

  if (!serviceName || !price) {
    alert("Please select a service");
    return;
  }

  // CREATE ORDER SUMMARY
  const order = {
    name: name,
    phone: phone,
    service: serviceName,
    price: Number(price),
    details: details,
    date: new Date().toLocaleString()
  };

  console.log("NEW ORDER:", order);

  // SIMPLE CONFIRMATION (you can replace later with WhatsApp or Firebase)
  alert(
    `Order Sent!\n\nService: ${serviceName}\nPrice: ₦${Number(price).toLocaleString()}`
  );

  // RESET FORM
  orderForm.reset();
  priceDisplay.textContent = "0";
});
// ===============================
// SERVICES PAGE LOGIC (NEW PAGE)
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

// OPEN MODAL WHEN CARD IS CLICKED
cards.forEach(card => {
  card.addEventListener("click", () => {

    const service = card.getAttribute("data-service");
    const price = card.getAttribute("data-price");

    selectedService.name = service;
    selectedService.price = price;

    m_service.value = service;
    m_price.value = "₦" + Number(price).toLocaleString();

    modal.style.display = "block";
  });
});

// CLOSE MODAL
function closeModal() {
  modal.style.display = "none";
}

// SUBMIT ORDER
function submitOrder() {

  const order = {
    service: selectedService.name,
    price: Number(selectedService.price),
    name: m_name.value,
    phone: m_phone.value,
    details: m_details.value
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

  m_name.value = "";
  m_phone.value = "";
  m_details.value = "";
  modal.style.display = "none";
}
