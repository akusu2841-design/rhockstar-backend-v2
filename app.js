// OPEN MODAL
document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", function () {

    const card = this.closest(".card");

    document.getElementById("m_service").value =
      card.dataset.service;

    document.getElementById("m_price").value =
      "₦" + Number(card.dataset.price).toLocaleString();

    document.getElementById("orderModal").style.display = "block";
  });
});

// CLOSE MODAL
function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

// CLOSE OUTSIDE CLICK
window.onclick = function (e) {
  const modal = document.getElementById("orderModal");
  if (e.target === modal) modal.style.display = "none";
};

// SUBMIT ORDER TO BACKEND
async function submitOrder() {

  const order = {
    service: document.getElementById("m_service").value,
    price: document.getElementById("m_price").value,
    name: document.getElementById("m_name").value,
    phone: document.getElementById("m_phone").value,
    details: document.getElementById("m_details").value
  };

  try {
    const res = await fetch(
      "https://rhockstar-nation-1.onrender.com/api/orders/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      }
    );

    if (!res.ok) throw new Error("Failed");

    alert("Order submitted successfully!");
    document.getElementById("orderModal").style.display = "none";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}
