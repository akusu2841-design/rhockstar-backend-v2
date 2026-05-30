const email = document.getElementById("email");
const password = document.getElementById("password");

const name = document.getElementById("name");
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const myOrders = document.getElementById("myOrders");
const allOrders = document.getElementById("allOrders");
const adminBtn = document.getElementById("adminBtn");

let selectedPrice = 0;

let myOrdersUnsub = null;
let allOrdersUnsub = null;

/* =========================
   MOBILE MENU
========================= */
function toggleMenu(){
const nav = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");

nav.classList.toggle("active");
overlay.classList.toggle("active");
}

/* =========================
   FIXED PAGE SYSTEM (NO DUPLICATES)
========================= */
function show(id){

document.querySelectorAll(".page").forEach(p=>{
p.style.display = "none";
});

const page = document.getElementById(id);
if(page){
page.style.display = "block";
}

/* close mobile nav automatically */
document.getElementById("navMenu")?.classList.remove("active");
document.getElementById("overlay")?.classList.remove("active");
}

/* =========================
   AUTH
========================= */
function register(){
auth.createUserWithEmailAndPassword(email.value.trim(), password.value)
.catch(e=>alert(e.message));
}

function login(){
auth.signInWithEmailAndPassword(email.value.trim(), password.value)
.catch(e=>alert(e.message));
}

function logout(){
auth.signOut().catch(e=>alert(e.message));
}

/* =========================
   SERVICE SELECT
========================= */
function selectService(service, price){
serviceInput.value = service;
priceInput.value = "₦" + price;
selectedPrice = price;
show("dashboard");
}

/* =========================
   CREATE ORDER
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

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value.trim(),
phone: phone.value.trim(),
service: serviceInput.value,
price: selectedPrice,
desc: desc.value.trim(),
status: "Pending",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
}).then(()=>{

alert("Order submitted");

name.value = "";
phone.value = "";
desc.value = "";

}).catch(err=>{
alert(err.message);
});
}

/* =========================
   USER ORDERS
========================= */
function loadMyOrders(){

if(myOrdersUnsub) myOrdersUnsub();
if(!auth.currentUser) return;

myOrdersUnsub = db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.onSnapshot(snap=>{

myOrders.innerHTML = "";

snap.forEach(doc=>{
const o = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${o.service || ""}</b>
<p>₦${o.price || 0}</p>
<p>Status: ${o.status || "Pending"}</p>
</div>
`;
});

});
}

/* =========================
   ADMIN ORDERS (FIXED + STABLE)
========================= */
function loadAllOrders(){

if(allOrdersUnsub) allOrdersUnsub();

allOrdersUnsub = db.collection("orders")
.orderBy("createdAt","desc")
.onSnapshot(
snap=>{

allOrders.innerHTML = "";

if(snap.empty){
allOrders.innerHTML = "<p>No orders found.</p>";
return;
}

snap.forEach(doc=>{
const o = doc.data();
const id = doc.id;

allOrders.innerHTML += `
<div class="card">

<h3>${o.service || ""}</h3>

<p><b>Name:</b> ${o.name || ""}</p>
<p><b>Phone:</b> ${o.phone || ""}</p>
<p><b>Price:</b> ₦${o.price || 0}</
