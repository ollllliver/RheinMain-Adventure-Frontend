import * as Three from "three";
import {GraphicLoader} from '@/services/inGame/GraphicLoader';
import {MyKeyboardControls} from '@/services/inGame/MyKeyboardControls';
import {MyMouseControls} from '@/services/inGame/MyMouseControls';
import { Interactions } from '@/services/inGame/Interactions';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Wird benutzt fuer Developersicht in bspw. initRenderer
import {SpielerLokal} from '@/models/SpielerLokal';
import { gamebrokerStompclient, subscribeToSpielerPositionenUpdater } from "@/services/inGame/spielerPositionierer";
import { Position, Spieler } from "@/models/Spieler";
import { useLobbyStore } from "../lobby/lobbyService";
import { Camera } from "three/src/cameras/Camera";
import userStore from '@/stores/user'
import { ChatTyp, useChatStore } from "@/services/ChatStore";



let container: any;
let camera: Camera;
let cameraCollidable: typeof Three.Mesh;
let scene: typeof Three.Scene;
let renderer: any;
let meshPlane: any;
const loader = new GraphicLoader();
const collidableList: Array<any> = [];
const interactableList: Array<any> = [];
const developer = false;
const geschwindigkeit = 5.0; //je niedriger desto schneller

let developerCamera: any;

let mausSteuerung: MyMouseControls;
let tastaturSteuerung: MyKeyboardControls;
let interactions: Interactions;
let interaktionText: any;

let spieler: SpielerLokal

let prevTime = performance.now();
//const velocity = new Three.Vector3();
const direction = new Three.Vector3();

let requestID: number;

const stompClient = gamebrokerStompclient;

const {lobbystate} = useLobbyStore();

const {unsubscribeChat, subscribeChat} = useChatStore();

const mitspieler3dObjektListe = new Map<string,any>();

let startPosition: Position;

function setContainer(element: HTMLElement | null) {
    container = element
}

const initScene = () => {
    scene = new Three.Scene();

    const ambientLight = new Three.AmbientLight(0xcccccc);
    scene.add(ambientLight);

    const directionalLight = new Three.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);
};

/**
 * Initialisiert Loader Klasse, lädt Raum
 */
const initLoader = () => {
    const türID = 34;
    const schlüsselID = 35;

    // TODO: Level-ID dynamisch bestimmen

    // const { lobbystate } = useLobbyStore()
    // const levelId : string = lobbystate.levelID

    fetch(`http://${window.location.hostname}:3000/api/level/1/0`, {
        method: 'GET',
    }).then((response) => {
        if (!response.ok) {
            console.log("Fehler beim Abfragen der Level+Raum Kombo. Antwort war nicht 200 OK :(");
            return;
        }
        return response.json();

    }).then((RaumMobiliarListe) => {
        console.log("RaumMobiliar aus Level wird jetzt vom Backend geladen.")
        RaumMobiliarListe.forEach(function (raumMobiliar) {
            console.log(raumMobiliar);
            const posX = raumMobiliar.positionX;
            const posY = raumMobiliar.positionY;

            // Startposition ermitteln und hier festlegen. Ginge auch per fetch auf
            // /api/level/startposition/{levelID}/{raumindex}, so ist es aber stabiler und schneller
            if (raumMobiliar.mobiliar.mobiliartyp == "EINGANG") {
                startPosition = new Position(posX, spieler.height * 3, posY);
            }
 
            
            // Idee von Olli:
            // In nächster Ausbaustufe 3D Modelle nur 1 mal pro Typ abfragen und dann "mehrfach" platzieren
            // Davor müsste man zu begin ein Set des Mobiliars erstellen

            const mobiliarId: number = raumMobiliar.mobiliar.mobiliarId;
            console.log("GLTF-Datei für Mobiliar " + raumMobiliar.mobiliar.name + " wird geholt.")
            loader.ladeDatei(`http://${window.location.hostname}:3000/api/level/` + mobiliarId).then((res: any) => {

                // Da die 3D-Objekte recht groß sind, werden sie mit mehr Abstand zueinander platziert.
                res.scene.position.x = 4 * posX
                res.scene.position.z = 4 * posY
                collidableList.push(res.scene)

                // Wenn in dem Mobiliartyp SCHLUESSEL, NPC oder TUER steht, ist das Objekt zusätzlich interagierbar
                if (['SCHLUESSEL', 'NPC', 'TUER'].includes(raumMobiliar.mobiliar.mobiliartyp)) {
                    res.scene.children[0].name = raumMobiliar.mobiliar.name;
                    if (raumMobiliar.mobiliar.mobiliartyp == 'TUER' || raumMobiliar.mobiliar.mobiliartyp == 'SCHLUESSEL'){
                        //Tür und Schlüssel bestehen aus mehreren Objekten,
                        //aber jeweils nur die Tür und der Schlüssel soll interactable sein (z.B kein Türrahmen)
                        interactableList.push(res.scene.children[0]); 
                    } else {
                        interactableList.push(res.scene);
                    }
                }
                scene.add(res.scene)
            });
        });
        console.log("Das gesamte Mobiliar des Raumes wurde erfolgreich heruntergeladen und platziert.")
    
        camera.position.set(startPosition.x, startPosition.y, startPosition.z);

        lobbystate.teilnehmerliste.forEach(function (spieler) {
            if (spieler.name != userStore.state.benutzername) {
                loader.ladeDatei('/assets/blender/player.gltf').then((spieler3D: any) => {

                    spieler.setModel(spieler3D.scene);

                    scene.add(spieler.model)

                    spieler.model.position.x = 1 * startPosition.x;
                    spieler.model.position.z = 1 * startPosition.z;

                    mitspieler3dObjektListe.set(spieler.name, spieler.model);
                });
            }
        });
    });
    
};

