import { NachrichtenCode } from "./NachrichtenCode";

export interface LobbyMessage{
    operation: NachrichtenCode;
    istFehler: boolean;
    payload: String;
}