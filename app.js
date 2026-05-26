
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

/* PAGE SYSTEM */
function show(id){
document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

const page = document.getElementById(id);
if(page) page.classList.add("active");
}

/* AUTH */
function register(){
auth.createUserWithEmailAndPassword(email.value, password.value)
.then(()=> alert("Account created"))
.catch(e=> alert(e.message));
}

function login(){
auth.signInWithEmailAndPassword(email.value, password.value)
.then(()=> alert("Login successful"))
.catch(e=> alert(e.message));
}

/* SELECT SERVICE */
function selectService(service, price){
serviceInput.value = service;
priceInput.value = "₦" + price;
selectedPrice = price;

show("dashboard");
}

/* CREATE ORDER */
function createOrder(){

if(!auth.currentUser){
alert("Please login first");
return;
}

if(!serviceInput.value || !selectedPrice){
alert("Select a service first");
return;
}

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value || "Anonymous",
phone: phone.value || "N/A",
service: serviceInput.value,
price: selectedPrice,
desc: desc.value || "",
status: "Pending",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

alert("Order submitted successfully");

desc.value = "";
}

/* USER ORDERS */
function loadMyOrders(){

if(!auth.currentUser) return;

db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.orderBy("createdAt","desc")
.onSnapshot(snap=>{

myOrders.innerHTML = "";

snap.forEach(doc=>{
const o = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${o.service}</b><br>
₦${o.price}<br>

<span class="status ${o.status.toLowerCase().replace(" ","-")}">
${o.status}
</span>

</div>
`;
});

});
}

/* ADMIN ORDERS */
function loadAllOrders(){

db.collection("orders")
.orderBy("createdAt","desc")
.onSnapshot(snap=>{

allOrders.innerHTML = "";

snap.forEach(doc=>{
const o = doc.data();
const id = doc.id;

allOrders.innerHTML += `
<div class="card">

<b>${o.name}</b><br>
${o.service}<br>
₦${o.price}<br>

<span class="status ${o.status.toLowerCase().replace(" ","-")}">
${o.status}
</span>

<br><br>

<button onclick="updateStatus('${id}','Pending')">Pending</button>
<button onclick="updateStatus('${id}','In Progress')">In Progress</button>
<button onclick="updateStatus('${id}','Done')">Done</button>
<button onclick="deleteOrder('${id}')">Delete</button>

</div>
`;
});

});
}

/* UPDATE ORDER STATUS */
function updateStatus(id, status){
db.collection("orders").doc(id).update({
status: status
});
}

/* DELETE ORDER */
function deleteOrder(id){
if(confirm("Delete this order?")){
db.collection("orders").doc(id).delete();
}
}

/* AUTH STATE */
auth.onAuthStateChanged(user=>{

if(user){

show("services");

/* create user profile */
db.collection("users").doc(user.uid).set({
email: user.email,
role: user.email === "admin@rhockstar.com" ? "admin" : "user",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
},{merge:true});

/* load orders */
loadMyOrders();

if(user.email === "admin@rhockstar.com"){
loadAllOrders();
}

}else{
show("home");
}

});
