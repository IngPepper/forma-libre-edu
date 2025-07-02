"use client";
import { useEffect, useState } from "react";
import styles from "./Bubble.module.css";
import { FaArrowUp } from "react-icons/fa";
import useNavAtBottom from "@/components/(utilities)/useNavAtBottom";

export default function Bubble({ threshold = 400, offsetBottom = "5.5rem" }) {
    const navAtBottom = useNavAtBottom();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > threshold);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            className={`${styles.bubble} ${styles.bubbleReset} ${visible ? styles.visible : ""}`}
            onClick={scrollToTop}
            aria-label="Volver al inicio"
            style={{bottom: navAtBottom ? "8rem" : "3rem", right: "1rem"  }}
            type="button"
        >
            <FaArrowUp />
        </button>
    );
}
