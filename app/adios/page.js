"use client";
import styles from './AdiosPage.module.css';
import Link from 'next/link';

export default function AdiosPage() {
    return (
        <section className={styles.wrapper}>
            <div className={styles.blob}></div>
            <div className={styles.card}>
                <h1 className={styles.title}>¡Hasta luego!</h1>
                <p className={styles.text}>
                    Gracias por formar parte de esta aventura libre.<br/>
                    <span className={styles.accent}>Nos vemos en el próximo proyecto.</span>
                </p>
                <Link href="/" className={styles.button}>
                    Volver al inicio
                </Link>
            </div>
        </section>
    );
}
