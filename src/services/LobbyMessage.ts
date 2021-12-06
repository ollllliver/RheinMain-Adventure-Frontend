import { NachrichtenCode } from "./NachrichtenCode";

export interface LobbyMessage{
    typ: NachrichtenCode;
    istFehler: boolean;
    payload: string;
}