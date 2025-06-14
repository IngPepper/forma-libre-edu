import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function Privacidad() {
    return (

        <>
            <section className={`minimalContentView wrapperSmall`}>
                <h1 className="smallerText">Privacidad /</h1>
                <ContentSection
                    title="Política de Privacidad"
                    image="/assets/im49h_cuadrado_blanco_centro.jpg"
                    reverse
                >
                    <p className="clearText">
                        Valoramos tu privacidad y la protección de tus datos. Solo solicitamos la información necesaria para brindarte la mejor experiencia, nunca la compartimos con terceros sin tu autorización.
                    </p>
                    <p className="clearText">
                        Puedes solicitar la modificación o eliminación de tus datos en cualquier momento desde <Link href="/contacto" className="link">aquí</Link>.
                    </p>
                    <p className="clearText">
                        Consulta nuestras <Link href="/politicas" className="link">políticas generales</Link> para conocer más detalles.
                    </p>
                </ContentSection>
                <div className={"add500"}></div>
            </section>
            <MainFooter/>
        </>

    );
}