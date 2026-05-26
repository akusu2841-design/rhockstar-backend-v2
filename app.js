function register(){

auth.createUserWithEmailAndPassword(
email.value,
password.value
)

.then(()=>{
alert("Registered");
})

.catch(e=>{
alert(e.message);
});

}

function login(){

auth.signInWithEmailAndPassword(
email.value,
password.value
)

.then(()=>{
alert("Login successful");
})

.catch(e=>{
alert(e.message);
});

}
