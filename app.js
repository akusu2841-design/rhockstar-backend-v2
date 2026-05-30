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

/* MENU */
function toggleMenu(){
document.getElementById("navMenu").classList.toggle("active");
document.getElementById("overlay").classList.toggle("active");
}

/* PAGE SWITCH */
function show(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

/* AUTH */
function register(){
auth.createUserWithEmailAndPassword(email.value,password.value)
.catch(e=>alert(e.message));
}

function login(){
auth.signInWithEmailAndPassword(email.value,password.value)
.catch(e=>alert(e.message));
}

/* SERVICE */
function selectService(service,price){
serviceInput.value = service;
priceInput.value = "₦"+price;
selectedPrice = price;
show("dashboard");
}

/* CREATE ORDER */
function createOrder(){

if(!auth.currentUser){
alert("Login first");
return;
}

db.collection("orders").add({
userId:auth.currentUser.uid,
name:name.value,
phone:phone.value,
service:serviceInput.value,
price:selectedPrice,
desc:desc.value,
status:"Pending",
createdAt:firebase.firestore.FieldValue.serverTimestamp()
});

alert("Order sent");
}

/* MY ORDERS */
function loadMyOrders(){

if(!auth.currentUser) return;

db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.onSnapshot(snap=>{

myOrders.innerHTML="";

snap.forEach(doc=>{
let o=doc.data();

myOrders.innerHTML+=`
<div class="card">
<b>${o.service}</b>
<p>₦${o.price}</p>
<p>${o.status}</p>
</div>`;
});
});
}

/* ADMIN */
function loadAllOrders(){

db.collection("orders")
.onSnapshot(snap=>{

allOrders.innerHTML="";

snap.forEach(doc=>{
let o=doc.data();
let id=doc.id;

allOrders.innerHTML+=`
<div class="card">

<h3>${o.service}</h3>
<p>${o.name}</p>
<p>${o.phone}</p>
<p>₦${o.price}</p>
<p>${o.status}</p>

<button onclick="updateStatus('${id}','Pending')">Pending</button>
<button onclick="updateStatus('${id}','Processing')">Processing</button>
<button onclick="updateStatus('${id}','Successful')">Done</button>
<button onclick="deleteOrder('${id}')">Delete</button>

</div>`;
});
});
}

/* STATUS */
function updateStatus(id,status){
db.collection("orders").doc(id).update({status});
}

function deleteOrder(id){
db.collection("orders").doc(id).delete();
}

/* AUTH STATE */
auth.onAuthStateChanged(user=>{

if(!user){
show("home");
adminBtn.style.display="none";
return;
}

show("services");
loadMyOrders();
loadAllOrders();

if(user.email==="admin@rhockstar.com"){
adminBtn.style.display="block";
}else{
adminBtn.style.display="none";
}
});
