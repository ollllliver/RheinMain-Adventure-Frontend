import { Spieler } from "@/models/Spieler";

export interface Lobby {
    lobbyID: string;
    teilnehmerliste: Array<Spieler>;
    host: Spieler;
    istVoll: boolean;
    istGestartet: boolean;
    spielerlimit: number;
}
