// /utils/mapFirebaseError.js
import { firebaseErrorMessages } from "@/components/(errors)/firebaseErrors";

export function mapFirebaseError(error) {
    const code = error?.code || "default";
    return firebaseErrorMessages[code] || firebaseErrorMessages["default"];
}