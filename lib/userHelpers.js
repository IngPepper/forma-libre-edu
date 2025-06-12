import { doc, setDoc, getDoc, updateDoc, deleteDoc  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Cambia aquí para definir UNA SOLA colección de usuarios
const USERS_COLLECTION = "users"; // O "usuarios", ¡pero sé consistente!

/**
 * Crea o actualiza el perfil de usuario en Firestore.
 * @param {object} user - Objeto de usuario de Firebase Auth (currentUser).
 * @param {object} extraData - Datos extra (opcional).
 */
export async function createUserProfile(user, extraData = {}) {
    if (!user) return;
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
}

/**
 * Obtiene el perfil del usuario desde Firestore.
 * @param {string} uid - El UID del usuario.
 * @returns {object|null} Los datos del usuario o null si no existe.
 */
export async function getUserProfile(uid) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}

/**
 * Actualiza el perfil de usuario en Firestore.
 * @param {string} uid - El UID del usuario.
 * @param {object} data - Los campos a actualizar.
 */
export async function updateUserProfileInFirestore(uid, data) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, data); // Solo actualiza los campos dados
}

/**
 * Cambia el displayName en Firebase Auth.
 * @param {string} newName - El nuevo nombre de usuario.
 */
export async function updateFirebaseDisplayName(newName) {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    await updateProfile(auth.currentUser, { displayName: newName });
}

/**
 * Marca la membresía como cancelada (en el perfil Firestore).
 * Usa setDoc({merge:true}) para crear si no existe.
 * @param {string} uid - El UID del usuario.
 */
export async function cancelarMembresia(uid) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
        membresia: "cancelada",
        fechaCancelacion: new Date().toISOString(),
    }, { merge: true });
}

/**
 * Borra el documento del usuario en Firestore.
 * @param {string} uid - El UID del usuario.
 */
export async function deleteUserProfile(uid) {
    const userRef = doc(db, "users", uid); // Asegúrate que es la colección correcta
    await deleteDoc(userRef);
}