document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value,
    phone: phone.value,
    service: service.value,
    details: details.value
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
    } else {
      alert("Failed to submit");
    }

  } catch (err) {
    alert("Network error");
  }
});
// Auto-fill service from clicked service card
const links = document.querySelectorAll(".service-link");

links.forEach(link => {
  link.addEventListener("click", () => {
    const selected = link.getAttribute("data-service");

    // store in localStorage
    localStorage.setItem("selectedService", selected);
  });
});

// When homepage loads, auto fill dropdown
window.addEventListener("DOMContentLoaded", () => {
  const service = document.getElementById("service");
  const saved = localStorage.getItem("selectedService");

  if (service && saved) {
    service.value = saved;
  }
});
