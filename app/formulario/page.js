'use client';

import FormularioArchivo from '@/components/(layout)/EnviarPlanoForm'
import MainFooter from "@/components/(layout)/MainFooter.jsx";


export default function FormularioArchivoPage(){

    return (
        <>
            <section className={"wrapper"}>
                <h1 className={"smallerText"}>Comparte /</h1>
                <FormularioArchivo />
                <div className={"add500"}></div>
            </section>
        <MainFooter/>
        </>

    )
};
