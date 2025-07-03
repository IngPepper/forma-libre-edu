import ContentSection from '@/components/(layout)/ContentSection';
import Link from 'next/link';
import MainFooter from "@/components/(layout)/MainFooter.jsx";


export default function Contacto() {
    return (
        <>
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
                        <li>Email: hola@formalibre.mx</li>
                        <li>WhatsApp: <Link href={"#"} rel="noopener noreferrer" className="link">Coming Soon</Link></li>
                        <li>Facebook: <Link href={"https://www.facebook.com/people/Forma-Libre/61576765829363/"} target="_blank" className="link">Forma-Libre</Link></li>
                    </ul>
                    <p className="clearText">
                        También puedes consultar nuestras <Link href="/faq" className="link" >preguntas frecuentes</Link>.
                    </p>
                </ContentSection>
                <div className={"min"}></div>
            </section>
            <MainFooter />
        </>
    );
}