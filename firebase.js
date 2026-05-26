
const email = document.getElementById("email");
const password = document.getElementById("password");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const serviceInput = document.getElementById("serviceInput");
const priceInput = document.getElementById("priceInput");
const desc = document.getElementById("desc");

const myOrders = document.getElementById("myOrders");
const allOrders = document.getElementById("allOrders");

let selectedPrice = 0;

/* NAV */
function show(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

/* AUTH */
function register(){
auth.createUserWithEmailAndPassword(email.value,password.value)
.then(()=>alert("Registered"))
.catch(e=>alert(e.message));
}

function login(){
auth.signInWithEmailAndPassword(email.value,password.value)
.then(()=>alert("Login successful"))
.catch(e=>alert(e.message));
}

/* SELECT SERVICE */
function selectService(service,price){
serviceInput.value = service;
priceInput.value = "₦"+price;
selectedPrice = price;
show('dashboard');
}

/* CREATE ORDER */
function createOrder(){

if(!auth.currentUser){
alert("Login first");
return;
}

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value || "No name",
phone: phone.value || "No phone",
service: serviceInput.value,
price: selectedPrice,
desc: desc.value,
status: "Pending",
createdAt: new Date()
});

alert("Order placed");
}

/* USER ORDERS */
function loadMyOrders(){

if(!auth.currentUser) return;

db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.onSnapshot(snap=>{

myOrders.innerHTML="";

snap.forEach(doc=>{
let o = doc.data();
let id = doc.id;

myOrders.innerHTML += `
<div class="card">
<b>${o.service}</b><br>
₦${o.price}<br>

<span class="status ${o.status.toLowerCase()}">
${o.status}
</span>

</div>
`;
});

});
}

/* ADMIN LOAD */
function loadAllOrders(){

db.collection("orders")
.orderBy("createdAt","desc")
.onSnapshot(snap=>{

allOrders.innerHTML="";

snap.forEach(doc=>{
let o = doc.data();
let id = doc.id;

allOrders.innerHTML += `
<div class="card">

<b>${o.name}</b><br>
${o.service}<br>
₦${o.price}<br>

<span class="status ${o.status.toLowerCase()}">
${o.status}
</span>

<br><br>

<button onclick="updateStatus('${id}','Pending')">Pending</button>
<button onclick="updateStatus('${id}','In Progress')">Progress</button>
<button onclick="updateStatus('${id}','Done')">Done</button>
<button onclick="deleteOrder('${id}')">Delete</button>

</div>
`;
});

});
}

/* UPDATE STATUS */
function updateStatus(id,status){
db.collection("orders").doc(id).update({
status: status
});
}

/* DELETE ORDER */
function deleteOrder(id){
db.collection("orders").doc(id).delete();
}

/* AUTH STATE */
auth.onAuthStateChanged(user=>{

if(user){

show('services');

db.collection("users").doc(user.uid).set({
email:user.email,
role:user.email==="admin@rhockstar.com" ? "admin":"user"
},{merge:true});

loadMyOrders();

if(user.email==="admin@rhockstar.com"){
loadAllOrders();
}

}else{
show('home');
}

});
