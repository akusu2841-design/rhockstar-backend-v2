document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("orderModal");

  const mService = document.getElementById("m_service");
  const mPrice = document.getElementById("m_price");

  // =========================
  // CLICK SERVICE CARDS
  // =========================
  document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", function () {

      const service = this.getAttribute("data-service");
      const price = this.getAttribute("data-price");

      if (!service || !price) return;

      console.log("CLICKED:", service, price);

      modal.style.display = "flex";

      mService.value = service;
      mPrice.value = "₦" + price;

    });

  });

  // =========================
  // CLOSE MODAL
  // =========================
  window.closeModal = function () {
    modal.style.display = "none";
  };

  // =========================
  // SUBMIT ORDER
  // =========================
  window.submitOrder = function () {

    const order = {
      name: document.getElementById("m_name").value,
      phone: document.getElementById("m_phone").value,
      service: mService.value,
      price: mPrice.value,
      details: document.getElementById("m_details").value,
      status: "Pending"
    };

    console.log("ORDER:", order);

    alert("Order submitted successfully!");

    closeModal();
  };

});
