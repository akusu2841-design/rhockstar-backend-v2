let orders = JSON.parse(localStorage.getItem("orders")) || [];

const container = document.getElementById("adminOrders");

function saveOrders(){
  localStorage.setItem("orders", JSON.stringify(orders));
}

function updateStatus(id, newStatus){

  orders = orders.map(order => {
    if(order.id === id){
      return { ...order, status: newStatus };
    }
    return order;
  });

  saveOrders();        // 🔥 IMPORTANT LINE
  renderOrders();      // re-render after saving
}

function renderOrders(){

  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="order-card">
        <h3>${order.service}</h3>

        <p>${order.email}</p>
        <p>${order.id}</p>

        <p><b>Status:</b> ${order.status}</p>

        <select onchange="updateStatus('${order.id}', this.value)">
          <option>Pending</option>
          <option>Accepted</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
    `;
  });
}

renderOrders();
