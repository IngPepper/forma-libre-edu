import './globals.css';
import MainNav from '../components/(layout)/MainNav';

import { Toaster } from 'react-hot-toast';

import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import AppLoader from "@/components/(utilities)/AppLoader.jsx";

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
                <AppLoader>
                    <div style={{ position: 'relative' }}>
                        <MainNav />
                        {children}
                    </div>
                    <Toaster position={"top-center"} />
                </AppLoader>
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    );
}
