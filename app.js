const email = document.getElementById("email");
const password = document.getElementById("password");

const name = document.getElementById("name");
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const paymentType = document.getElementById("paymentType"); // ✅ ONLY ONCE

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

if(nav) nav.classList.toggle("active");
if(overlay) overlay.classList.toggle("active");
}

/* =========================
   PAGE SYSTEM
========================= */
function show(id){

document.querySelectorAll(".page").forEach(page=>{
page.style.display = "none";
});

const page = document.getElementById(id);

if(page){
page.style.display = "block";
}

document.getElementById("navMenu")?.classList.remove("active");
document.getElementById("overlay")?.classList.remove("active");
}

/* =========================
   AUTH
========================= */
function register(){
auth.createUserWithEmailAndPassword(email.value.trim(), password.value)
.catch(err=>alert(err.message));
}

function login(){
auth.signInWithEmailAndPassword(email.value.trim(), password.value)
.catch(err=>alert(err.message));
}

function logout(){
auth.signOut().catch(err=>alert(err.message));
}

/* =========================
   SERVICE SELECT
========================= */
function selectService(service, price){

serviceInput.value = service;
selectedPrice = price;

updatePaymentAmount();

show("dashboard");
}

/* =========================
   PAYMENT CALC
========================= */
function updatePaymentAmount(){

if(!selectedPrice) return;
if(!paymentType) return;

if(paymentType.value === "50% Deposit"){
priceInput.value = "₦" + (selectedPrice / 2);
}else{
priceInput.value = "₦" + selectedPrice;
}

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

const amountDue =
paymentType.value === "50% Deposit"
? selectedPrice / 2
: selectedPrice;

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value.trim(),
phone: phone.value.trim(),
service: serviceInput.value,
price: selectedPrice,
amountDue: amountDue,
paymentType: paymentType.value,
desc: desc.value.trim(),
status: "Pending",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
})
.then(()=>{

alert("Order submitted");

name.value = "";
phone.value = "";
desc.value = "";

})
.catch(err=>{
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
.onSnapshot(snapshot=>{

myOrders.innerHTML = "";

snapshot.forEach(doc=>{
const o = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${o.service || ""}</b>
<p>₦${o.amountDue || o.price || 0}</p>
<p>Status: ${o.status || "Pending"}</p>
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
<p><b>Payment:</b> ${o.paymentType || "Full Payment"}</p>
<p><b>Status:</b> ${o.status || "Pending"}</p>

<button onclick="updateStatus('${id}','Pending')">Pending</button>
<button onclick="updateStatus('${id}','Processing')">Processing</button>
<button onclick="updateStatus('${id}','Successful')">Successful</button>
<button onclick="deleteOrder('${id}')">Delete</button>

</div>
`;
});

}, err=>{
console.error(err);
if(allOrders){
allOrders.innerHTML = "<div class='card'>Unable to load orders</div>";
}
});

}

/* =========================
   STATUS UPDATE
========================= */
function updateStatus(id, status){

db.collection("orders").doc(id).update({
status: status
})
.catch(err=>alert(err.message));

}

/* =========================
   DELETE ORDER
========================= */
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
