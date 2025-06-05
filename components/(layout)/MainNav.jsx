"use client";
import styles from './MainNav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import AccountMenu from './AccountMenu';
import BurgerMenuDropdown from "@/components/(utilities)/BurgerMenuDropdown";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import { useIsClient } from "@/components/(utilities)/useIsClient";

function MainNav() {
    const pathname = usePathname();
    const esCatalogo = pathname === '/catalogo';

    const { user, setUser } = useUser();
    const isClient = useIsClient();
    const { totalItems } = useCart();
    const login = !!user && !!user.hasAnAccount;

    const cerrarSesionFn = () => {
        setUser(null);
    };

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.container}>
                <Link href="/" className={styles.logoLink}>
                    {/* Logo normal */}
                    <img
                        src="/assets/l02H_B_marron_t.svg"
                        alt="Logotipo"
                        className={`${styles.logo} ${styles.logoGrande}`}
                    />
                    {/* Logo mini */}
                    <img
                        src="/assets/iso02S_marron_t.svg"
                        alt="Logo compacto"
                        className={`${styles.logo} ${styles.logoMini}`}
                    />
                </Link>

                <div className={styles.spacer}></div>

                <div className={styles.navActions}>
                    <div className={styles.navLinks}>
                        <Link
                            href={esCatalogo ? '/' : '/catalogo'}
                            className={styles.navLink}
                        >
                            {esCatalogo ? 'Inicio' : 'Catálogo'}
                        </Link>
                        <Link href={'/planes'} className={styles.navLink}>Planes</Link>
                    </div>

                    {/* ICONO DEL CARRITO */}
                    <Link href="/carrito" className={styles.cartLink} aria-label="Carrito">
                        <RiShoppingCartFill className={styles.cartIcon} />
                        {isClient && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    <BurgerMenuDropdown />

                    {/* SOLO muestra AccountMenu si tiene cuenta */}
                    {login ? (
                        <AccountMenu
                            onLogout={cerrarSesionFn}
                        />
                    ) : (
                        <Link href="/register" aria-label="Cuenta">
                            <button className={styles.accountButton} type="button">
                                <MdOutlineAccountCircle className={styles.menuIcon} />
                                <span className={styles.accountText}>Cuenta</span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default MainNav;
