"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(undefined); // <-- Nota: undefined al inicio

    // Cargar de localStorage solo en cliente
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const stored = window.localStorage.getItem("cart");
                setCart(stored ? JSON.parse(stored) : []);
            } catch {
                setCart([]);
            }
        }
    }, []);

    // Guarda el carrito en localStorage cuando cambie (y si cart ya está definido)
    useEffect(() => {
        if (typeof window !== "undefined" && cart !== undefined) {
            try {
                window.localStorage.setItem("cart", JSON.stringify(cart));
            } catch {}
        }
    }, [cart]);

    // --- Tus métodos igual
    const addToCart = (producto, cantidad = 1) => {
        setCart((prev = []) => {
            const existing = prev.find((p) => String(p.id) === String(producto.id));
            if (existing) {
                return prev.map((p) =>
                    String(p.id) === String(producto.id)
                        ? { ...p, cantidad: p.cantidad + cantidad }
                        : p
                );
            } else {
                return [...prev, { ...producto, cantidad }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart((prev = []) => prev.filter((p) => String(p.id) !== String(id)));
    };

    const setProductQuantity = (id, cantidad) => {
        setCart((prev = []) =>
            prev.map((p) =>
                String(p.id) === String(id) ? { ...p, cantidad: Math.max(1, cantidad) } : p
            )
        );
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

    // --- Renderiza los children solo si cart ya fue cargado
    if (cart === undefined) return null;

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
