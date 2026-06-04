const API_BASE = "https://your-render-backend-url.com"; 
// 👆 REPLACE THIS with your real Render backend URL

let selectedService = null;
let selectedPrice = 0;
let selectedType = "";

/* ================= SERVICE SELECT ================= */
function selectService(name, price, type){

selectedService = name;
selectedPrice = price;
selectedType = type;

// fill form
document.getElementById("service").value = name;
document.getElementById("price").value = price;

// scroll to order form
document.getElementById("order").scrollIntoView({behavior:"smooth"});
}

/* ================= PAYMENT LOGIC ================= */
document.getElementById("paymentType").addEventListener("change", function(){

let priceField = document.getElementById("price");

if(selectedType === "web" || selectedType === "business"){

if(this.value === "deposit"){
priceField.value = selectedPrice / 2;
} else {
priceField.value = selectedPrice;
}

}
});

/* ================= FORM SUBMIT ================= */
document.getElementById("orderForm").addEventListener("submit", async function(e){
e.preventDefault();

const loading = document.getElementById("loading");
loading.classList.remove("hidden");

const orderData = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
service: document.getElementById("service").value,
price: document.getElementById("price").value,
paymentType: document.getElementById("paymentType").value,
description: document.getElementById("desc").value,
date: new Date()
};

try{

const res = await fetch(`${API_BASE}/order`, {
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify(orderData)
});

const data = await res.json();

loading.classList.add("hidden");

if(res.ok){
alert("Order placed successfully 🚀");

// reset form
document.getElementById("orderForm").reset();
selectedService = null;

} else {
alert(data.message || "Error placing order");
}

}catch(err){
loading.classList.add("hidden");
alert("Network error. Try again.");
}

});

/* ================= LOAD ORDERS (USER - OPTIONAL) ================= */
async function loadMyOrders(phone){

try{

const res = await fetch(`${API_BASE}/orders/${phone}`);
const data = await res.json();

console.log("My Orders:", data);

}catch(err){
console.log("Error loading orders");
}

}

/* ================= ADMIN LOGIN ================= */
async function adminLogin(email, password){

try{

const res = await fetch(`${API_BASE}/admin/login`, {
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({email, password})
});

const data = await res.json();

if(res.ok){
localStorage.setItem("adminToken", data.token);
alert("Login successful");
} else {
alert(data.message);
}

}catch(err){
alert("Login error");
}

}

/* ================= ADMIN FETCH ORDERS ================= */
async function fetchAdminOrders(){

const token = localStorage.getItem("adminToken");

try{

const res = await fetch(`${API_BASE}/admin/orders`, {
headers:{
"Authorization": token
}
});

const data = await res.json();
console.log("All Orders:", data);

}catch(err){
console.log("Error fetching admin orders");
}

}
