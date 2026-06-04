document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("orderForm");

  // =========================
  // CLICK SERVICE FUNCTION
  // =========================
  window.selectService = function(service, price) {
    console.log("Clicked:", service, price);

    const modal = document.getElementById("orderModal");
    if (modal) {
      modal.style.display = "flex";
    }

    const mService = document.getElementById("m_service");
    const mPrice = document.getElementById("m_price");

    if (mService) mService.value = service;
    if (mPrice) mPrice.value = "₦" + price;
  };

  // =========================
  // CLOSE MODAL
  // =========================
  window.closeModal = function() {
    const modal = document.getElementById("orderModal");
    if (modal) {
      modal.style.display = "none";
    }
  };

  // =========================
  // SUBMIT ORDER (FORM PAGE)
  // =========================
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value;
      const details = document.getElementById("details").value.trim();

      if (!name || !phone || !service) {
        alert("Please fill all required fields");
        return;
      }

      const orderData = {
        name,
        phone,
        service,
        details,
        status: "Pending"
      };

      console.log("ORDER READY:", orderData);

      alert("Order submitted successfully!");

      form.reset();
    });
  }

});
