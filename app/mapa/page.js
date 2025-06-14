import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';
import MainFooter from '@/components/(layout)/MainFooter';

export default function MapaDelSitio() {
    return (
        <>
            <section className="wrapperSmall">
                <h1 className="smallerText">Mapa <br/> del Sitio /</h1>
                <ContentSection
                    title="Mapa del Sitio"
                    image="/assets/im47h_manesillas_centro.jpg"
                    reverse
                >
                    <p className="clearText">
                        Navega por Forma Libre con facilidad usando este índice rápido de todas nuestras secciones
                        principales.
                    </p>
                    <ul className="clearText" style={{margin: '1rem 0'}}>
                        <li><Link href="/" className="link">Inicio</Link></li>
                        <li><Link href="/acerca" className="link">Acerca</Link></li>
                        <li><Link href="/catalogo" className="link">Catálogo</Link></li>
                        <li><Link href="/beneficios" className="link">Beneficios</Link></li>
                        <li><Link href="/contacto" className="link">Contacto</Link></li>
                        <li><Link href="/politicas" className="link">Políticas</Link></li>
                        <li><Link href="/privacidad" className="link">Privacidad</Link></li>
                        <li><Link href="/cookies" className="link">Cookies</Link></li>
                    </ul>
                    <p className="clearText">
                        ¿No encuentras algo? <Link href="/contacto" className="link">Contáctanos</Link> y te ayudamos a
                        ubicarlo.
                    </p>
                </ContentSection>
            </section>
            <div className={"add500"}></div>
            <MainFooter/>
        </>
    )
}