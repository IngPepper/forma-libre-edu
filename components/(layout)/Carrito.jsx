"use client";

import styles from './Carrito.module.css';
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import React, { useState } from "react";
import { borrarCarritoDeUsuario } from "@/lib/firebaseHelpers";
import { useUser } from "@/context/UserContext";

export default function Carrito() {
    const {
        cart,
        removeFromCart,
        setProductQuantity,
        clearCart,
        total,
        totalItems,
        isEmpty
    } = useCart();

    const router = useRouter();
    const { user, loading } = useUser();

    const [loadingClear, setLoadingClear] = useState(false);

    // Nueva función para crear la preferencia en el backend y redirigir a MP
    async function crearPreferencia(cart, user) {
        const items = cart.map(item => ({
            title: item.titulo,
            unit_price: item.precio,
            quantity: item.cantidad,
            id: item.id,
            currency_id: "MXN"
        }));

        const body = {
            items,
            nombre: user?.nombre || "Cliente",
            correo: user?.email || "sin-email@dominio.com",
            // Puedes agregar más datos si tu backend los usa
        };

        const res = await fetch("http://localhost:4000/api/create-preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log("RES:", data);
        return data;
    }

    // 1. Loader mientras carga usuario
    if (loading) {
        return (
            <section className="wrapper">
                <div className={styles.empty}>
                    <h1 style={{ color: "var(--color-texto)" }} className="smallerText">
                        Cargando usuario...
                    </h1>
                </div>
                <div className="min"></div>
            </section>
        );
    }

    // 2. Si no hay usuario, pide login
    if (!user?.idUsuario && !user?.uid && !user?.id) {
        return (
            <section className="wrapper">
                <div className={styles.empty}>
                    <h1 style={{ color: "var(--color-texto)" }} className="smallerText">
                        Debes iniciar sesión para usar el carrito 🛒
                    </h1>
                    <Link href="/login" className={styles.btn}>
                        Iniciar sesión
                    </Link>
                </div>
                <div className="min"></div>
            </section>
        );
    }

    // 3. Carrito vacío
    if (isEmpty) {
        return (
            <section className="wrapper">
                <div className={styles.empty}>
                    <h1 style={{ color: "var(--color-texto)" }} className="smallerText">
                        Tu carrito está vacío / 🛒
                    </h1>
                    <Link href="/catalogo" className={styles.btn}>
                        Ir al catálogo
                    </Link>
                </div>
                <div className="min"></div>
            </section>
        );
    }

    // 4. Carrito lleno
    return (
        <div className="wrapper">
            <h1 className="smallerText">Carrito de <br /> compras /</h1>
            <section className={styles.carrito}>
                <ul className={styles.lista}>
                    {cart.map((item) => (
                        <li key={item.id} className={styles.item}>
                            <img src={item.imagen} alt={item.titulo} className={styles.imagen} />
                            <div className={styles.info}>
                                <h3 className={styles.titulo}>{item.titulo}</h3>
                                <p className={styles.descripcion}>{item.descripcion}</p>
                                <div className={styles.categoria}>{item.categoria}</div>
                            </div>
                            <div className={styles.priceCol}>
                                <div className={styles.precio}>
                                    {Number(item.precio) === 0
                                        ? "¡Gratis!"
                                        : `$${Number(item.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    }
                                </div>
                                <div className={styles.controls}>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setProductQuantity(item.id, Math.max(1, item.cantidad - 1))}
                                        aria-label="Disminuir"
                                    >
                                        <FaMinus className={styles.iconos} />
                                    </button>
                                    <span className={styles.cantidad}>{item.cantidad}</span>
                                    <button
                                        className={styles.qtyBtn}
                                        onClick={() => setProductQuantity(item.id, item.cantidad + 1)}
                                        aria-label="Aumentar"
                                    >
                                        <FaPlus className={styles.iconos} />
                                    </button>
                                </div>
                            </div>
                            <button
                                className={styles.botonBasura}
                                onClick={() => {
                                    removeFromCart(item.id);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                title="Quitar del carrito"
                            >
                                <FaTrash className={styles.iconoBasura} />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className={styles.resumen}>
                    <div className={styles.totalPrecio}>
                        <strong>Total:</strong><br />
                        {Number(total) === 0
                            ? "¡Gratis!"
                            : `$${Number(total).toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        }
                    </div>
                    <div className={styles.articulosTotal}>
                        {totalItems}<br /><strong>:Art</strong>
                    </div>
                </div>
                <div className={styles.acciones}>
                    <button
                        className={styles.btn}
                        onClick={async () => {
                            setLoadingClear(true);
                            clearCart();
                            if (user?.uid || user?.idUsuario) {
                                await borrarCarritoDeUsuario(user.uid || user.idUsuario);
                            }
                            setLoadingClear(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={loadingClear}
                    >
                        {loadingClear ? "Vaciando..." : "Vaciar carrito"}
                    </button>
                    <button
                        className={`${styles.acciones} ${styles.btnPrimario}`}
                        onClick={() => router.push("/checkout")}
                    >
                        Proceder al pago
                    </button>
                </div>
            </section>
            <div className={"add500"}></div>
        </div>
    );
}
