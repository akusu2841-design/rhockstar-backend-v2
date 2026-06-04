document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("orderForm");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
function selectService(service, price) {
  console.log("Clicked:", service, price);

  document.getElementById("orderModal").style.display = "flex";

  document.getElementById("m_service").value = service;
  document.getElementById("m_price").value = "₦" + price;
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

function submitOrder() {
  alert("Order system working (backend connect next)");
}
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const details = document.getElementById("details").value.trim();

    // Basic validation
    if (!name || !phone || !service) {
      alert("Please fill all required fields");
      return;
    }

    // 👉 THIS WILL LATER CONNECT TO BACKEND
    const orderData = {
      name,
      phone,
      service,
      details,
      status: "Pending"
    };

    console.log("ORDER READY FOR BACKEND:", orderData);

    // TEMP RESPONSE (until backend is connected)
    alert("Order submitted successfully! (Backend not connected yet)");

    form.reset();
  });

});
