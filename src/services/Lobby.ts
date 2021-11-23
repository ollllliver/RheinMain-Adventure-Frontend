import { Benutzer } from "./Benutzer";

export interface Lobby {
    lobbyID: String;
    teilnehmerliste: Array<Benutzer>;
    host: Benutzer;
    istVoll: Boolean;
    istGestartet: Boolean;
    spielerlimit: Number;
}
