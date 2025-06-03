"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";
import styles from "./AccountMenu.module.css"; // Usa los mismos estilos del dropdown

export default function BurgerMenuDropdown() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const pathname = usePathname();

    // Cierra el menú si haces click fuera
    useEffect(() => {
        if (!open) return;
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Opciones a mostrar según la ruta
    const options = [
        { label: "Inicio", href: "/" },
        { label: "Catálogo", href: "/catalogo" },
        { label: "Planes", href: "/planes" }
    ];

    const visibleOptions = options.filter(opt => opt.href !== pathname);

    return (
        <div className={styles.invisible}>
            <div className={styles.avatarWrapper} style={{marginLeft: "0.5em"}}>
                <button
                    className={styles.avatarButton}
                    aria-label="Abrir menú"
                    onClick={() => setOpen(v => !v)}
                    type="button"
                >
                    {open ? <MdClose className={styles.menuIcon} /> : <MdMenu className={styles.menuIcon} />}
                </button>
                {open && (
                    <div
                        ref={menuRef}
                        className={styles.menu}
                    >
                        {visibleOptions.map(opt => (
                            <Link
                                href={opt.href}
                                key={opt.href}
                                className={styles.menuItem}
                                onClick={() => setOpen(false)}
                            >
                                {opt.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}
