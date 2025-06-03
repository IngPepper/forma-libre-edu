import './globals.css';
import MainNav from '../components/(layout)/MainNav';      // Ajusta la ruta según tu estructura
import MainFooter from '../components/(layout)/MainFooter';
import SmallSeparator from "@/components/(utilities)/SmallSeparator";
import ContentPromo from "@/components/(layout)/ContentPromo";

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