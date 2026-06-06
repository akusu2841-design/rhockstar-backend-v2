const orders = JSON.parse(localStorage.getItem("orders")) || [];

const container = document.getElementById("ordersContainer");

const currentUser = localStorage.getItem("userEmail");

// if not logged in
if(!currentUser){
  container.innerHTML = "<p>Please login to view your orders.</p>";
}

const userOrders = orders.filter(order => order.email === currentUser);

function renderOrders(){

  container.innerHTML = "";

  if(userOrders.length === 0){
    container.innerHTML = "<p>You have no orders yet.</p>";
    return;
  }

  userOrders.forEach(order => {

    container.innerHTML += `
      <div class="order-card">

        <div class="order-top">
          <strong>${order.service}</strong>
          <span class="status ${order.status.replace(" ", "")}">
            ${order.status}
          </span>
        </div>

        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Price:</b> ₦${order.price}</p>

      </div>
    `;
  });
}

renderOrders();
