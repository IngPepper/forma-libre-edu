import { db } from "./firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    writeBatch
} from "firebase/firestore";

/**
 * Obtener todos los planos de la colección "planos"
 */
export async function obtenerPlanos() {
    const col = collection(db, "planos");
    const snap = await getDocs(col);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Obtener un plano por su id de Firestore
 */
export async function obtenerPlanoPorId(id) {
    const ref = doc(db, "planos", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

/**
 * Agregar un nuevo plano a la colección
 */
export async function agregarPlano(plano) {
    const col = collection(db, "planos");
    const docRef = await addDoc(col, plano);
    const nuevo = await getDoc(docRef);
    return { id: docRef.id, ...nuevo.data() };
}

/**
 * Editar/actualizar un plano existente
 */
export async function editarPlano(id, data) {
    const docRef = doc(db, "planos", id);
    const docData = { ...data, id }; // 🔥 incluye el id explícitamente
    await setDoc(docRef, docData, { merge: true });
    return docData;
}

/**
 * Eliminar un plano por id
 */
export async function eliminarPlano(id) {
    // Forzamos id a string
    const ref = doc(db, "planos", String(id));
    await deleteDoc(ref);
    return id;
}

/**
 * Importar múltiples planos (array) en batch (opcional)
 */
export async function importarPlanos(planosArr) {
    const col = collection(db, "planos");
    const batch = writeBatch(db);
    planosArr.forEach(plano => {
        const docRef = doc(col); // crea id único
        batch.set(docRef, plano);
    });
    await batch.commit();
}


export async function borrarCarritosVacios() {
    const cartsRef = collection(db, "carts");
    const snapshot = await getDocs(cartsRef);

    const promesas = snapshot.docs
        .filter((docSnap) => {
            const data = docSnap.data();
            return !data.cart || data.cart.length === 0;
        })
        .map((docSnap) => deleteDoc(doc(db, "carts", docSnap.id)));

    await Promise.all(promesas);
}

/**
 * Elimina por completo el documento del carrito de un usuario.
 * @param {string} uid
 */
export async function borrarCarritoDeUsuario(uid) {
    if (!uid) return;
    const docRef = doc(db, "carts", uid);
    await deleteDoc(docRef);
}