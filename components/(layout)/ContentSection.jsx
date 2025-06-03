import styles from './ContentSection.module.css';

function ContentSection({ title, children, image, reverse = false, className = '' }) {
    return (
        <section className={`${styles.big} ${reverse ? styles.reverse : ''} ${className}`}>
            {image && (
                <div className={styles.image}>
                    <img src={image} alt={title || 'Imagen'} />
                </div>
            )}
            <div className={styles.content}>
                {title && <h1 className={styles.title}>{title}</h1>}
                <div className={styles.body}>{children}</div>
            </div>
        </section>
    );
}
export default ContentSection;