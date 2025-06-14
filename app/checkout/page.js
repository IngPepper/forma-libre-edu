'use client';

import Checkout from "@/components/(layout)/Checkout";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function CheckoutPage(){
    return (
        <>
            <section className={"wrapperSmall"}>
                <Checkout/>
                <div className={"add500"}></div>
            </section>
        <MainFooter />
        </>

    );
}