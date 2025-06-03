"use client";

import styles from './TripticoGeneral.module.css';
import { FaShareAlt, FaRegLightbulb, FaShoppingCart } from "react-icons/fa";

export default function TripticoGeneral() {
    return (
        <section
            className={styles.triptico}
            style={{
                backgroundImage: 'url(/assets/im35h_paisaje_detallado.jpg)'
            }}
        >
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h2 className={styles.slogan}>
                    ¡Dale vida a tus ideas, <span>compártelas</span> y <span>únete a la comunidad!</span>
                </h2>
                <div className={styles.cards}>
                    {/* Card 1 */}
                    <div className={styles.card}>
                        <FaShareAlt className={styles.icon} />
                        <h3>Comparte</h3>
                        <p>
                            ¿Tienes un plano, croquis o idea? 📐 Súbelo, compártelo y ayuda a que otros puedan inspirarse o encontrar justo lo que necesitan. ¡Construyamos juntos! 🤝
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className={styles.card}>
                        <FaRegLightbulb className={styles.icon} />
                        <h3>Utiliza un Plan</h3>
                        <p>
                            Explora la galería, descarga planos gratis 🆓 o adquiere el plan que se ajuste a tus necesidades. 🏡 ¡Haz tuyo el diseño y adáptalo a tu proyecto!
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className={styles.card}>
                        <FaShoppingCart className={styles.icon} />
                        <h3>Compra un Levantamiento</h3>
                        <p>
                            ¿Necesitas algo único o personalizado? 🛒 Solicita un levantamiento profesional y recibe tu proyecto listo para usar, con asesoría incluida. ✨
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
