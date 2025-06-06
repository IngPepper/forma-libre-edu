// /lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Pega aquí tus datos de configuración (de la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyCONuQxiY0ECElA2ZbC0AS_xFVb2FuqSm0",
    authDomain: "formalibre-7c32c.firebaseapp.com",
    projectId: "formalibre-7c32c",
    storageBucket: "formalibre-7c32c.firebasestorage.app",
    messagingSenderId: "1078953419174",
    appId: "1:1078953419174:web:6ace9364375c55d665af67",
    measurementId: "G-9WG893E977"
};

// Para evitar inicializar dos veces en Next.js:
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };