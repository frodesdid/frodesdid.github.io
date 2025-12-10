// Инициализация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyArRRQtb0Jb5PBITLvXIQwpo9GXjZn5a9Q",
  authDomain: "frodes-messenger.firebaseapp.com",
  projectId: "frodes-messenger",
  storageBucket: "frodes-messenger.firebasestorage.app",
  messagingSenderId: "744957500144",
  appId: "1:744957500144:web:3f60e6fda36aa326be8035"
};

// Инициализируем Firebase
firebase.initializeApp(firebaseConfig);

// Инициализируем сервисы
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Настройки Firestore
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const increment = firebase.firestore.FieldValue.increment;

console.log("Firebase инициализирован!");
