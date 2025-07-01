import { db } from "./firebase";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    writeBatch,
    query,
    where,
    setDoc
} from "firebase/firestore";
import { mapFirebaseError } from "@/components/(utilities)/mapFirebaseError";

/**
 * Obtener todos los planos de la colección "planos"
 */
export async function obtenerPlanos() {
    try {
        const col = collection(db, "planos");
        const snap = await getDocs(col);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Obtener un plano por su id de Firestore
 */
export async function obtenerPlanoPorId(id) {
    try {
        const ref = doc(db, "planos", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Agregar un nuevo plano a la colección
 */
export async function agregarPlano(plano) {
    try {
        const col = collection(db, "planos");
        const docRef = await addDoc(col, plano);
        const nuevo = await getDoc(docRef);
        return { id: docRef.id, ...nuevo.data() };
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Editar/actualizar un plano existente
 */
export async function editarPlano(id, data) {
    try {
        id = String(id);
        const docRef = doc(db, "planos", id);
        const docData = { ...data, id };
        await setDoc(docRef, docData, { merge: true });
        return docData;
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Eliminar un plano por id
 */
export async function eliminarPlano(id) {
    try {
        const ref = doc(db, "planos", String(id));
        await deleteDoc(ref);
        return id;
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Importar múltiples planos (array) en batch (opcional)
 */
export async function importarPlanos(planosArr) {
    try {
        const col = collection(db, "planos");
        const batch = writeBatch(db);
        planosArr.forEach(plano => {
            const docRef = doc(col);
            batch.set(docRef, plano);
        });
        await batch.commit();
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Borra todos los carritos vacíos
 */
export async function borrarCarritosVacios() {
    try {
        const cartsRef = collection(db, "carts");
        const snapshot = await getDocs(cartsRef);
        const promesas = snapshot.docs
            .filter((docSnap) => {
                const data = docSnap.data();
                return !data.cart || data.cart.length === 0;
            })
            .map((docSnap) => deleteDoc(doc(db, "carts", docSnap.id)));
        await Promise.all(promesas);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Elimina por completo el documento del carrito de un usuario.
 * @param {string} uid
 */
export async function borrarCarritoDeUsuario(uid) {
    try {
        if (!uid) return;
        const docRef = doc(db, "carts", uid);
        await deleteDoc(docRef);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Obtener todas las órdenes pendientes/fallidas
 */
export async function obtenerOrdenesPendientesOFallidas() {
    try {
        const q = query(
            collection(db, 'ordenes'),
            where('status', 'in', ['pendiente', 'fallida'])
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Eliminar una orden por id
 */
export async function eliminarOrden(id) {
    try {
        await deleteDoc(doc(db, 'ordenes', id));
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}

/**
 * Eliminar todas las órdenes pendientes/fallidas
 */
export async function eliminarTodasOrdenesPendientesOFallidas() {
    try {
        const q = query(
            collection(db, 'ordenes'),
            where('status', 'in', ['pendiente', 'fallida'])
        );
        const snapshot = await getDocs(q);
        const promesas = snapshot.docs.map((docSnap) => deleteDoc(doc(db, 'ordenes', docSnap.id)));
        await Promise.all(promesas);
    } catch (error) {
        throw new Error(mapFirebaseError(error));
    }
}
