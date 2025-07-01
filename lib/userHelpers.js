import { doc, setDoc, getDoc, updateDoc, deleteDoc  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { mapFirebaseError } from "@/components/(utilities)/mapFirebaseError";

// Cambia aquí para definir UNA SOLA colección de usuarios
const USERS_COLLECTION = "users"; // O "usuarios", ¡pero sé consistente!

export async function createUserProfile(user, extraData = {}) {
    if (!user) return;
    try {
        const userRef = doc(db, USERS_COLLECTION, user.uid);
        await setDoc(userRef, {
            email: user.email,
            nombre: user.displayName || extraData.nombre || "",
            miembroDesde: new Date().toISOString(),
            membresia: "free",
            rol: "user",
            facturas: [],
            ...extraData,
        }, { merge: true });
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

export async function updateUserProfileInFirestore(uid, data) {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(userRef, data);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

export async function updateFirebaseDisplayName(newName) {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    try {
        await updateProfile(auth.currentUser, { displayName: newName });
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

export async function cancelarMembresia(uid) {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await setDoc(userRef, {
            membresia: "cancelada",
            fechaCancelacion: new Date().toISOString(),
        }, { merge: true });
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

export async function deleteUserProfile(uid) {
    try {
        const userRef = doc(db, USERS_COLLECTION, uid);
        await deleteDoc(userRef);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}