import './globals.css';
import MainNav from '../components/(layout)/MainNav';
import MainFooter from '../components/(layout)/MainFooter';
import SmallSeparator from "@/components/(utilities)/SmallSeparator";


import { UserProvider } from "@/context/UserContext";

export const metadata = {
    title: "Forma Libre",
    description: "Best website to get auto cad files for architecture"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
        <MainNav /> {/* ← Menú global */}
        {children}         {/* ← Aquí va el contenido de cada página */}
        <SmallSeparator />
        <MainFooter />     {/* ← Footer global */}
        </UserProvider>
        </body>
        </html>
    );
}