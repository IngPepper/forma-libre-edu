"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

// Estructura de un producto en el carrito
// { id, titulo, precio, cantidad, imagen, ... }

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    // Lee el carrito de localStorage al iniciar
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Guarda el carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Agrega un producto (si ya existe, suma la cantidad)
    const addToCart = (producto, cantidad = 1) => {
        setCart((prev) => {
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

    // Quita un producto completamente
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((p) => String(p.id) !== String(id)));
    };

    // Modifica la cantidad (ej: desde un input)
    const setProductQuantity = (id, cantidad) => {
        setCart((prev) =>
            prev.map((p) =>
                String(p.id) === String(id) ? { ...p, cantidad: Math.max(1, cantidad) } : p
            )
        );
    };

    // Vacía el carrito
    const clearCart = () => setCart([]);

    // Calcula el total del carrito
    const total = useMemo(
        () =>
            cart.reduce(
                (acc, p) => acc + Number(p.precio) * Number(p.cantidad),
                0
            ),
        [cart]
    );

    // Número total de artículos
    const totalItems = useMemo(
        () => cart.reduce((acc, p) => acc + Number(p.cantidad), 0),
        [cart]
    );

    // Si el carrito está vacío
    const isEmpty = cart.length === 0;

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
