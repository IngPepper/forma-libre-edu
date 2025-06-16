import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function Politicas() {
    return (
        <>
            <section className="wrapper">
                <h1 className="smallerText">Políticas /</h1>
                <ContentSection
                    title="Políticas Generales"
                    image="/assets/im48h_tablas_iso_centro.jpg"
                >
                    <p className="clearText">
                        En Forma Libre apostamos por la transparencia y la claridad. Aquí puedes consultar las reglas y lineamientos para el buen uso de la plataforma y el contenido que compartimos.
                    </p>
                    <ul className="clearText" style={{ margin: '1rem 0' }}>
                        <li><Link href="/privacidad" className="link">Política de privacidad</Link></li>
                        <li><Link href="/cookies" className="link">Política de cookies</Link></li>
                        <li><Link href="/contacto" className="link">Soporte y contacto</Link></li>
                    </ul>
                    <p className="clearText">
                        Te recomendamos revisar periódicamente esta sección para mantenerte al día con cualquier actualización.
                    </p>
                </ContentSection>
                <div className={"add500"}></div>
            </section>
        <MainFooter/>
        </>
    );
}
