
import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';

export default function Cookies() {
    return (

        <section className={"wrapper"}>
            <h1 className={"smallerText"}>Cookies 🍪 /</h1>
            <ContentSection
                title="Política de Cookies"
                image="/assets/im46h_cubo_paisaje_centro.jpg"
            >
                <p className={"clearText"}>
                    Utilizamos cookies para mejorar tu experiencia en Forma Libre. Las cookies nos permiten recordar tus preferencias, analizar el tráfico y personalizar el contenido.
                </p>
                <p className={"clearText"}>
                    Puedes gestionar tus preferencias de cookies en cualquier momento desde la sección de{' '}
                    <Link href="/privacidad" className={"link"}>privacidad</Link>.
                </p>
                <p className={"clearText"}>
                    Si continúas navegando, aceptas nuestro uso de cookies. Más información en nuestras{' '}
                    <Link href="/politicas" className={"link"}>políticas generales</Link>.
                </p>
            </ContentSection>
        </section>

    );
}
