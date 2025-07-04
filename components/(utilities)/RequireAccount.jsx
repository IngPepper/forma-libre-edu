// components/(utilities)/RequireAccount.jsx
"use client";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import RegisterScreen from "@/components/(layout)/RegisterScreen"; // o la pantalla de registro que uses
import styles from "@/components/(utilities)/RequireAccount.module.css"
import Image from "next/image";

export default function RequireAccount({ children }) {
    const { user } = useUser();

    if (user === null) return(
        <div className={`wrapper`}>
            <div className={styles.bandeja}>
                <Image
                    src="/assets/l02H_B_marron_t.svg"
                    alt="Logotipo isotipo"
                    width={200}
                    height={200}
                    style={{ objectFit: "cover", padding: "0 3rem 0 0" }}
                    priority
                />
                <Link href={'/register'} className={"link"} rel={"Cargando"}>
                    <h3>Para ver el catalogo crea una cuenta dando click aquí...</h3>
                </Link>
            </div>
            <div className={"min"}></div>
            <div className={"min"}></div>
        </div>
        );


    if (!user.hasAnAccount) return <RegisterScreen />;

    return <>{children}</>;
}