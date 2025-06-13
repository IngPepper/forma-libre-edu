"use client";
import styles from "./LoadingPage.module.css";

export default function LoadingPage() {
    return (
        <div className={styles.loadingWrapper}>
            <div className={styles.loaderLogo}>
                <img
                    src="/assets/iso02S_marron_t.svg"
                    alt="Logo Forma Libre"
                    className={styles.logo}
                    draggable="false"
                />
            </div>
            <span className={styles.text}>Cargando...</span>
        </div>
    );
}