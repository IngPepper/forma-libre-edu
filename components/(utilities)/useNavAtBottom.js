'use client';
import { useState, useEffect } from "react";

export default function useNavAtBottom() {
    const [atBottom, setAtBottom] = useState(false);

    useEffect(() => {
        function check() {
            setAtBottom(window.innerWidth <= 645);
        }
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return atBottom;
}