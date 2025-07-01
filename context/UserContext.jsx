'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/userHelpers";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null); // Objeto PLANO (como ahora)
    const [firebaseUser, setFirebaseUser] = useState(null); // El de Firebase Auth
    const [loading, setLoading] = useState(true);

    const loadUser = async (firebaseUserObj) => {
        setFirebaseUser(firebaseUserObj); // <-- Aquí lo guardas SIEMPRE
        if (firebaseUserObj) {
            const baseUser = {
                idUsuario: firebaseUserObj.uid,
                email: firebaseUserObj.email,
                nombre: firebaseUserObj.displayName || "",
                miembroDesde: firebaseUserObj.metadata.creationTime,
            };
            try {
                const perfil = await getUserProfile(firebaseUserObj.uid);
                setUser((prev) => ({
                    ...prev,
                    ...baseUser,
                    ...perfil,
                    nombre: firebaseUserObj.displayName || perfil?.nombre || "",
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUserObj) => {
            await loadUser(firebaseUserObj);
        });
        return () => unsubscribe();
    }, []);

    const refetchUser = async () => {
        setLoading(true);
        const firebaseUserObj = auth.currentUser;
        await loadUser(firebaseUserObj);
    };

    const updateProfile = (newData) => setUser((u) => u ? { ...u, ...newData } : u);

    return (
        <UserContext.Provider value={{
            user,               // Objeto plano enriquecido
            firebaseUser,       // Objeto REAL de Firebase Auth
            setUser,
            updateProfile,
            loading,
            refetchUser
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
