'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/userHelpers";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función reutilizable para cargar usuario (para refetchUser y load inicial)
    const loadUser = async (firebaseUser) => {
        if (firebaseUser) {
            const baseUser = {
                idUsuario: firebaseUser.uid,
                email: firebaseUser.email,
                nombre: firebaseUser.displayName || "", // <- Siempre toma el displayName de Auth
                miembroDesde: firebaseUser.metadata.creationTime,
            };
            try {
                // Perfil extendido de Firestore
                const perfil = await getUserProfile(firebaseUser.uid);
                setUser((prev) => ({
                    ...prev, // para no perder campos temporales locales
                    ...baseUser,
                    ...perfil, // solo sobreescribe los campos existentes
                    nombre: firebaseUser.displayName || perfil?.nombre || "", // Siempre prioridad a displayName
                    hasAnAccount: true,
                    isAdmin: perfil?.rol === "admin",
                }));
            } catch (err) {
                setUser((prev) => ({
                    ...prev,
                    ...baseUser,
                    membresia: "free",
                    rol: "user",
                    facturas: [],
                    hasAnAccount: true,
                    isAdmin: false,
                }));
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    // Hook principal: escucha cambios de sesión
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            await loadUser(firebaseUser);
        });
        return () => unsubscribe();
        // eslint-disable-next-line
    }, []);

    // Refetch para cuando hagas cambios de perfil
    const refetchUser = async () => {
        setLoading(true);
        const firebaseUser = auth.currentUser;
        await loadUser(firebaseUser);
    };

    // Actualiza SOLO los campos que se pasan, conservando el resto
    const updateProfile = (newData) => setUser((u) => u ? { ...u, ...newData } : u);

    return (
        <UserContext.Provider value={{ user, setUser, updateProfile, loading, refetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
