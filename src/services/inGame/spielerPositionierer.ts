import {Spieler } from '@/models/Spieler';
import { Client } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/LobbyStore';

const wsurl = `ws://localhost:8080/gamebroker`;
export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
const { lobbystate } = useLobbyStore();
import userStore from '@/stores/user'
import { useGameEngine } from './gameEngine';

const {setzeMitspielerAufPosition, setzteSchluesselAnz, keineSchluesselWarnung } = useGameEngine();

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

export function subscribeToSchluesselUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID + "/schluessel";
    stompclient.onConnect = async () => {
        stompclient.subscribe(DEST, (message) => {
            const anzSchluess: any = message.body;
            //Jenachdem wie viele Schluessel eingesammelt wurden:
            if (anzSchluess != 0){
                //entweder SchluesselCOunter hochzaehler...
                console.log("ANTWORT VOM SERVER ANZAHL SCH: " + anzSchluess)
                setzteSchluesselAnz(anzSchluess); 

            }else{
                //... oder keine Schluessel meldung
                console.log("KEINE SCHLÜSSEL");
                keineSchluesselWarnung();
                
            }
            
            
        });
    }
}
