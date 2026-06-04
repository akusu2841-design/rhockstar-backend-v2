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
