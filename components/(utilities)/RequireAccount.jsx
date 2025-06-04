// components/(utilities)/RequireAccount.jsx
"use client";
import { useUser } from "@/context/UserContext";
import RegisterScreen from "@/components/(layout)/RegisterScreen"; // o la pantalla de registro que uses

export default function RequireAccount({ children }) {
    const { user } = useUser();

    if (user === null) return <div>Cargando...</div>;
    if (!user.hasAnAccount) return <RegisterScreen />;

    return <>{children}</>;
}