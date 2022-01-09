import { Position, SpielerInterface } from '@/models/Spieler';
import { Client } from '@stomp/stompjs';
import { useLobbyStore } from '@/services/lobby/LobbyStore';

const wsurl = `ws://localhost:8080/gamebroker`;
export const gamebrokerStompclient = new Client({ brokerURL: wsurl });
const { lobbystate } = useLobbyStore();
import userStore from '@/stores/user'
import { GraphicLoader } from '@/services/inGame/GraphicLoader';
import { useGameEngine } from './gameEngine';

const {setzeMitspielerAufPosition} = useGameEngine();

export function subscribeToSpielerPositionenUpdater(stompclient: Client): void{
    const DEST = "/topic/spiel/" + lobbystate.lobbyID;
    stompclient.onConnect = async () => {
        stompclient.subscribe(DEST, (message) => {
            const spieler: SpielerInterface = JSON.parse(message.body);
            console.log(`Neue Position von ${spieler.name}:`, spieler.eigenschaften.position);
            if (spieler.name!= userStore.state.benutzername){
                setzeMitspielerAufPosition(spieler.eigenschaften.position)
            }
        });
    }
}


// function setzeSpielerAufPosition(position: Position){
//     // console.log(position);
//     loader.ladeDatei('http://localhost:3000/api/level/33').then((res: any) => {
//         // console.log(res)
//         res.scene.position.x = 1 * position.x
//         res.scene.position.z = 1 * position.y
//         scene.add(res.scene)
//     });
// }


