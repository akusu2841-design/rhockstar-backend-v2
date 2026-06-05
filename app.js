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
