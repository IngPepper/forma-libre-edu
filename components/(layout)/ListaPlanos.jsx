"use client";
import { useState } from "react";
import styles from './ListaPlanos.module.css';
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { useIsClient } from "@/components/(utilities)/useIsClient";
import ModalLoading from "@/components/(modals)/ModalLoading"; // <-- Importa tu modal aquí
import { estadosConIcono } from "@/components/(utilities)/MapaMexico";

function parsePrecio(precio) {
    const parsed = Number(String(precio).replace(/[^0-9.]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
}

export default function ListaPlanos({ planos = [] }) {
    const isClient = useIsClient();
    const { user } = useUser();
    const { addToCart } = useCart();
    const [loadingAdd, setLoadingAdd] = useState(false);

    if (!planos.length) {
        return <div className={styles.empty}>No hay planos disponibles.</div>;
    }

    const isSingle = planos.length === 1;

    // Protege acceso a localStorage
    const handleGuardarCategoria = (categoria) => {
        if (typeof window !== "undefined" && categoria) {
            localStorage.setItem('ultimaCategoria', categoria);
        }
    };

    // Solo calcula esto en cliente
    const tieneMembresia = isClient && (user?.membresia === "premium" || user?.tieneMembresia === true);

    return (
        <>
            <ModalLoading visible={loadingAdd} texto="Agregando al carrito..." />
            <div className={styles.lista}>
                {planos.map(plano => (
                    <div
                        key={plano.id}
                        className={`${styles.card} ${isSingle ? styles.singleCard : ""}`}
                    >
                        <img src={plano.imagen} alt={plano.titulo} className={styles.imagen} />
                        <div className={styles.contenido}>
                            <h3 className={styles.titulo}>{plano.titulo}</h3>
                            <p className={styles.descripcion}>{plano.descripcion}</p>
                            <div className={styles.metaInfo}>
                                <h2 className={styles.categoria}>{plano.categoria}</h2>
                                {plano.estado && (() => {
                                    const est = estadosConIcono.find(e => e.clave === plano.estado);
                                    return est ? (
                                        <div className={`${styles.estadoPlano} ${styles.estado}`}>
                                            {est.nombre} {est.icono}
                                        </div>
                                    ) : (
                                        <div className={`${styles.estadoPlano} ${styles.estado}`}>
                                            {plano.estado}
                                        </div>
                                    );
                                })()}
                            </div>
                            {typeof plano?.isDonated === "string" && plano.isDonated.length > 0 && (
                                <h2 className={styles.categoriaDonated}>{plano.isDonated}</h2>
                            )}
                            {/* Solo pinta detalles si es client para evitar mismatch */}
                            {isClient && (
                                <Link
                                    className={styles.detalles}
                                    href={`/levantamientos/${plano.id}`}
                                    onClick={() => {
                                        handleGuardarCategoria(plano.categoria);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Ver detalles
                                </Link>
                            )}
                            {/* Botones solo en client */}
                            {isClient && (
                                <div className={styles.botones}>
                                    {tieneMembresia ? (
                                        <button className={styles.descargar}>Descargar</button>
                                    ) : (
                                        <button
                                            className={styles.comprar}
                                            onClick={async () => {
                                                setLoadingAdd(true);
                                                try {
                                                    await new Promise((res) => setTimeout(res, 400));
                                                    const bundle = plano.niveles?.[0] || {};
                                                    addToCart({
                                                        id: String(plano.id),
                                                        imagen: plano.imagen,
                                                        titulo: plano.titulo,
                                                        descripcion: plano.descripcion,
                                                        categoria: plano.categoria,
                                                        precio: parsePrecio(plano.precio || plano.niveles?.[0]?.precio || 0),
                                                        tamanoArchivo: bundle.tamanoArchivo,
                                                        tipoArchivo: bundle.tipoArchivo,
                                                        isDonated: plano.isDonated
                                                    }, 1);
                                                    toast.success("¡Producto agregado al carrito!", { duration: 1000 });
                                                } finally {
                                                    setLoadingAdd(false);
                                                }
                                            }}
                                        >
                                            Agregar al carrito
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
