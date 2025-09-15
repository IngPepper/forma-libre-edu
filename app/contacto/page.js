import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';

export default function Contacto() {
    return (
        <section className="wrapper">
            <h1 className="smallerText">Queremos <br/> saber de ti /</h1>
            <ContentSection
                title="Contáctanos"
                image="/assets/im40h_paisaje_monolito_centro.jpg"
                reverse
            >
                <p className="clearText">
                    ¿Tienes preguntas, sugerencias o simplemente quieres saludarnos? ¡Nos encanta escuchar a la comunidad!
                </p>
                <ul className="clearText">
                    <li>Email: <Link href={"mailto:hola@formalibre.com"} className="link">hola@formalibre.com</Link></li>
                    <li>WhatsApp: <Link href={"https://wa.me/529999999999"} target="_blank" rel="noopener noreferrer" className="link">+52 999 999 9999</Link></li>
                    <li>Facebook: <Link href={"https://www.facebook.com/people/Forma-Libre/61576765829363/"} target="_blank" className="link">/formalibre</Link></li>
                </ul>
                <p className="clearText">
                    También puedes consultar nuestras <Link href="/faq" className="link" >preguntas frecuentes</Link>.
                </p>
            </ContentSection>
        </section>

    );
}