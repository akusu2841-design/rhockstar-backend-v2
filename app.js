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

/* HIDE ADMIN BUTTON FIRST */
if(adminBtn){
adminBtn.style.display = "none";
}

/* PAGE SYSTEM */
function show(id){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

const page = document.getElementById(id);

if(page){
page.classList.add("active");
}

}

/* REGISTER */
function register(){

auth.createUserWithEmailAndPassword(
email.value,
password.value
)

.then(()=>{
alert("Account created successfully");
})

.catch(error=>{
alert(error.message);
});

}

/* LOGIN */
function login(){

auth.signInWithEmailAndPassword(
email.value,
password.value
)

.then(()=>{
alert("Login successful");
})

.catch(error=>{
alert(error.message);
});

}

/* LOGOUT */
function logout(){

auth.signOut()

.then(()=>{
alert("Logged out successfully");
})

.catch(error=>{
alert(error.message);
});

}

/* SELECT SERVICE */
function selectService(service, price){

serviceInput.value = service;

priceInput.value = "₦" + price;

selectedPrice = price;

show("dashboard");

}

async function createOrder(){

if(!auth.currentUser){
alert("Please login first");
return;
}

/* REQUIRED FIELDS */
if(
!name.value.trim() ||
!phone.value.trim() ||
!desc.value.trim()
){
alert("Please fill all fields");
return;
}

/* SERVICE CHECK */
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

alert("Order submitted successfully");

/* CLEAR FORM */
name.value = "";
phone.value = "";
desc.value = "";

}catch(error){

alert(error.message);

}


/* CLEAR FORM */
name.value = "";
phone.value = "";
desc.value = "";

}catch(error){

alert(error.message);

}

}

/* LOAD USER ORDERS */
function loadMyOrders(){

if(!auth.currentUser) return;

db.collection("orders")

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

/* LOAD ADMIN ORDERS */
function loadAllOrders(){

db.collection("orders")
.orderBy("createdAt","desc")
.onSnapshot(snapshot=>{

allOrders.innerHTML = "";

snapshot.forEach(doc=>{

const order = doc.data();
const id = doc.id;

allOrders.innerHTML += `

<div class="card admin-card">

<h3>${order.service}</h3>

<p><b>Customer:</b> ${order.name}</p>

<p><b>Phone:</b> ${order.phone}</p>

<p><b>Price:</b> ₦${order.price}</p>

<p><b>Description:</b><br>${order.desc}</p>

<p>
<b>Status:</b>

<span class="status ${order.status.toLowerCase().replace(/ /g,'-')}">
${order.status}
</span>
</p>

<div class="admin-actions">

<button onclick="updateStatus('${id}','Pending')">
Pending
</button>

<button onclick="updateStatus('${id}','Processing')">
Processing
</button>

<button onclick="updateStatus('${id}','Successful')">
Successful
</button>

<button onclick="deleteOrder('${id}')">
Delete
</button>

</div>

</div>

`;

});

});

}

/* UPDATE STATUS */
function updateStatus(id, status){

db.collection("orders").doc(id).update({
status: status
})

.catch(error=>{
alert(error.message);
});

}

/* DELETE ORDER */
function deleteOrder(id){

if(confirm("Delete this order?")){

db.collection("orders").doc(id).delete()

.catch(error=>{
alert(error.message);
});

}

}

/* AUTH STATE */
auth.onAuthStateChanged(async user=>{

if(user){

show("services");

const userRef = db.collection("users").doc(user.uid);

const userSnap = await userRef.get();

/* CREATE USER PROFILE */
if(!userSnap.exists){

let role = "user";

if(user.email === "admin@rhockstar.com"){
role = "admin";
}

await userRef.set({

email: user.email,

role: role,

createdAt: firebase.firestore.FieldValue.serverTimestamp()

});

}

/* LOAD USER ORDERS */
loadMyOrders();

/* CHECK ROLE */
const currentUser = await userRef.get();

const userData = currentUser.data();

/* ADMIN ACCESS */
if(userData.role === "admin"){

if(adminBtn){
adminBtn.style.display = "block";
}

loadAllOrders();

}

}else{

show("home");

if(adminBtn){
adminBtn.style.display = "none";
}

}

});
