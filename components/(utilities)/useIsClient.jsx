import { useEffect, useState } from "react";

/**
 * Hook que retorna true solo en cliente, false en SSR.
 */
export function useIsClient() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    return isClient;
}