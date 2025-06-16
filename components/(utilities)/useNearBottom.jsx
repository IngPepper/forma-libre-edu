import { useState, useEffect } from "react";

export function useNearBottom(threshold = 120) {
    const [nearBottom, setNearBottom] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const scrollY = window.scrollY;
            const innerHeight = window.innerHeight;
            const bodyHeight = document.body.offsetHeight;
            // ¿Está a menos de "threshold" px del fondo?
            setNearBottom((scrollY + innerHeight) >= (bodyHeight - threshold));
        }
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Para evaluar al cargar
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return nearBottom;
}
