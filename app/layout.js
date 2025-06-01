import './globals.css';
import MainNav from '../components/MainNav';      // Ajusta la ruta según tu estructura
import MainFooter from '../components/MainFooter';
import SmallSeparator from "@/components/SmallSeparator"; // Ajusta la ruta según tu estructura

export const metadata = {
    title: "Forma Libre",
    description: "Best website to get auto cad files for architecture"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <MainNav />        {/* ← Menú global */}
        {children}         {/* ← Aquí va el contenido de cada página */}
        <SmallSeparator />
        <MainFooter />     {/* ← Footer global */}
        </body>
        </html>
    );
}