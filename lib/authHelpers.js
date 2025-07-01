import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";
import { auth, db  } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { mapFirebaseError } from "@/components/(utilities)/mapFirebaseError";

// Registrar usuario (Auth) y asignar displayName
export async function registerWithEmail(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName: name });
            await auth.currentUser.reload();
        }
        return userCredential.user;
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

// Iniciar sesión
export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

// Cerrar sesión
export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Elimina el usuario autenticado en Firebase Auth y su perfil en Firestore.
 */
export async function deleteCurrentAuthUser() {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    const uid = auth.currentUser.uid;
    try {
        // 1. Elimina perfil extendido en Firestore
        try {
            await deleteDoc(doc(db, "users", uid));
        } catch (err) {
            // No detiene la ejecución, solo loguea el error
            console.error("No se pudo borrar perfil extendido:", err);
        }
        // 2. Elimina usuario en Auth
        await auth.currentUser.delete();
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Reautentica al usuario actual con email y password.
 * @param {string} password
 */
export async function reauthenticate(password) {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}
