"use client";
import styles from './Carrito.module.css'; // O ajusta ruta según tu estructura
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useIsClient } from "@/components/(utilities)/useIsClient";

export default function Carrito() {
    const isClient = useIsClient();
    const {
        cart,
        removeFromCart,
        setProductQuantity,
        clearCart,
        total,
        totalItems,
        isEmpty
    } = useCart();

    if (!isClient) {
        // Muestra un loader, skeleton, o nada, mientras monta
        return <div style={{padding:"3em 0", textAlign:"center"}}>Cargando carrito...</div>;
    }

    if (isEmpty) {
        return (
            <section className={styles.empty}>
                <h1>Tu carrito está vacío 🛒</h1>
                <Link href="/catalogo" className={styles.btn}>
                    Ir al catálogo
                </Link>
            </section>
        );
    }

    return (
        <section className={styles.carrito}>
            <h1>Carrito de compras</h1>
            <ul className={styles.lista}>
                {cart.map((item) => (
                    <li key={item.id} className={styles.item}>
                        <img src={item.imagen} alt={item.titulo} className={styles.imagen} />
                        <div className={styles.info}>
                            <h3>{item.titulo}</h3>
                            <p>{item.descripcion}</p>
                            <div className={styles.categoria}>{item.categoria}</div>
                            <div className={styles.controls}>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => setProductQuantity(item.id, Math.max(1, item.cantidad - 1))}
                                    aria-label="Disminuir"
                                >
                                    <FaMinus />
                                </button>
                                <span className={styles.cantidad}>{item.cantidad}</span>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => setProductQuantity(item.id, item.cantidad + 1)}
                                    aria-label="Aumentar"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                        <div className={styles.precio}>
                            {item.precio === 0 ? "¡Gratis!" : `$${item.precio}`}
                        </div>
                        <button
                            className={styles.eliminar}
                            onClick={() => removeFromCart(item.id)}
                            title="Quitar del carrito"
                        >
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
            <div className={styles.resumen}>
                <div>
                    <strong>Total:</strong> {total === 0 ? "¡Gratis!" : `$${total}`}
                </div>
                <div>
                    <strong>Artículos:</strong> {totalItems}
                </div>
            </div>
            <div className={styles.acciones}>
                <button className={styles.btn} onClick={clearCart}>
                    Vaciar carrito
                </button>
                <Link href="/checkout" className={styles.btnPrimario}>
                    Proceder al pago
                </Link>
            </div>
        </section>
    );
}
