import { Benutzer } from "./Benutzer";

export interface Lobby {
    lobbyID: string;
    teilnehmerliste: Array<Benutzer>;
    host: Benutzer;
    istVoll: boolean;
    istGestartet: boolean;
    spielerlimit: number;
}
