// Importación de estilos CSS específicos del componente
import styles from './MainNav.module.css';

// Importación de íconos desde react-icons (Material Design)
import { MdOutlineAccountCircle, MdMenu } from 'react-icons/md';

function MainNav() {
    return (
        // Contenedor principal del nav, usa una clase con estilos en Flexbox y padding
        <nav className={styles.navWrapper}>

            {/* Contenedor interno con grid y máximo de 1024px de ancho */}
            <div className={styles.container}>

                {/* Logotipo del sitio */}
                <div>
                    <img src="/assets/l02H_B_marron_t.svg" alt="Logotipo" className={styles.logo} />
                </div>

                {/* Espaciador flexible que empuja el contenido hacia los lados */}
                <div className={styles.spacer}></div>

                {/* Acciones del nav: enlaces, menú móvil y botón de cuenta */}
                <div className={styles.navActions}>

                    {/* Enlaces principales (visible en escritorio) */}
                    <div className={styles.navLinks}>
                        <a href="#catalogo" className={styles.navLink}>Catálogo</a>
                        <a href="#planes" className={styles.navLink}>Planes</a>
                    </div>

                    {/* Botón del menú (visible solo en móviles) */}
                    <button className={styles.menuButton} aria-label="Menú">
                        <MdMenu className={styles.menuIcon}/>
                    </button>

                    {/* Botón de cuenta con ícono y texto (el texto se oculta en móviles) */}
                    <button className={styles.accountButton}>
                        <MdOutlineAccountCircle className={styles.menuIcon} />
                        <span className={styles.accountText}>Login/Register</span>
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default MainNav;
