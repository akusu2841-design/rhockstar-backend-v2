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
   MENU
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
page.classList.remove("active");
});

const target = document.getElementById(id);

if(target){
target.classList.add("active");
}

/* close mobile menu */
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
function selectService(service, price, category){

serviceInput.value = service;
selectedPrice = price;

// store category safely
serviceInput.dataset.category = category || "other";

updatePaymentAmount();

show("dashboard");
}

/* =========================
   PAYMENT LOGIC (FIXED)
========================= */
function updatePaymentAmount(){

if(!selectedPrice) return;

const category = serviceInput.dataset.category || "other";

// ONLY web + business allow deposit
const allowDeposit = (category === "web" || category === "business");

if(paymentType.value === "50% Deposit" && allowDeposit){
priceInput.value = "₦" + (selectedPrice / 2);
}else{
priceInput.value = "₦" + selectedPrice;
}
}
/* =========================
   PAYSTACK PAYMENT
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


function createOrder(){
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

/* =========================
   NORMALIZE STATUS (IMPORTANT FIX)
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
<p><b>Payment:</b> ${o.paymentType || "Full"}</p>

<p>
<b>Status:</b>
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

}, err=>{
console.error(err);
allOrders.innerHTML = "<div class='card'>Unable to load orders</div>";
});
}

/* =========================
   STATUS UPDATE
========================= */
function updateStatus(id, status){
db.collection("orders").doc(id).update({
status
}).catch(err=>alert(err.message));
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
