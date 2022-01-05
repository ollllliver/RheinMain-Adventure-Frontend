import { NachrichtenTyp } from "./NachrichtenTyp";

export interface ChatNachricht{
    typ: NachrichtenTyp;
    inhalt: string;
    sender: string;
}