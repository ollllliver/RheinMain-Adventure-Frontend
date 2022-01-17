import {Spieler } from '@/models/Spieler';
import { Client } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/lobbyService';

const wsurl = `ws://${window.location.hostname}:8080/gamebroker`;
export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
const { lobbystate } = useLobbyStore();
import userStore from '@/stores/user'
import { useGameEngine } from './gameEngine';

const {setzeMitspielerAufPosition, setzteSchluesselAnz } = useGameEngine();

export function subscribeToSpielerPositionenUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID;
    stompclient.onConnect = async () => {
        stompclient.subscribe(DEST, (message) => {
            const spieler: Spieler = JSON.parse(message.body);
            console.log(`Neue Position von ${spieler.name}:`, spieler.eigenschaften.position);
            if (spieler.name!= userStore.state.benutzername){
                setzeMitspielerAufPosition(spieler)
                
            }
        });
    }
}

export function subscribeToSchluesselUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID + "/schluessel";
    stompclient.onConnect = async () => {
        stompclient.subscribe(DEST, (message) => {
            const anzSchluess: any = message.body;
            console.log("ANTWORT VOM SERVER ANZAHL SCH: " + anzSchluess)
            setzteSchluesselAnz(anzSchluess)
            
        });
    }
}
