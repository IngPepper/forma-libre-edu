"use client";
import RegisterScreen from "@/components/RegisterScreen";
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";

export default function Register() {
    return (
        <main className="wrapper">
            <ScrollToTopOnNavigation />
            <RegisterScreen />
        </main>
    );
}