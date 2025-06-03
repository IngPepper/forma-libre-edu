import styles from './ContentPromo.module.css';

export default function ContentPromo({
                                         title = "Promoción del Mes",
                                         description = "¡Obtén un levantamiento arquitectónico con un 20% de descuento durante junio! Solo este mes, tu proyecto comienza con nosotros a un precio especial.",
                                         image = "/assets/im11h_rectangulos_planos.jpg",
                                         ctaText = "Solicítalo ahora",
                                         ctaLink = "/"
                                     }) {
    return (
        <section className="wrapper">
            <div className={styles.promo}>
                <div className={styles.info}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                    <a href={ctaLink} className={styles.button}>{ctaText}</a>
                </div>
                <div className={styles.imageBox}>
                    <img src={image} alt="Promoción levantamiento arquitectónico" className={styles.image}/>
                </div>
            </div>
        </section>
    );
}
