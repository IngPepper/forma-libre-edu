"use client";
import { useEffect } from 'react';
import styles from './MainNav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import AccountMenu from './AccountMenu';
import BurgerMenuDropdown from "@/components/(utilities)/BurgerMenuDropdown";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import { useIsClient } from "@/components/(utilities)/useIsClient";
import { logout } from "@/lib/authHelpers";

function MainNav() {
    const pathname = usePathname();
    const esCatalogo = pathname === '/catalogo';

    const { user, refetchUser } = useUser();
    const router = useRouter();
    const isClient = useIsClient();
    const { totalItems } = useCart();
    const login = !!user && !!user.hasAnAccount;

    // Cierra sesión REAL en Firebase y actualiza el contexto
    const cerrarSesionFn = async () => {
        await logout();
        if (refetchUser) {
            await refetchUser();
        }
        router.push('/');
    };

    // Sticky bottom nav hasta 542px del fondo (en móviles)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const nav = document.querySelector(`.${styles.navWrapper}`);
        if (!nav) return;

        const handleScroll = () => {
            const isMobile = window.innerWidth <= 645;
            if (!isMobile) {
                nav.style.position = '';
                nav.style.bottom = '';
                nav.style.top = '';
                return;
            }

            const footer = document.querySelector('footer');
            if (!footer) return;

            const footerTop = footer.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            if (footerTop < viewportHeight + 10) {
                nav.style.position = 'absolute';
                nav.style.bottom = `${document.body.scrollHeight - footer.offsetTop + 10}px`;
                nav.style.top = 'auto';
            } else {
                nav.style.position = 'fixed';
                nav.style.bottom = '0';
                nav.style.top = 'auto';
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.container}>
                <Link href="/" className={styles.logoLink}>
                    <img
                        src="/assets/l02H_B_marron_t.svg"
                        alt="Logotipo"
                        className={`${styles.logo} ${styles.logoGrande}`}
                    />
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
                            {esCatalogo ? 'Inicio' : 'Planos'}
                        </Link>
                    </div>

                    <Link href="/carrito" className={styles.cartLink} aria-label="Carrito">
                        <RiShoppingCartFill className={styles.cartIcon} />
                        {isClient && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    <BurgerMenuDropdown />

                    {login ? (
                        <AccountMenu onLogout={cerrarSesionFn} />
                    ) : (
                        <Link href="/login" aria-label="Cuenta">
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
