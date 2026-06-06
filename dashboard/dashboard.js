const token =
localStorage.getItem(
"adminToken"
);

if(!token){
location.href =
"admin.html";
}

async function loadOrders(){

const res =
await fetch(
"https://rhockstar-nation-1.onrender.com/orders",
{
headers:{
Authorization: token
}
}
);

const orders =
await res.json();

const container =
document.getElementById(
"orders"
);

container.innerHTML = "";

orders.forEach(order => {

container.innerHTML += `
<div class="card">

<h3>${order.name}</h3>

<p>
${order.phone}
</p>

<p>
${order.service}
</p>

<p>
${order.details}
</p>

<p>
Status:
<strong>
${order.status}
</strong>
</p>

<select
onchange="
updateStatus(
${order.id},
this.value
)
">

<option>
Pending
</option>

<option>
Accepted
</option>

<option>
In Progress
</option>

<option>
Completed
</option>

<option>
Cancelled
</option>

</select>

</div>
`;

});

}

async function updateStatus(
id,
status
){

await fetch(
`https://rhockstar-nation-1.onrender.com/orders/${id}`,
{
method:"PUT",
headers:{
"Content-Type":
"application/json",
Authorization:
token
},
body:JSON.stringify({
status
})
}
);

loadOrders();

}

loadOrders();
