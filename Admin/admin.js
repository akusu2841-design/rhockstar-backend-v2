async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://YOUR-BACKEND-URL/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Invalid login";
  }
}
async function loadOrders() {
  const res = await fetch("https://YOUR-BACKEND-URL/api/orders");
  const orders = await res.json();

  const container = document.getElementById("orders");

  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="card">
        <h3>${order.name}</h3>
        <p>${order.phone}</p>
        <p>${order.service}</p>
        <p>${order.description}</p>
        <p>Status: <b>${order.status}</b></p>

        <button onclick="updateStatus('${order._id}', 'Pending')">Pending</button>
        <button onclick="updateStatus('${order._id}', 'Processing')">Processing</button>
        <button onclick="updateStatus('${order._id}', 'Successful')">Success</button>

        <button onclick="deleteOrder('${order._id}')">Delete</button>
      </div>
    `;
  });
}

async function updateStatus(id, status) {
  await fetch(`https://YOUR-BACKEND-URL/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

async function deleteOrder(id) {
  await fetch(`https://YOUR-BACKEND-URL/api/orders/${id}`, {
    method: "DELETE"
  });

  loadOrders();
}

// Auto load when page opens
if (window.location.pathname.includes("dashboard")) {
  loadOrders();
}
