import './globals.css';
import MainNav from '../components/MainNav';      // Ajusta la ruta según tu estructura
import MainFooter from '../components/MainFooter';
import SmallSeparator from "@/components/SmallSeparator";
import ContentPromo from "@/components/ContentPromo";

export const metadata = {
    title: "Forma Libre",
    description: "Best website to get auto cad files for architecture"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <MainNav /> {/* ← Menú global */}
        <ContentPromo
            title="Forma Libre"
            description="La vida de un critico es sencilla en muchos aspectos a veces por dar una mala reseña de las que son facles y divertidas de escribir, una rata no puede concinar"
            ctaText="Pedí tu ratatui"
            ctaLink="/catalogo"
        />
        {children}         {/* ← Aquí va el contenido de cada página */}
        <SmallSeparator />
        <MainFooter />     {/* ← Footer global */}
        </body>
        </html>
    );
}