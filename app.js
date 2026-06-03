const API = "https://rhockstar-nation-1.onrender.com";
/* =========================
   DOM ELEMENTS
========================= */

const email = document.getElementById("email");
const password = document.getElementById("password");

const name = document.getElementById("name");
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const paymentType = document.getElementById("paymentType");

const myOrders = document.getElementById("myOrders");
const allOrders = document.getElementById("allOrders");
const adminBtn = document.getElementById("adminBtn");

let selectedPrice = 0;

let myOrdersUnsub = null;
let allOrdersUnsub = null;

const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxxx";

/* =========================
   MENU TOGGLE
========================= */

function toggleMenu(){
const nav = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");

nav?.classList.toggle("active");
overlay?.classList.toggle("active");
}



async function createOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const service = document.getElementById("serviceInput").value;
  const price = document.getElementById("priceInput").value;
  const description = document.getElementById("desc").value;

  const res = await fetch(`${API}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      phone,
      service,
      price,
      description
    })
  });

  const data = await res.json();
  alert(data.message);
       }


/* =========================
   PAGE SWITCH (FIXED)
========================= */

function show(id){

document.querySelectorAll(".page").forEach(page=>{
page.classList.remove("active");
});

const target = document.getElementById(id);
if(target) target.classList.add("active");

// close menu
document.getElementById("navMenu")?.classList.remove("active");
document.getElementById("overlay")?.classList.remove("active");
}

/* =========================
   AUTH
========================= */

function register(){
auth.createUserWithEmailAndPassword(
email.value.trim(),
password.value
).catch(err=>alert(err.message));
}

function login(){
auth.signInWithEmailAndPassword(
email.value.trim(),
password.value
).catch(err=>alert(err.message));
}

function logout(){
auth.signOut().catch(err=>alert(err.message));
}

/* =========================
   SERVICE SELECT
========================= */

function selectService(service, price, category){

serviceInput.value = service;
selectedPrice = price;
serviceInput.dataset.category = category || "other";

updatePaymentAmount();

show("dashboard");
}

/* =========================
   PAYMENT CALC
========================= */

function updatePaymentAmount(){

if(!selectedPrice) return;

const category = serviceInput.dataset.category || "other";
const allowDeposit = (category === "web" || category === "business");

if(paymentType.value === "50% Deposit" && allowDeposit){
priceInput.value = "₦" + (selectedPrice / 2);
}else{
priceInput.value = "₦" + selectedPrice;
}
}

/* =========================
   PAYSTACK
========================= */

function payWithPaystack(amount, callback){

if(!auth.currentUser){
alert("Please login first");
return;
}

let handler = PaystackPop.setup({
key: PAYSTACK_PUBLIC_KEY,
email: auth.currentUser.email,
amount: amount * 100,
currency: "NGN",

callback: function(response){
callback(response.reference);
},

onClose: function(){
alert("Payment cancelled");
}
});

handler.openIframe();
}

/* =========================
   CREATE ORDER (FIXED)
========================= */

function createOrder(){

if(!auth.currentUser){
alert("Please login first");
return;
}

if(!name.value.trim() || !phone.value.trim() || !serviceInput.value){
alert("Fill all required fields");
return;
}

const category = serviceInput.dataset.category || "other";
const allowDeposit = (category === "web" || category === "business");

const amountDue =
(paymentType.value === "50% Deposit" && allowDeposit)
? selectedPrice / 2
: selectedPrice;

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value.trim(),
phone: phone.value.trim(),
service: serviceInput.value,
price: selectedPrice,
amountDue,
paymentType: paymentType.value,
category,
desc: desc.value.trim(),
status: "pending",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
})
.then(()=>{

alert("Order submitted");

name.value = "";
phone.value = "";
desc.value = "";

})
.catch(err=>alert(err.message));
}

/*===============================
   ADMIN LOGIN
==========================*/
async function adminLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Admin login successful");

    document.getElementById("adminBtn").style.display = "block";
  } else {
    alert("Login failed");
  }
}

/*=======================
LOAD ADMIN ORDERS
======================*/
async function loadOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/admin/orders`, {
    headers: {
      Authorization: token
    }
  });

  const orders = await res.json();

  const container = document.getElementById("allOrders");
  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="card">
        <h3>${order.name}</h3>
        <p>${order.service}</p>
        <p>${order.price}</p>
        <p>${order.description}</p>
        <small>${order.status}</small>
      </div>
    `;
  });
}


/* =========================
   STATUS HELPERS
========================= */

function normalizeStatus(status){
return (status || "pending").toLowerCase();
}

function statusClass(status){
const s = normalizeStatus(status);

if(s === "processing") return "processing";
if(s === "successful") return "successful";
return "pending";
}

/* =========================
   MY ORDERS
========================= */

function loadMyOrders(){

if(myOrdersUnsub) myOrdersUnsub();
if(!auth.currentUser) return;

myOrdersUnsub = db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.onSnapshot(snapshot=>{

myOrders.innerHTML = "";

snapshot.forEach(doc=>{
const o = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${o.service || ""}</b>
<p>₦${o.amountDue || o.price || 0}</p>

<p>
Status:
<span class="status ${statusClass(o.status)}">
${o.status || "pending"}
</span>
</p>
</div>
`;
});

});
}

/* =========================
   ADMIN ORDERS
========================= */

function loadAllOrders(){

if(allOrdersUnsub) allOrdersUnsub();

allOrdersUnsub = db.collection("orders")
.orderBy("createdAt","desc")
.onSnapshot(snapshot=>{

allOrders.innerHTML = "";

snapshot.forEach(doc=>{
const o = doc.data();
const id = doc.id;

allOrders.innerHTML += `
<div class="card">

<h3>${o.service || ""}</h3>
<p><b>Name:</b> ${o.name || ""}</p>
<p><b>Phone:</b> ${o.phone || ""}</p>
<p><b>Price:</b> ₦${o.price || 0}</p>
<p><b>Amount Due:</b> ₦${o.amountDue || 0}</p>
<p><b>Status:</b>
<span class="status ${statusClass(o.status)}">
${o.status || "pending"}
</span>
</p>

<button class="btn-pending" onclick="updateStatus('${id}','pending')">Pending</button>
<button class="btn-processing" onclick="updateStatus('${id}','processing')">Processing</button>
<button class="btn-successful" onclick="updateStatus('${id}','successful')">Successful</button>
<button class="btn-delete" onclick="deleteOrder('${id}')">Delete</button>

</div>
`;
});

});
}

/* =========================
   ADMIN ACTIONS
========================= */

function updateStatus(id, status){
db.collection("orders").doc(id).update({
status
}).catch(err=>alert(err.message));
}

function deleteOrder(id){
if(!confirm("Delete this order?")) return;

db.collection("orders").doc(id).delete()
.catch(err=>alert(err.message));
}

/* =========================
   AUTH STATE
========================= */

auth.onAuthStateChanged(user=>{

if(!user){
show("home");
if(adminBtn) adminBtn.style.display = "none";
return;
}

show("services");
loadMyOrders();

if(user.email === "admin@rhockstar.com"){
adminBtn.style.display = "block";
loadAllOrders();
}else{
adminBtn.style.display = "none";
}

});
