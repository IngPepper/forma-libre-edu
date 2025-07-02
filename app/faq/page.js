"use client";
import { useState } from "react";
import MainFooter from "@/components/(layout)/MainFooter.jsx";
import styles from "./page.module.css";

const faqs = [
    {
        q: "¿Qué es Forma Libre?",
        a: "Forma Libre es una plataforma para descargar archivos AutoCAD, planos arquitectónicos y recursos digitales de arquitectura en español.",
    },
    {
        q: "¿Cómo puedo comprar un plano?",
        a: "Elige el plano que te interesa, agrégalo al carrito y realiza el pago con el método de tu preferencia. Una vez confirmado, podrás descargarlo.",
    },
    {
        q: "¿En qué formato están los archivos?",
        a: "Los archivos generalmente están en formato .DWG (AutoCAD), aunque también ofrecemos PDF y otros formatos según el recurso.",
    },
    {
        q: "¿Es seguro pagar en la plataforma?",
        a: "Sí, utilizamos proveedores de pago seguros como Mercado Pago, Payhip y Gumroad para proteger tu información.",
    },
    {
        q: "¿Puedo solicitar factura?",
        a: "Sí, puedes solicitar factura al completar tu compra. Sigue las instrucciones que te proporcionamos en la confirmación.",
    },
    {
        q: "¿Hay devoluciones?",
        a: "Debido a la naturaleza digital del producto, no hay devoluciones una vez realizada la descarga, pero si tienes algún problema contáctanos.",
    },
];

export default function Page() {
    const [openIdx, setOpenIdx] = useState(null);

    return (
        <>
            <section className="faqSection wrapper">
                <h1 className="smallerText">Preguntas Frecuentes /</h1>
                {faqs.map((item, idx) => (
                    <div className="faqItem" key={idx}>
                        <button
                            className="faqQuestion"
                            aria-expanded={openIdx === idx}
                            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        >
                            {item.q}
                        </button>
                        <div
                            className={
                                styles.faqAnswer +
                                (openIdx === idx ? " " + styles.open : "")
                            }
                        >
                            {openIdx === idx && <p>{item.a}</p>}
                        </div>
                    </div>
                ))}
                <div className={styles.breakDegradado}></div>
                <div className={"min"}></div>
            </section>
            <MainFooter />
        </>
    );
}
