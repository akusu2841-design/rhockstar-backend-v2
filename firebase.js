const firebaseConfig = {
  apiKey: "AIzaSyCKdJaHy_FUSFbnUkTCm3p7p32sM1E5r7w",
  authDomain: "rhockstar-nation.firebaseapp.com",
  projectId: "rhockstar-nation",
  storageBucket: "rhockstar-nation.firebasestorage.app",
  messagingSenderId: "707658422879",
  appId: "1:707658422879:web:467e0785561454aca999ea"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase Connected");