/**
 * Initialisiert Kamera
 */
const initCamera = () => {

    
    //subscribeToSchluesselUpdater(stompClient);

    // First Person View inset (camera)
    camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, window.innerHeight);

    stompClient.activate();
    spieler = new SpielerLokal(stompClient, camera);
    subscribeToSpielerPositionenUpdater(stompClient);

    // Developer Kamera Main (camera2)
    if (developer) {
        developerCamera = new Three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, window.innerHeight);
        developerCamera.position.set(-50, 50, -50);
        developerCamera.lookAt(new Three.Vector3(0, spieler.height, 0));

        // Axes Helper (x,y,z)
        const axesHelper = new Three.AxesHelper(30);
        scene.add(axesHelper)

    }


    // Kamera Collision objekt init

    const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
    const wireMaterial = new Three.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    cameraCollidable = new Three.Mesh(cubeGeometry, wireMaterial);
    cameraCollidable.position.set(0, spieler.height / 2, 0);
    cameraCollidable.lookAt(new Three.Vector3(0, spieler.height, 0))

};

/**
 * Passe Spielanzeige an die groeße des Browserfensters an
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Initialisiert die Steuerung
 */
const initControls = () => {
    mausSteuerung = new MyMouseControls(spieler, document); //init Maussteuerung
    tastaturSteuerung = new MyKeyboardControls(collidableList, cameraCollidable, document, spieler); //init Keyboardsteuerung

    //connect();
}

/**
* Initialisiert die Interaktionen
*/
 const initInteractions = () => {
    interactions = new Interactions(interactableList, cameraCollidable, document, stompClient);
    interaktionText = document.getElementById("interaktionText");
}

/**
* Initialisiert den InGame-Chat
*/
const initChat = () =>{
    subscribeChat(lobbystate.lobbyID, ChatTyp.INGAME);

    const chat = document.getElementById("Chat");
    const chatButton = document.getElementById("ChatButton");

    if(chat != null && chatButton != null){
        const btn = document.createElement("button");
        btn.id = "CloseButton";
        btn.innerHTML = "x";
        btn.onclick = function () {
            closeChat(chat, chatButton);
        };
        chat.appendChild(btn);

        chatButton.onclick = function (){
            openChat(chat, chatButton);
        };

        closeChat(chat, chatButton);
    }
}

/**
 * Verbindet die Eingabe-Controller und und schließt das Spielunterbrechungsfenster
 */
const connect = () => {
    window.addEventListener('click', mausSteuerung.lock); //locked die Maus     
        tastaturSteuerung.connect();
        mausSteuerung.connect();
        console.log("gameEninge.connect: verbunden")

        const pauseFenster = document.getElementById('pause');
        if (pauseFenster != null){ pauseFenster.style.display = "none";}
}

/**
 * Trennt die Verbindung zu den Eingabe-Controllern und öffnet das Spielunterbrechungsfenster
 */
const disconnect = () => {
    disconnectController();
    interactions.disconnect();
    unsubscribeChat();
    window.removeEventListener('click', mausSteuerung.lock);
    console.log("gameEninge.disconnect: getrennt")
}

const disconnectController = () => {

    mausSteuerung.dispose();
    tastaturSteuerung.disconnect();

    const pauseFenster = document.getElementById('pause');
    if (pauseFenster != null){ pauseFenster.style.display = "";}
}

const initPlane = () => {
    const plane = new Three.PlaneGeometry(100, 100);
    const material = new Three.MeshBasicMaterial({color: 0xB4A290, side: Three.DoubleSide});

    meshPlane = new Three.Mesh(plane, material);
    meshPlane.rotateX(1 / 2 * Math.PI)
    meshPlane.position.x = 0
    scene.add(meshPlane);
};

const initInteractionTestObject = () => {
    // erzeuge Schluessel
    loader.ladeDatei('/assets/blender/key.gltf').then((key: any) => {
        const keyModel = key.scene;
        keyModel.children[0].name = "Schlüssel";
        keyModel.position.x = -5;
        keyModel.position.y = 0.5;
        keyModel.position.z = -3;
        scene.add(keyModel);
        interactableList.push(keyModel);
    }).catch((e)=>
    console.log('ERROR:',e));

    // erzeuge Tuer
    const geometry = new Three.BoxGeometry(0.1, 2, 1);
    const material = new Three.MeshNormalMaterial();
    const door = new Three.Mesh(geometry, material);
    door.name = "Tür"
    door.position.x = -5;
    door.position.y = 1;
    door.position.z = 3;
    scene.add(door);
    interactableList.push(door)
  };


