const ADMIN_KEY = "Brue199$";

/* =========================
   ADMIN ACCESS
========================= */
function openAdmin(){

const key = prompt("Enter Admin Password:");

if(key === ADMIN_KEY){
show("admin");
loadAllOrders(); // your admin fetch function
}else{
alert("Access Denied");
}

}

/* =========================
   ORDER FORM SUBMIT
========================= */
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const service = document.getElementById("service");
  const details = document.getElementById("details");

  const data = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    service: service.value,
    details: details.value.trim()
  };

  try {
    const res = await fetch("https://rhockstar-nation-1.onrender.com/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Order submitted successfully!");
      e.target.reset();
      localStorage.removeItem("selectedService");
    } else {
      alert("Failed to submit");
    }

  } catch (err) {
    alert("Network error");
  }
});


/* =========================
   SERVICE AUTO FILL
========================= */
const links = document.querySelectorAll(".service-link");

links.forEach(link => {
  link.addEventListener("click", () => {
    const selected = link.getAttribute("data-service");
    localStorage.setItem("selectedService", selected);
  });
});


window.addEventListener("DOMContentLoaded", () => {
  const service = document.getElementById("service");
  const saved = localStorage.getItem("selectedService");

  if (service && saved) {
    service.value = saved;
  }
});
