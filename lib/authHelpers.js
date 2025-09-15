// /lib/authHelpers.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Registrar usuario
export const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Iniciar sesión
export const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Cerrar sesión
export async function logout() {
    await signOut(auth);
}
