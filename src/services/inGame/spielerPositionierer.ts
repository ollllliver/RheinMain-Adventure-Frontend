import { SpielerInterface } from '@/models/Spieler';
import { Client } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/LobbyStore';

const wsurl = `ws://localhost:8080/gamebroker`;
export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
const { lobbystate } = useLobbyStore();

export function subscribeToSpielerPositionenUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID;
    stompclient.onConnect = async (frame) => {
        stompclient.subscribe(DEST, (message) => {
            const spieler: SpielerInterface = JSON.parse(message.body);
            console.log(`Neue Position von ${spieler.name}:`, spieler.eigenschaften.position);
            // TODO: Spieler Positionen setzten.
        });
    }
}



