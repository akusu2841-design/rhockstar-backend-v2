document.getElementById("orderForm").addEventListener("submit", function(e){
e.preventDefault();

alert("Order received! Backend will be connected next.");

this.reset();
});
