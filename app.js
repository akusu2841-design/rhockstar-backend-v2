// ===============================
// OPEN ORDER MODAL (CLICK FIX)
// ===============================
function openOrder(el) {
  document.getElementById("m_service").value =
    el.getAttribute("data-service");

  document.getElementById("m_price").value =
    "₦" + Number(el.getAttribute("data-price")).toLocaleString();

  document.getElementById("orderModal").style.display = "block";
}

// ===============================
function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

// ===============================
// SUBMIT ORDER (BACKEND)
// ===============================
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

    closeModal();

  } catch (err) {
    console.error(err);
    alert("Server error. Try again later.");
  }
}

// ===============================
// CLOSE MODAL ON OUTSIDE CLICK
// ===============================
window.onclick = function (e) {
  const modal = document.getElementById("orderModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};
