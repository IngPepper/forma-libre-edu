import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "./firebase";

// Registrar usuario (solo Auth)
export function registerWithEmail(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Iniciar sesión
export function loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Cerrar sesión
export async function logout() {
    await signOut(auth);
}

/**
 * Elimina el usuario autenticado en Firebase Auth.
 */
export async function deleteCurrentAuthUser() {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    await auth.currentUser.delete();
}

/**
 * Reautentica al usuario actual con email y password.
 * @param {string} password
 */
export async function reauthenticate(password) {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
}