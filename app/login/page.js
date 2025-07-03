"use client";
import LoginScreen from "@/components/(layout)/LoginScreen";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import MainFooter from "@/components/(layout)/MainFooter";

export default function Login() {
    return (
        <>
            <main className="wrapper">
                <ScrollToTopOnNavigation />
                <LoginScreen />
                <div className={"min"}></div>
            </main>
        <MainFooter/>
        </>

    );
}