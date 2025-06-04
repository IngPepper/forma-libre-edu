// pages/cuenta.jsx
"use client";
import CuentaUsuario from "@/components/(layout)/CuentaUsuario";

export default function CuentaPage() {
    // Mock del perfil del usuario
    const perfil = {
        email: "luis@formalibre.com",
        nombre: "LuisL",
        miembroDesde: "2022-11-15",
        tipoMembresia: "Premium",
    };

    // Mock de facturas
    const facturas = [
        { id: "F001", fecha: "2024-04-05", monto: "$199.00 MXN" },
        { id: "F002", fecha: "2024-05-05", monto: "$199.00 MXN" },
    ];

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
        <main className={"wrapper"}>
            <CuentaUsuario
                perfil={perfil}
                facturas={facturas}
                onActualizarPerfil={onActualizarPerfil}
                onCancelar={onCancelar}
                onDescargarFactura={onDescargarFactura}
            />
        </main>
    );
}
