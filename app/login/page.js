"use client";
import LoginScreen from "@/components/(layout)/LoginScreen";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

export default function Login() {
    return (
        <main className="wrapper">
            <ScrollToTopOnNavigation />
            <LoginScreen />
        </main>
    );
}