const API = "https://YOUR-RENDER-URL.onrender.com/api/orders";

// GET TOKEN (if using login system)
const token = localStorage.getItem("token");

async function loadOrders() {
  try {
    const res = await fetch(API, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    const orders = await res.json();

    const container = document.getElementById("orders");
    container.innerHTML = "";

    orders.forEach(order => {

      container.innerHTML += `
        <div class="order-card">
          <h3>${order.name}</h3>
          <p><b>Phone:</b> ${order.phone}</p>
          <p><b>Service:</b> ${order.service}</p>
          <p>${order.details}</p>

          <span class="status ${order.status.toLowerCase()}">
            ${order.status}
          </span>

          <br><br>

          <button onclick="updateStatus('${order._id}', 'Pending')">Pending</button>
          <button onclick="updateStatus('${order._id}', 'Processing')">Processing</button>
          <button onclick="updateStatus('${order._id}', 'Successful')">Success</button>

          <button onclick="deleteOrder('${order._id}')">Delete</button>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
    alert("Failed to load orders");
  }
}

// UPDATE STATUS
async function updateStatus(id, status) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

// DELETE ORDER
async function deleteOrder(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  loadOrders();
}

// AUTO LOAD
loadOrders();    method: "DELETE"
  });

  loadOrders();
}

// Auto load when page opens
if (window.location.pathname.includes("dashboard")) {
  loadOrders();
}
