
import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';
import MainFooter from "@/components/(layout)/MainFooter.jsx";


export default function Acerca() {
    return (
        <>
            <section className="wrapperSmall">
                <h1 className="smallerText">¿Quienes <br/> somos? /</h1>
                <ContentSection
                    title="Acerca de Forma Libre"
                    image="/assets/im36h_iso_lineas_centro.jpg"
                >
                    <p className="clearText">
                        Forma Libre nació con la intención de crear una comunidad donde el diseño arquitectónico y la creatividad se puedan compartir sin límites. Somos un espacio donde puedes publicar, descargar y conectar con personas apasionadas por el diseño.
                    </p>
                    <p className="clearText">
                        Nuestro equipo cree en la colaboración abierta y el acceso libre a los recursos digitales, fomentando el aprendizaje y la inspiración mutua.
                    </p>
                    <p className="clearText">
                        ¿Quieres saber más sobre nuestra misión? Visita la sección de{' '}
                        <Link href="/" className="link">beneficios</Link> o <Link href="/contacto" className="link">contáctanos</Link> directamente.
                    </p>
                </ContentSection>

            </section>
            <div className="add500"></div>
            <MainFooter />
        </>

    );
}
