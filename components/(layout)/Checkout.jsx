"use client";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import styles from "./Checkout.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ModalLoading from "@/components/(modals)/ModalLoading";
import {FaArrowLeft} from "react-icons/fa";

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const { user } = useUser();
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [compraRealizada, setCompraRealizada] = useState(false);
    const [debugUrl, setDebugUrl] = useState("");
    const [loadingPago, setLoadingPago] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setNombre(user.nombre || "");
            setCorreo(user.email || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cart.length) {
            toast.error("El carrito está vacío");
            return;
        }

        setLoadingPago(true); // Muestra el modal

        const items = cart.map(item => ({
            title: item.titulo,
            unit_price: Number(item.precio),
            quantity: Number(item.cantidad),
        }));

        const backendUrl =
            process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
            "http://localhost:4000";
        setDebugUrl(backendUrl);

        try {
            const response = await fetch(`${backendUrl}/api/create-preference`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    nombre,
                    correo,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Respuesta inesperada:", errorText);
                toast.error("Error al contactar el servidor");
                setLoadingPago(false);
                return;
            }

            const data = await response.json();
            if (data.id) {
                // Redirige a Mercado Pago
                clearCart();
                window.location.href = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${data.id}`;
                // No se llega a setLoadingPago(false), porque se redirige
            } else {
                toast.error("No se pudo iniciar el pago");
                setLoadingPago(false);
            }
        } catch (err) {
            toast.error("Error al procesar el pago");
            console.error(err);
            setLoadingPago(false);
        }
    };

    if (compraRealizada) {
        return (
            <section className={"wrapper"} style={{ padding: "0 1rem 1rem 1rem", textAlign: "center" }}>
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
            <ModalLoading visible={loadingPago} texto="Procesando pago..." />
            <h1 className={"smallerText"}>Resumen <br /> de compra /</h1>
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
                    <button className={styles.btnPrimario} type="submit" disabled={loadingPago}>
                        {loadingPago ? "Procesando..." : "Finalizar compra"}
                    </button>
                </form>
                <button
                    type="button"
                    className={`${styles.backBtn} ${styles.backBtnReset}`} // Usa tu clase o crea una especial para "atrás"
                    onClick={() => {
                        if (window.history.length > 2) router.back();
                        else router.push("/carrito");
                    }}
                    style={{ marginBottom: "1.5em" }}
                >
                    <FaArrowLeft size={16} />
                </button>
            </section>
        </section>
    );
}
