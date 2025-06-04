"use client";
import styles from './MainNav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import AccountMenu from './AccountMenu';
import BurgerMenuDropdown from "@/components/(utilities)/BurgerMenuDropdown";
import { MdOutlineAccountCircle } from "react-icons/md";


function MainNav() {
    const pathname = usePathname();
    const esCatalogo = pathname === '/catalogo';

    const { user, setUser } = useUser();
    // El login ahora también depende de hasAnAccount
    const login = !!user && !!user.hasAnAccount;

    const cerrarSesionFn = () => {
        setUser(null);
    };

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.container}>
                <Link href="/">
                    <img src="/assets/l02H_B_marron_t.svg" alt="Logotipo" className={styles.logo} />
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
                    <BurgerMenuDropdown />

                    {/* SOLO muestra AccountMenu si tiene cuenta */}
                    {login ? (
                        <AccountMenu
                            onLogout={cerrarSesionFn}
                        />
                    ) : (
                        // Muestra solo el botón de registro cuando no tiene cuenta
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
