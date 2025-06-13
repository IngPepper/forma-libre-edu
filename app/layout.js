import './globals.css';
import MainNav from '../components/(layout)/MainNav';
import MainFooter from '../components/(layout)/MainFooter';
import { Toaster } from 'react-hot-toast';


import { UserProvider } from "@/context/UserContext";
import {CartProvider} from "@/context/CartContext";

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
                <MainNav />
                {children}
                <Toaster position={"top-center"} />
                <MainFooter />
            </CartProvider>
        </UserProvider>
        </body>
        </html>
    );
}