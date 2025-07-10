import { useEffect, useState } from "react";

export function useNearBottom(offset = 0) {
    const [isNearBottom, setIsNearBottom] = useState(false);

    useEffect(() => {
        function checkNearBottom() {
            const windowHeight = window.innerHeight;
            const bodyHeight = document.body.offsetHeight;
            const scrollY = window.scrollY || window.pageYOffset;
            // SOLO si el contenido es más largo que la ventana
            if (bodyHeight > windowHeight) {
                setIsNearBottom((windowHeight + scrollY) >= (bodyHeight - offset));
            } else {
                setIsNearBottom(false);
            }
        }

        window.addEventListener("scroll", checkNearBottom);
        window.addEventListener("resize", checkNearBottom);
        // Checar inmediatamente
        checkNearBottom();
        // Checar de nuevo después de un pequeño timeout para imágenes/datos asíncronos
        const timeout = setTimeout(checkNearBottom, 350);

        return () => {
            window.removeEventListener("scroll", checkNearBottom);
            window.removeEventListener("resize", checkNearBottom);
            clearTimeout(timeout);
        };
    }, [offset]);

    return isNearBottom;
}