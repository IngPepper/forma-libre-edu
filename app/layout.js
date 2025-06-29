import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { PlanoProvider } from "@/context/PlanoContext";
import { Toaster } from "react-hot-toast";
import AppLoader from "@/components/(utilities)/AppLoader";
import MainNav from "@/components/(layout)/MainNav";
import Bubble from "@/components/(utilities)/Bubble";


export const metadata = {
    title: "Forma Libre",
    description: "La mejor web para obtener archivos AutoCAD, planos arquitectónicos y recursos digitales para arquitectura en español.",
    keywords: [
        "AutoCAD", "planos", "arquitectura", "archivos CAD", "planos arquitectónicos", "planos digitales", "revit", "dwg", "plano casa", "descargar planos", "Forma Libre"
    ],
    authors: [
        { name: "Forma Libre", url: "https://www.formalibre.mx" }
    ],
    openGraph: {
        title: "Forma Libre - Descarga planos AutoCAD para arquitectura",
        description: "Explora una colección premium de planos digitales para arquitectura. Descarga archivos AutoCAD (.dwg), recursos para estudiantes y profesionales.",
        url: "https://www.formalibre.mx",
        siteName: "Forma Libre",
        images: [
            {
                url: "https://www.formalibre.mx/og-image.png",
                width: 1200,
                height: 630,
                alt: "Forma Libre - Planos arquitectónicos"
            }
        ],
        locale: "es_MX",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        site: "@_FormaLibre",
        title: "Forma Libre - Descarga planos AutoCAD para arquitectura",
        description: "Encuentra los mejores archivos CAD y recursos digitales para arquitectura en español.",
        images: ["https://www.formalibre.mx/og-image.png"]
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png"
    },
    robots: "index, follow",
    canonical: "https://www.formalibre.mx"
};

export const viewport = {
    themeColor: "#2b2b2b",
};


export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
            <CartProvider>
                <PlanoProvider>
                    <AppLoader>
                        <div style={{ position: 'relative' }}>
                            <MainNav />
                            {children}
                        </div>
                        <Bubble />
                        <Toaster position={"top-center"} />
                        <SpeedInsights />
                    </AppLoader>
                </PlanoProvider>
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    );
}
