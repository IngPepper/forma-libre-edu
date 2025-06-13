"use client";
import styles from "./ModalLoading.module.css";
import LoadingPage from "@/components/(utilities)/LoadingPage.jsx"; // O tu animación favorita

export default function ModalLoading({ visible, texto = "Procesando pago..." }) {
    if (!visible) return null;
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <LoadingPage />
                <span className={styles.text}>{texto}</span>
            </div>
        </div>
    );
}
