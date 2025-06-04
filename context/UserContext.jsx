// context/UserContext.js
'use client';
import { createContext, useContext, useState, useEffect } from "react";

// Mock inicial (luego lo puedes quitar)
const mockUser = {
    idUsuario: "LCLH21", // ← Aquí tu nuevo campo ID de usuario
    email: "lucalehemx@gmail.com    ",
    nombre: "Luis Ledesma",
    miembroDesde: "01 01 2025",
    membresia: "premium", // "free" o "premium"
    rol: "user", //"admin" o "user"
    hasAnAccount: true,
    isAdmin: false,
    facturas: [
        { id: 1, fecha: "2024-06-01", url: "/factura1.pdf"},
       //{ id: 12, fecha: "2025-06-01", url: "/factura2.pdf"}
    ],
};

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // Al montar, carga el mock de usuario (simula fetch)
    useEffect(() => {
        // Simula llamada a backend o localStorage
        setTimeout(() => setUser(mockUser), 800); // simula loading
    }, []);

    // Funciones para actualizar datos (ejemplo)
    const updateProfile = (newData) => setUser((u) => ({ ...u, ...newData }));

    return (
        <UserContext.Provider value={{ user, setUser, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
