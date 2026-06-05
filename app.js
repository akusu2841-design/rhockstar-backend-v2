// ===============================
// PRICE SYSTEM
// ===============================
const serviceSelect = document.getElementById("service");
const priceDisplay = document.getElementById("priceDisplay");

if (serviceSelect && priceDisplay) {
  serviceSelect.addEventListener("change", () => {
    const option = serviceSelect.options[serviceSelect.selectedIndex];
    const price = option.getAttribute("data-price");
    priceDisplay.textContent = price ? Number(price).toLocaleString() : "0";
  });
}

// ===============================
// ORDER FORM
// ===============================
const orderForm = document.getElementById("orderForm");

if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const option = serviceSelect.options[serviceSelect.selectedIndex];

    const order = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      service: option.textContent,
      price: option.getAttribute("data-price"),
      details: document.getElementById("details").value
    };

    await fetch("https://rhockstar-nation-1.onrender.com/api/orders/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    alert("Order submitted!");
    orderForm.reset();
    priceDisplay.textContent = "0";
  });
}

// ===============================
// GALLERY SYSTEM
// ===============================
async function openGallery(type) {
  const modal = document.getElementById("galleryModal");
  const container = document.getElementById("galleryImages");
  const title = document.getElementById("galleryTitle");

  if (!modal || !container || !title) return;

  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(
      `https://rhockstar-nation-1.onrender.com/api/portfolio/${type}`
    );

    const data = await res.json();

    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No projects yet</p>";
    }

    data.forEach(img => {
      const image = document.createElement("img");
      image.src = img;
      image.style.width = "100%";
      image.style.borderRadius = "10px";
      image.style.marginBottom = "10px";
      container.appendChild(image);
    });

    modal.style.display = "block";

  } catch (err) {
    container.innerHTML = "<p>Failed to load</p>";
    modal.style.display = "block";
  }
}

function closeGallery() {
  document.getElementById("galleryModal").style.display = "none";
}

window.onclick = (e) => {
  const modal = document.getElementById("galleryModal");
  if (e.target === modal) modal.style.display = "none";
};

// ===============================
// ADMIN LOGIN
// ===============================
async function login() {
  const res = await fetch("https://rhockstar-nation-1.onrender.com/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: document.getElementById("user").value,
      password: document.getElementById("pass").value
    })
  });

  if (!res.ok) return alert("Invalid login");

  const data = await res.json();
  localStorage.setItem("token", data.token);

  alert("Login successful");
}

// ===============================
// ADMIN ADD IMAGE
// ===============================
async function add() {
  const token = localStorage.getItem("token");

  if (!token) return alert("Login first");

  await fetch("https://rhockstar-nation-1.onrender.com/api/portfolio/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: document.getElementById("category").value,
      imageUrl: document.getElementById("imageUrl").value
    })
  });

  alert("Added successfully");
}

// ===============================
// ADMIN ORDERS
// ===============================
async function loadOrders() {
  const res = await fetch("https://rhockstar-nation-1.onrender.com/api/orders");
  const data = await res.json();

  const container = document.getElementById("orders");
  if (!container) return;

  container.innerHTML = "";

  data.reverse().forEach(o => {
    container.innerHTML += `
      <div class="card">
        <h3>${o.service}</h3>
        <p>${o.name}</p>
        <p>${o.phone}</p>
        <p>₦${o.price}</p>
      </div>
    `;
  });
}

if (document.getElementById("orders")) {
  loadOrders();
  setInterval(loadOrders, 5000);
      }
