"use client";
import Carrito from "@/components/(layout)/Carrito";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function CarritoPage() {
    return (

        <>
            <section className={`wrapper min`}>
                <Carrito />
            </section>
        <MainFooter />
        </>

        );
}