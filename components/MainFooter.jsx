// Estilos
import styles from './MainFooter.module.css';



function MainFooter() {
    return (
        <>

            <footer className={styles.footerWrapper}>
                <div className={styles.container}>
                    <div className={styles.breakDegradado}></div>
                    <div>
                        <img src="/assets/iso02S_marron_t.svg" alt="Logotipo" className={styles.logo} />
                    </div>
                    <h1 className={styles.titulo}>Links Útiles</h1>
                    <ul className={styles.linkList}>
                        <li><a href="#cookies" className={styles.navLink}>Cookies</a></li>
                        <li><a href="#about" className={styles.navLink}>Acerca</a></li>
                        <li><a href="#policy" className={styles.navLink}>Políticas</a></li>
                        <li><a href="#contact" className={styles.navLink}>Contacto</a></li>
                        <li><a href="#privacy" className={styles.navLink}>Privacidad</a></li>
                        <li><a href="#sitemap" className={styles.navLink}>Mapa del sitio</a></li>
                    </ul>
                    <ul className={styles.linkList}>
                        <li><a href="#cookies" className={styles.navLink}>Cookies</a></li>
                        <li><a href="#about" className={styles.navLink}>Acerca</a></li>
                        <li><a href="#policy" className={styles.navLink}>Políticas</a></li>
                        <li><a href="#contact" className={styles.navLink}>Contacto</a></li>
                        <li><a href="#privacy" className={styles.navLink}>Privacidad</a></li>
                        <li><a href="#sitemap" className={styles.navLink}>Mapa del sitio</a></li>
                    </ul>
                </div>
            </footer>
            <div className={styles.agradecimiento}>
                <p>Made with ❤️ by Errol Schneider</p>
            </div>
        </>

    );
}
export default MainFooter;