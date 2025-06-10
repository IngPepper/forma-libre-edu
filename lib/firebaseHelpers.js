import { db } from "./firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
} from "firebase/firestore";

/**
 * Obtener todos los planos de la colección "planos"
 * @returns {Promise<Array>}
 */
export async function obtenerPlanos() {
    const col = collection(db, "planos");
    const snap = await getDocs(col);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Obtener un plano por su id de Firestore
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function obtenerPlanoPorId(id) {
    const ref = doc(db, "planos", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

/**
 * Agregar un nuevo plano a la colección
 * @param {Object} plano - Los datos del plano
 * @returns {Promise<Object>} - El plano agregado (incluyendo su id)
 */
export async function agregarPlano(plano) {
    const col = collection(db, "planos");
    const docRef = await addDoc(col, plano);
    const nuevo = await getDoc(docRef);
    return { id: docRef.id, ...nuevo.data() };
}

/**
 * Editar/actualizar un plano existente
 * @param {string} id - El id del plano a actualizar
 * @param {Object} nuevosDatos - Los campos a modificar
 * @returns {Promise<Object>} - El plano actualizado
 */
export async function editarPlano(id, nuevosDatos) {
    const ref = doc(db, "planos", id);
    await updateDoc(ref, nuevosDatos);
    const actualizado = await getDoc(ref);
    return { id: ref.id, ...actualizado.data() };
}

/**
 * Eliminar un plano por id
 * @param {string} id - El id del plano a eliminar
 * @returns {Promise<string>} - El id eliminado
 */
export async function eliminarPlano(id) {
    const ref = doc(db, "planos", id);
    await deleteDoc(ref);
    return id;
}
