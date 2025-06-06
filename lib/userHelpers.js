import { doc, setDoc, getDoc, updateDoc  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * Crea o actualiza el perfil de usuario en Firestore.
 * @param {object} user - Objeto de usuario de Firebase Auth (currentUser).
 * @param {object} extraData - Datos extra (opcional).
 */
export async function createUserProfile(user, extraData = {}) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
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
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}


/**
 * Llamar a ese helper en el submit.
 */
export async function updateUserProfileInFirestore(uid, data) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data); // Solo actualiza los campos dados
}

// Cambia el displayName en Firebase Auth
export async function updateFirebaseDisplayName(newName) {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
    await updateProfile(auth.currentUser, { displayName: newName });
}

