// pages/cuenta.jsx
"use client";
import CuentaUsuario from "@/components/(layout)/CuentaUsuario";
import { useUser } from "@/context/UserContext";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function CuentaPage() {
    // Obtén el usuario real del contexto
    const { user } = useUser();

    // Puedes adaptar nombres de campos según tu modelo real
    const perfil = {
        email: user?.email || "",
        nombre: user?.nombre || "",
        miembroDesde: user?.miembroDesde || "",
        tipoMembresia: user?.membresia === "premium" ? "Premium" : "Free",
        // O agrega más campos si los tienes
    };

    // Usa las facturas reales si ya las tienes en el user
    const facturas = user?.facturas || [];

    // Función para actualizar el perfil (simulación)
    const onActualizarPerfil = (nuevoPerfil) => {
        alert(`Perfil actualizado:\nEmail: ${nuevoPerfil.email}\nNombre: ${nuevoPerfil.nombre}`);
        // Aquí iría el fetch/axios hacia backend o Firebase
    };

    // Función para cancelar membresía (simulación)
    const onCancelar = () => {
        if(window.confirm("¿Seguro que deseas cancelar tu membresía?")) {
            alert("Membresía cancelada.");
            // Aquí va tu lógica para cancelar en backend
        }
    };

    // Función para descargar factura (simulación)
    const onDescargarFactura = (idFactura) => {
        alert(`Descargando factura ${idFactura} (simulado)`);
        // Aquí puedes usar window.open('/ruta/a/factura.pdf') o lógica para descargar PDF real
    };

    return (
        <>
            <main className="wrapper">
                <CuentaUsuario
                    perfil={perfil}
                    facturas={facturas}
                    onActualizarPerfil={onActualizarPerfil}
                    onCancelar={onCancelar}
                    onDescargarFactura={onDescargarFactura}
                />
            </main>
            <div className={"min"}></div>
        <MainFooter/>
        </>

    );
}
