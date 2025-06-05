// components/(utilities)/RequireAccount.jsx
"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import RegisterScreen from "@/components/(layout)/RegisterScreen"; // o la pantalla de registro que uses

export default function RequireAccount({ children }) {
    const { user } = useUser();

    if (user === null) return <div className={"wrapper"}>
        <Link href={'/register'} className={"link"} rel={"Cargando"}>
            <h3>Para ver el catalogo crea una cuenta dando click aquí...</h3>
        </Link>
    </div>;
    if (!user.hasAnAccount) return <RegisterScreen />;

    return <>{children}</>;
}