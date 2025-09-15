// components/(utilities)/ClickAwayListener.jsx
"use client";
import { useEffect, useRef } from "react";

/*
 * Componente que detecta clicks fuera de su contenido y llama a onClickAway.
 * Uso:
 * <ClickAwayListener onClickAway={() => setOpen(false)}>
 *   <div>Contenido del menú</div>
 * </ClickAwayListener>
 */
export default function ClickAwayListener({ onClickAway, children }) {
    const ref = useRef();

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClickAway?.();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClickAway]);

    return <div ref={ref}>{children}</div>;
}