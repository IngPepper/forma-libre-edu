"use client";
import { useState } from "react";
import styles from "./ContentPriceCard.module.css";
import Image from "next/image";

import imgIndividual from "@/public/assets/im07h_cubos_al_centro_acento_rojo.jpg";
import imgMensual from "@/public/assets/im08h_paisaje_cubo_rojo_centro_izq.jpg";
import imgAnual from "@/public/assets/im22h_cubo_mountains_centro.jpg";

const priceOptions = [
    { label: "Individual", value: "individual", price: 299, image: imgIndividual },
    { label: "Mensual", value: "mensual", price: 89, image: imgMensual },
    { label: "Anual", value: "anual", price: 900, image: imgAnual },
];

export default function ContentPriceCard({
                                             title,
                                             details,
                                             onBuy,
                                             className = ""
                                         }) {
    const [selected, setSelected] = useState("individual");
    const current = priceOptions.find((opt) => opt.value === selected);

    return (
        <div className={`${styles.card} ${className}`}>
            <div className={styles.imageBox}>
                <Image
                    src={current.image}
                    alt={title}
                    fill
                    style={{ objectFit: "cover", borderRadius: "var(--borde-radius)" }}
                    sizes="720px"
                    placeholder={"blur"}
                />
            </div>
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.details}>{details}</div>
                <div className={styles.toggle}>
                    {priceOptions.map((opt) => (
                        <button
                            key={opt.value}
                            className={selected === opt.value ? styles.active : ""}
                            onClick={() => setSelected(opt.value)}
                            type="button"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <div className={styles.price}>
                    <span>${current.price}</span>
                    {selected === "mensual" && <span className={styles.period}>/mes</span>}
                    {selected === "anual" && <span className={styles.period}>/año</span>}
                </div>
                <div className={styles.buttons}>
                    <button
                        className={styles.buyButton}
                        onClick={() => onBuy && onBuy(selected, current.price)}
                    >
                        Comprar {selected === "individual" ? "Individual" : selected === "mensual" ? "Mensual" : "Anual"}
                    </button>
                </div>
            </div>
        </div>
    );
}
