const API = "https://your-render-backend.com"; // change later

function selectService(name, price){
document.getElementById("service").value = name;
document.getElementById("price").value = price;
window.location.href="#orders";
}

function openWhatsApp(){
window.location.href="https://wa.me/2348074647269";
}

function toggleMenu(){
document.getElementById("nav").classList.toggle("show");
}

document.getElementById("orderForm").addEventListener("submit", async (e)=>{
e.preventDefault();

document.getElementById("loading").classList.remove("hidden");

const data = {
name: document.getElementById("name").value,
phone: document.getElementById("phone").value,
service: document.getElementById("service").value,
price: document.getElementById("price").value,
description: document.getElementById("description").value,
paymentType: document.getElementById("paymentType").value
};

try{

const res = await fetch(`${API}/order`,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
});

const result = await res.json();
alert("Order placed successfully");

}catch(err){
alert("Error placing order");
}

document.getElementById("loading").classList.add("hidden");

});
