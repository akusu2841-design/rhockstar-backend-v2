document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("orderForm");
  const select = document.getElementById("service");

  const modal = document.getElementById("orderModal");
  const mService = document.getElementById("m_service");
  const mPrice = document.getElementById("m_price");

  // =========================
  // SELECT CHANGE → OPEN MODAL
  // =========================
  if (select) {
    select.addEventListener("change", function () {

      const selectedOption = this.options[this.selectedIndex];

      const service = selectedOption.value;
      const price = selectedOption.getAttribute("data-price");

      if (!service || !price) return;

      console.log("SELECTED:", service, price);

      mService.value = service;
      mPrice.value = "₦" + price;

      modal.style.display = "flex";
    });
  }

  // =========================
  // CLOSE MODAL
  // =========================
  window.closeModal = function () {
    modal.style.display = "none";
  };

  // =========================
  // SUBMIT ORDER (HOME PAGE FORM)
  // =========================
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const order = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        service: select.value,
        price: mPrice.value,
        details: document.getElementById("details").value,
        status: "Pending"
      };

      console.log("ORDER:", order);

      alert("Order submitted successfully!");

      form.reset();
      closeModal();
    });
  }

  // =========================
  // SUBMIT FROM MODAL (OPTIONAL)
  // =========================
  window.submitOrder = function () {
    alert("Order confirmed!");

    closeModal();
  };

});
