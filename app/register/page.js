"use client";
import RegisterScreen from "@/components/(layout)/RegisterScreen";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

export default function Register() {
    return (
        <main className="wrapper">
            <ScrollToTopOnNavigation />
            <RegisterScreen />
        </main>
    );
}