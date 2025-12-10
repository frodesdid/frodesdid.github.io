const firebaseConfig = {
  apiKey: "AIzaSyArRRQtb0Jb5PBITLvXIQwpo9GXjZn5a9Q",
  authDomain: "frodes-messenger.firebaseapp.com",
  projectId: "frodes-messenger",
  storageBucket: "frodes-messenger.firebasestorage.app",
  messagingSenderId: "744957500144",
  appId: "1:744957500144:web:3f60e6fda36aa326be8035"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
console.log("Firebase готов!");
