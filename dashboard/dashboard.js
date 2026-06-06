const orders = JSON.parse(localStorage.getItem("orders")) || [];
const container = document.getElementById("ordersContainer");

const currentUser = localStorage.getItem("userEmail");

const userOrders = orders.filter(o => o.email === currentUser);

// add header info
const header = document.createElement("p");
header.innerHTML = `You have <b>${userOrders.length}</b> order(s)`;
header.style.marginBottom = "15px";
document.querySelector(".dashboard").insertBefore(header, container);

function render(){

  container.innerHTML = "";

  userOrders.forEach(order => {

    container.innerHTML += `
      <div class="order-card">

        <div class="order-top">
          <strong>${order.service}</strong>
          <span class="status ${order.status.replace(" ","")}">
            ${order.status}
          </span>
        </div>

        <p>Order ID: ${order.id}</p>
        <p>Price: ₦${order.price}</p>

      </div>
    `;
  });
}

render();
@media (max-width:768px){

  .dashboard{
    margin:20px auto;
    padding:10px;
  }

  #ordersContainer{
    grid-template-columns:1fr;
  }

  .order-card{
    padding:12px;
  }

  h2{
    font-size:22px;
    text-align:center;
  }
}
