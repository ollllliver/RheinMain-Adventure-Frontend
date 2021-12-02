import { NachrichtenTyp } from "./NachrichtenTyp";

export interface ChatNachricht{
    typ: NachrichtenTyp;
    inhalt: String;
    sender: String;
}