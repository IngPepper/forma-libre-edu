"use client";
import RegisterScreen from "@/components/(layout)/RegisterScreen";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import DetallePlano from "@/components/(layout)/DetallePlano";

export default function Register() {
    return (
        <main className="wrapper">
            <ScrollToTopOnNavigation />
            <RegisterScreen />
            <div className={"add500"}></div>
        </main>
    );
}