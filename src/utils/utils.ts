import type { BodyHash } from "../types/compra";
import { INTEGRITY } from "./contants";

export const hashCode = async (params: BodyHash): Promise<string> => {

    const cadenaConcatenada = `${params.reference}${params.amount}${params.currency}${INTEGRITY}`;

    const encondedText = new TextEncoder().encode(cadenaConcatenada);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
}