// const initRaycaster = () => {
//     raycaster = new Three.Raycaster(new Three.Vector3(), new Three.Vector3(0, -1, 0), 0, 10);
// }

const initRenderer = () => {


    // main scene (oben ansicht)
    renderer = new Three.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Fuer automatische Verfolgung des Blocks im Level in Developersicht, funktioniert noch nicht ganz
    // (auskommentierter Code auch in doAnimate controls.target...)
    // controls = new OrbitControls(developerCamera, renderer.domElement);
    // controls.minDistance = 50;
    // controls.maxDistance = 300;

};

const stopAnimate = () => {
    cancelAnimationFrame(requestID);
    console.log("gameEngine.stopAnimate(): Animation erfolgreich gestoppt.");
}

const startAnimate = () => {
    requestID = requestAnimationFrame(doAnimate);
    doAnimate();
}

const updateVelocity = (s: Spieler, delta:number ) => {
    s.velocity.x -= s.velocity.x * geschwindigkeit * delta;
    s.velocity.z -= s.velocity.z * geschwindigkeit * delta;
    s.velocity.y -= s.velocity.y * geschwindigkeit * delta;
}


const doAnimate = () => {
    requestAnimationFrame(doAnimate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;   //delta ca. 0,017s wenn 60 fps
    prevTime = time;
    //entweder hier oder in MyKeyboardControl

    updateVelocity(spieler, delta);
    
    
    mausSteuerung.update(spieler.velocity, delta); //Maus Steuerung
    tastaturSteuerung.update(camera, spieler.velocity, delta) //Tastatur Steuerung
    interactions.update(camera) //Interaktionen
    

    // Interaktionstext anzeigen, wenn eine Interaktion moeglich ist
    if(interactions.erkannteInteraktion){
        zeigeInteraktionText(interactions.erkannteInteraktion)
    } else {
        verbergeInteraktionText()
    }

    // developer sicht
    if (developer) {
        // Developer Kamera (Uebersicht)
        renderer.setClearColor(0x000000, 0);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, developerCamera);
        scene.add(cameraCollidable);

        // BoxHelper (geladene Objekte, erstmal nur IntroLevel)
        const boxHelper = new Three.BoxHelper(collidableList[0], new Three.MeshBasicMaterial(0xff0000))
        scene.add(boxHelper)

        // Hauptkamera (POV)
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(30, 30, window.innerWidth / 4, window.innerHeight / 4);
        renderer.setViewport(30, 30, window.innerWidth / 4, window.innerHeight / 4);
        renderer.setClearColor(0x222222, 1);

        //controls.target.copy(camera.position);

        renderer.render(scene, camera);

        renderer.setScissorTest(false);
    } else { // standard pov sicht
        renderer.render(scene, camera);
    }

    //wohin damit?
    //übertragt die Postition der Kamera an die Positionen des lokalen Spielers
    // spieler.position.x = camera.position.x.toFixed(2);
    // spieler.position.y = camera.position.y.toFixed(2);
    // spieler.position.z = camera.position.z.toFixed(2);

    //spieler.velocity = camera.velocity;

    renderer.render(scene, camera);

};

function zeigeInteraktionText(interaktion: any) {
    if (interaktionText != null /*&& interaktionText.style.display == "none"*/) {
        interaktionText.textContent = "[E] Interagiere mit " + interaktion.object.name
        interaktionText.style.display = "block"
    }
}

function verbergeInteraktionText() {
    if (interaktionText != null /*&& interaktionText.style.display != "none"*/) {
        interaktionText.textContent = ""
        interaktionText.style.display = "none"
    }
}

  function openChat(chat:any, chatButton:any){
    chat.style.display = "block";
    chatButton.style.display = "none";
  }

  function closeChat(chat:any, chatButton:any){
    chat.style.display = "none";
    chatButton.style.display = "block";
  }

  function setzeMitspielerAufPosition(spieler: Spieler, delta:number){
    const objektInScene = mitspieler3dObjektListe.get(spieler.name);

    //spieler.moveForward(-spieler.position * delta);

    //objektInScene.translateZ(-spieler.position.z * delta);

    objektInScene.position.x = 1 * spieler.eigenschaften.position.x;
    objektInScene.position.z = 1 * spieler.eigenschaften.position.z;
}

function setzteSchluesselAnz(anzSchluess: any){
    console.log("Anzahl Schluessel" + anzSchluess)
}

export function useGameEngine(){
    return {
        setzteSchluesselAnz,
        setzeMitspielerAufPosition,
        initScene,
        initLoader,
        initCamera,
        initPlane,
        initInteractionTestObject,
        initRenderer,
        initControls,
        initInteractions,
        initChat,
        startAnimate,
        stopAnimate,
        connect, disconnect, disconnectController,
        setContainer,
        scene
    }
}
