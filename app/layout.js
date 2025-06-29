import './globals.css';
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { PlanoProvider } from "@/context/PlanoContext";
import AppLoader from "@/components/(utilities)/AppLoader";
import MainNav from "@/components/(layout)/MainNav";
import Bubble from "@/components/(utilities)/Bubble";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Forma Libre",
    description: "Best website to get auto cad files for architecture"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <UserProvider>
            <CartProvider>
                <PlanoProvider> {/* <-- AGREGA AQUÍ */}
                    <AppLoader>
                        <div style={{ position: 'relative' }}>
                            <MainNav />
                            {children}
                        </div>
                        <Bubble />
                        <Toaster position={"top-center"} />
                    </AppLoader>
                </PlanoProvider>
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    );
}
