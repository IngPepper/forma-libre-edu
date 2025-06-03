"use client";
import LoginScreen from "@/components/LoginScreen";
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";

export default function Login() {
    return (
        <main className="wrapper">
            <ScrollToTopOnNavigation />
            <LoginScreen />
        </main>
    );
}