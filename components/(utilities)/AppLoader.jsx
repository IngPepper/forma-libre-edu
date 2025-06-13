"use client";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import LoadingPage from "@/components/(utilities)/LoadingPage.jsx";

export default function AppLoader({ children }) {
    const { loading: userLoading } = useUser();
    const { cart } = useCart();
    const cartLoading = cart === undefined;

    if (userLoading || cartLoading) {
        return <LoadingPage />;
    }
    return children;
}