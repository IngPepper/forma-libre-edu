"use client";
import { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/context/UserContext";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

function limpiarUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(undefined); // undefined = loading
    const [cargado, setCargado] = useState(false);
    const { user } = useUser();
    const prevUID = useRef();

    // 1. Cargar carrito desde Firestore
    useEffect(() => {
        const uid = user?.uid || user?.idUsuario;
        if (uid && prevUID.current !== uid) {
            setCart(undefined); // loading
            setCargado(false);
            prevUID.current = uid;
            const docRef = doc(db, "carts", uid);
            getDoc(docRef).then(docSnap => {
                if (docSnap.exists()) {
                    const remoteCart = docSnap.data().cart || [];
                    setCart(Array.isArray(remoteCart) ? remoteCart : []);
                } else {
                    setCart([]);
                }
                setCargado(true);
            }).catch(() => {
                setCart([]);
                setCargado(true);
            });
        } else if (!uid) {
            setCart([]);
            setCargado(false);
            prevUID.current = null;
        }
    }, [user]);

    // 2. Guardar carrito SÓLO si está "cargado"
    useEffect(() => {
        const uid = user?.uid || user?.idUsuario;
        if (uid && cargado && Array.isArray(cart) && cart.length > 0) {
            const cartClean = cart.map(limpiarUndefined);
            const docRef = doc(db, "carts", uid);
            setDoc(docRef, { cart: cartClean }, { merge: true });
        }
    }, [cart, user, cargado]);

    // Métodos del carrito
    const addToCart = (producto, cantidad = 1) => {
        const productoLimpio = limpiarUndefined(producto);
        setCart(prev => {
            const list = prev || [];
            const existing = list.find(p => String(p.id) === String(producto.id));
            if (existing) {
                return list.map(p =>
                    String(p.id) === String(producto.id)
                        ? { ...p, cantidad: p.cantidad + cantidad }
                        : p
                );
            } else {
                return [...list, { ...productoLimpio, cantidad }];
            }
        });
    };

    const removeFromCart = id => {
        setCart(prev => {
            const list = prev || [];
            return list.filter(p => String(p.id) !== String(id));
        });
    };

    const setProductQuantity = (id, cantidad) => {
        setCart(prev => {
            const list = prev || [];
            return list.map(p =>
                String(p.id) === String(id) ? { ...p, cantidad: Math.max(1, cantidad) } : p
            );
        });
    };

    const clearCart = () => setCart([]);

    const total = useMemo(
        () => (cart ? cart.reduce((acc, p) => acc + Number(p.precio) * Number(p.cantidad), 0) : 0),
        [cart]
    );

    const totalItems = useMemo(
        () => (cart ? cart.reduce((acc, p) => acc + Number(p.cantidad), 0) : 0),
        [cart]
    );

    const isEmpty = cart ? cart.length === 0 : true;

    // --- ¡YA NO HAY return de "Cargando carrito..." aquí! ---

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                setProductQuantity,
                clearCart,
                total,
                totalItems,
                isEmpty,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
