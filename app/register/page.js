"use client";
import RegisterScreen from "@/components/(layout)/RegisterScreen";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import DetallePlano from "@/components/(layout)/DetallePlano";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function Register() {
    return (
        <>
            <main className="wrapper">
                <ScrollToTopOnNavigation />
                <RegisterScreen />
                <div className={"min"}></div>
            </main>
        <MainFooter/>
        </>
    );
}