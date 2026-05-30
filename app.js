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

/* NAV */
function toggleMenu(){
const nav = document.getElementById("navMenu");
if(nav) nav.classList.toggle("active");
}

/* PAGE SYSTEM */
function show(id){
document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

const page = document.getElementById(id);
if(page) page.classList.add("active");
}

/* REGISTER */
function register(){
auth.createUserWithEmailAndPassword(email.value, password.value)
.then(()=> alert("Account created"))
.catch(e=> alert(e.message));
}

/* LOGIN */
function login(){
auth.signInWithEmailAndPassword(email.value, password.value)
.then(()=> alert("Login successful"))
.catch(e=> alert(e.message));
}

/* LOGOUT */
function logout(){
auth.signOut()
.then(()=> alert("Logged out"))
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
async function createOrder(){

if(!auth.currentUser){
alert("Please login first");
return;
}

if(!name.value.trim() || !phone.value.trim() || !desc.value.trim()){
alert("Fill all fields");
return;
}

if(!serviceInput.value || !selectedPrice){
alert("Select a service first");
return;
}

try{
await db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value.trim(),
phone: phone.value.trim(),
service: serviceInput.value,
price: selectedPrice,
desc: desc.value.trim(),
status: "Pending",
createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

alert("Order submitted");

name.value = "";
phone.value = "";
desc.value = "";

}catch(err){
alert(err.message);
}
}

/* USER ORDERS */
function loadMyOrders(){

if(myOrdersUnsub) myOrdersUnsub();

if(!auth.currentUser) return;

myOrdersUnsub = db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.orderBy("createdAt","desc")
.onSnapshot(snapshot=>{

myOrders.innerHTML = "";

snapshot.forEach(doc=>{
const o = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${o.service}</b><br>
₦${o.price}<br>

<span class="status ${o.status.toLowerCase().replace(/ /g,'-')}">
${o.status}
</span>
</div>
`;
});

});

}

/* ADMIN ORDERS */
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
<div class="card admin-card">

<h3>${o.service}</h3>

<p><b>Name:</b> ${o.name}</p>
<p><b>Phone:</b> ${o.phone}</p>
<p><b>Price:</b> ₦${o.price}</p>
<p><b>Description:</b> ${o.desc}</p>

<p>
<b>Status:</b>
<span class="status ${o.status.toLowerCase().replace(/ /g,'-')}">
${o.status}
</span>
</p>

<button onclick="updateStatus('${id}','Pending')">Pending</button>
<button onclick="updateStatus('${id}','Processing')">Processing</button>
<button onclick="updateStatus('${id}','Successful')">Successful</button>
<button onclick="deleteOrder('${id}')">Delete</button>

</div>
`;
});

});

}

/* UPDATE STATUS */
function updateStatus(id, status){
db.collection("orders").doc(id).update({ status })
.catch(err=> alert(err.message));
}

/* DELETE ORDER */
function deleteOrder(id){
if(confirm("Delete this order?")){
db.collection("orders").doc(id).delete()
.catch(err=> alert(err.message));
}
}

/* AUTH STATE */
auth.onAuthStateChanged(async user=>{

if(!user){
show("home");
if(adminBtn) adminBtn.style.display = "none";
return;
}

const userRef = db.collection("users").doc(user.uid);
const snap = await userRef.get();

let role = "user";

if(!snap.exists){
role = (user.email === "admin@rhockstar.com") ? "admin" : "user";

await userRef.set({
email: user.email,
role: role,
createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
}else{
role = snap.data().role;
}

show("services");

loadMyOrders();

if(role === "admin"){
if(adminBtn) adminBtn.style.display = "block";
loadAllOrders();
}else{
if(adminBtn) adminBtn.style.display = "none";
}

});
