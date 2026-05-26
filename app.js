
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
let ordersListener = null;
let adminListener = null;

/* PAGE SWITCH (SMOOTH + SAFE) */
function show(id){

document.querySelectorAll('.page').forEach(page=>{
page.classList.remove('active');
page.style.opacity = 0;
});

const target = document.getElementById(id);

if(!target) return;

target.classList.add('active');
setTimeout(()=> target.style.opacity = 1, 50);

}

/* REGISTER */
function register(){

if(!email.value || !password.value){
alert("Fill in email and password");
return;
}

auth.createUserWithEmailAndPassword(email.value, password.value)
.then(()=>{
alert("Registered successfully");
})
.catch(e=>{
alert(e.message);
});

}

/* LOGIN */
function login(){

if(!email.value || !password.value){
alert("Fill in email and password");
return;
}

auth.signInWithEmailAndPassword(email.value, password.value)
.then(()=>{
alert("Login successful");
})
.catch(e=>{
alert(e.message);
});

}

/* SELECT SERVICE */
function selectService(service, price){

serviceInput.value = service;
priceInput.value = "₦" + price;
selectedPrice = price;

show('dashboard');

}

/* CREATE ORDER */
function createOrder(){

if(!auth.currentUser){
alert("Login first");
return;
}

if(!serviceInput.value || !selectedPrice){
alert("Select a service first");
return;
}

db.collection("orders").add({
userId: auth.currentUser.uid,
name: name.value || "No name",
phone: phone.value || "No phone",
service: serviceInput.value,
price: selectedPrice,
desc: desc.value || "",
status: "Pending",
createdAt: new Date()
})
.then(()=>{
alert("Order created successfully");

/* clear fields */
desc.value = "";

});

}

/* LOAD USER ORDERS (FIX DUPLICATE LISTENERS) */
function loadMyOrders(){

if(!auth.currentUser) return;

/* prevent multiple listeners */
if(ordersListener) ordersListener();

ordersListener = db.collection("orders")
.where("userId","==",auth.currentUser.uid)
.onSnapshot(snapshot=>{

myOrders.innerHTML = "";

snapshot.forEach(doc=>{

let order = doc.data();

myOrders.innerHTML += `
<div class="card">
<b>${order.service}</b><br>
₦${order.price}<br>
Status: ${order.status}
</div>
`;

});

});

}

/* LOAD ALL ORDERS (ADMIN ONLY, FIX LISTENER) */
function loadAllOrders(){

if(adminListener) adminListener();

adminListener = db.collection("orders")
.onSnapshot(snapshot=>{

allOrders.innerHTML = "";

snapshot.forEach(doc=>{

let order = doc.data();

allOrders.innerHTML += `
<div class="card">
<b>${order.name}</b><br>
${order.service}<br>
₦${order.price}<br>
Status: ${order.status}
</div>
`;

});

});

}

/* AUTH STATE */
auth.onAuthStateChanged(user=>{

if(user){

show('services');

/* create/update user profile */
db.collection("users").doc(user.uid).set({
email:user.email,
role:user.email==="admin@rhockstar.com" ? "admin" : "user"
},{merge:true});

/* LOAD ORDERS */
loadMyOrders();

/* ADMIN CHECK */
if(user.email==="admin@rhockstar.com"){
loadAllOrders();
}

}else{

show('home');

}

});
