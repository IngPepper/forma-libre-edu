"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./CollapsibleSection.module.css";

export default function CollapsibleSection({
                                               maxHeight = 900,    // Altura máxima antes de colapsar
                                               breakpoint = 900,   // Ancho máximo de pantalla para activar el colapso
                                               showCollapseToggle = true,
                                               children
                                           }) {
    const [expandido, setExpandido] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const contentRef = useRef(null);

    // Detecta si la pantalla es chica
    useEffect(() => {
        const checkScreen = () => setIsSmallScreen(window.innerWidth <= breakpoint);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, [breakpoint]);

    // Si deja de ser pantalla chica, siempre expandido
    useEffect(() => {
        if (!isSmallScreen) setExpandido(true);
        else setExpandido(false);
    }, [isSmallScreen]);

    return (
        <section className={styles.wrapper} style={{ position: "relative" }}>
            <div
                className={`${styles.colapsado} ${expandido ? styles.expandido : ""}`}
                style={
                    isSmallScreen && !expandido
                        ? { maxHeight: maxHeight }
                        : { maxHeight: "9999px" }
                }
                ref={contentRef}
            >
                {children}
                {/* Botón solo si está en pantalla chica y el toggle está habilitado */}
                {isSmallScreen && showCollapseToggle && (
                    <button
                        className={styles.dropdownBoton}
                        onClick={() => setExpandido((v) => !v)}
                    >
                        {expandido ? "Mostrar menos ▲" : "Mostrar más ▼"}
                    </button>
                )}
            </div>
        </section>
    );
}
