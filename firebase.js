const firebaseConfig = {
  apiKey: "AIzaSyCKdJaHy_FUSFbnUkTCm3p7p32sM1E5r7w",
  authDomain: "rhockstar-nation.firebaseapp.com",
  projectId: "rhockstar-nation",
  storageBucket: "rhockstar-nation.appspot.com",
  messagingSenderId: "707658422879",
  appId: "1:707658422879:web:55ee3ff4f8365d81a999ea"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
