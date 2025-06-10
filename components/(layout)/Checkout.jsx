"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import styles from "./Checkout.module.css";
import { useState, useEffect } from "react";
import { useIsClient } from "@/components/(utilities)/useIsClient";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
    const isClient = useIsClient(); // <--- Úsalo aquí
    const { cart, total, clearCart } = useCart();
    const { user } = useUser();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [compraRealizada, setCompraRealizada] = useState(false);

    useEffect(() => {
        if (user) {
            setNombre(user.nombre || "");
            setCorreo(user.email || "");
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearCart();
        setCompraRealizada(true);
        toast.success("¡Compra realizada exitosamente!");
    };

    // 👇 Esto previene hydration mismatch
    if (!isClient) {
        return <div style={{padding:"3em 0", textAlign:"center"}}>Cargando checkout...</div>;
    }

    if (compraRealizada) {
        return (
            <section className={"wrapper"} style={{padding:" 0 1rem 1rem 1rem", textAlign:"center"}}>
                <div className={styles.confirmacion}>
                    <h2 className={styles.confirmacionTitulo}>¡Gracias por tu compra!</h2>
                    <p className={styles.confirmacionTexto}>Se ha enviado el recibo a <b>{correo}</b>.</p>
                    <Link href={'/'} className={"link"}>Volver al inicio...</Link>
                    <div className={styles.lastContent}></div>
                </div>
            </section>
        );
    }

    if (!cart.length) {
        return (
            <div className={styles.confirmacion}>
                <h2 className={styles.confirmacionTitulo}>Carrito vacío</h2>
                <p className={styles.confirmacionTexto}>Agrega productos antes de continuar con el checkout.</p>
            </div>
        );
    }

    return (

        <section className={"wrapper"}>
            <h1 className={"smallerText"}>Resumen <br/> de compra /</h1>
            <section className={styles.checkout}>
                <h1 className={styles.titulo}>Recibo /</h1>
                <ul className={styles.lista}>
                    {cart.map((item) => (
                        <li key={item.id} className={styles.listaItem}>
                            {item.titulo} x {item.cantidad} — {item.precio === 0 ? "¡Gratis!" : `$${item.precio}`}
                        </li>
                    ))}
                </ul>
                <p className={styles.totalTexto}><strong>Total:</strong> {total === 0 ? "¡Gratis!" : `$${total}`}</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Nombre completo:
                        <input
                            className={styles.input}
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </label>
                    <label className={styles.label}>
                        Correo:
                        <input
                            type="email"
                            className={styles.input}
                            value={correo}
                            onChange={e => setCorreo(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>
                    <button className={styles.btnPrimario} type="submit">Finalizar compra</button>
                </form>
            </section>
        </section>
    );
}
