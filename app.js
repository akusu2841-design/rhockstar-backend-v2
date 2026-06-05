//
// ===============================
// PRICE SYSTEM (SAFE)
// ===============================
const serviceSelect = document.getElementById("service");
const priceDisplay = document.getElementById("priceDisplay");

if (serviceSelect && priceDisplay) {
  serviceSelect.addEventListener("change", () => {
    const option = serviceSelect.options[serviceSelect.selectedIndex];

    if (!option) return;

    const price = option.getAttribute("data-price");
    priceDisplay.textContent = price
      ? Number(price).toLocaleString()
      : "0";
  });
}

//
// ===============================
// ORDER FORM (BACKEND)
// ===============================
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const option =
      serviceSelect?.options[serviceSelect.selectedIndex];

    if (!option) return alert("Select a service");

    const order = {
      name: document.getElementById("name")?.value || "",
      phone: document.getElementById("phone")?.value || "",
      service: option.textContent,
      price: option.getAttribute("data-price"),
      details: document.getElementById("details")?.value || ""
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

      alert("Order submitted!");
      orderForm.reset();
      if (priceDisplay) priceDisplay.textContent = "0";
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  });
}

//
// ===============================
// GALLERY SYSTEM (SAFE)
// ===============================
async function openGallery(type) {
  const modal = document.getElementById("galleryModal");
  const container = document.getElementById("galleryImages");
  const title = document.getElementById("galleryTitle");

  if (!modal || !container || !title) return;

  container.innerHTML = "<p>Loading...</p>";
  modal.style.display = "block";

  try {
    const res = await fetch(
      `https://rhockstar-nation-1.onrender.com/api/portfolio/${type}`
    );

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();

    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No projects yet</p>";
      return;
    }

    data.forEach((img) => {
      const image = document.createElement("img");
      image.src = img;
      image.style.width = "100%";
      image.style.borderRadius
