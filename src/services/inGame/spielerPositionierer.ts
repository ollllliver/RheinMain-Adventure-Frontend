import {Spieler } from '@/models/Spieler';
import { Client } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/lobbyService';

const wsurl = `ws://${window.location.hostname}:8080/gamebroker`;
export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
const { lobbystate } = useLobbyStore();
import userStore from '@/stores/user'
import { useGameEngine } from './gameEngine';

const {setzeMitspielerAufPosition} = useGameEngine();

/**
 * Schribt sich bei STOMP auf das Topic /topic/spiel/{lobbyID} ein
 * 
 * @param stompclient 
 */
export function subscribeToSpielerPositionenUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID;
    stompclient.onConnect = async () => {
        stompclient.subscribe(DEST, (message) => {
            const spieler: Spieler = JSON.parse(message.body);
            // console.log(`Neue Position von ${spieler.name}:`, spieler.eigenschaften.position);
            if (spieler.name!= userStore.state.benutzername){
                setzeMitspielerAufPosition(spieler)
            }
        });
    }
}
