import * as Three from "three";
import {GraphicLoader} from '@/services/inGame/GraphicLoader';
import {MyMouseControls} from '@/services/inGame/MyMouseControls';
import {MyKeyboardControls} from '@/services/inGame/MyKeyboardControls';
import {Interactions} from '@/services/inGame/Interactions';
import {SpielerLokal} from '@/models/SpielerLokal';
import {Position, Spieler} from "@/models/Spieler";
import {useLobbyStore} from "../lobby/lobbyService";
import {ChatTyp, useChatStore} from "@/services/ChatStore";
import {
    gamebrokerStompclient,
    schluesselStompclient,
    subscribeToSchluesselUpdater,
    subscribeToSpielerPositionenUpdater
} from "@/services/inGame/spielerPositionierer";
import {reactive} from "vue";
import userStore from '@/stores/user'
import axios from "axios";

const {subscribeChat} = useChatStore();
const {lobbystate} = useLobbyStore();

const gamestate = reactive({anzSchluessel: 0});
const velocity = new Three.Vector3();
const loader = new GraphicLoader();
const developer = false;
const minimap = true;
const minimapWidth = 250;
const minimapHeight = 250;
const minimapCamYPos = 30;
const stompClient = gamebrokerStompclient;
const stompClient2 = schluesselStompclient;

let container: HTMLElement | null;
let camera: Three.PerspectiveCamera;
let cameraCollidable: Three.Mesh;
let scene: Three.Scene;
let renderer: Three.WebGLRenderer;
let meshPlane: Three.Mesh;
let raycaster: Three.Raycaster;
let collidableList: Array<Three.Object3D> = [];
let interactableList: Array<Three.Object3D> = [];
let minimapCamera: Three.OrthographicCamera;
let minimapMarker: Three.Mesh;
let developerCamera: Three.PerspectiveCamera;
let requestID: number;
let mouseControls: MyMouseControls;
let keyControls: MyKeyboardControls;
let interactions: Interactions;
let interaktionText: HTMLElement | null;
let schluesselText: HTMLElement | null;
let spieler: SpielerLokal;
let startPosition: Position;
let prevTime = performance.now();
let mitspieler3dObjektListe = new Map<string, Three.Object3D>();
let interagierbar3dObjektListe = new Map<string, Three.Object3D>();
const gltfFiles = new Map<number, any>();
const GLF_FILE_ID_LIST = [0,1,2,3,4,5,6,7];

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
 * lädt jedes gltf file schon 1 mal runter
 * 
 * @returns Promise, dass alles runtergeladen ist
 */
async function gltfFilesVorladen(){
    return new Promise((resolve) => {
        if (gltfFiles.values.length<0){
            resolve(true);
        }
        GLF_FILE_ID_LIST.forEach(function (mobiliarId: number, index: number, array: Array<number>) {
            axios.get(`/api/level/` + mobiliarId)
            .then((response) => {
                return response.data;
            }).then((URLPfad) => {
                if (URLPfad.gltfPfad!=''){
                    return loader.ladeDatei(URLPfad.gltfPfad).then((res: any) => {
                        gltfFiles.set(mobiliarId,res.scene)
                    });
                }
            }).then(()=>{
                if (index === array.length -1) resolve(true);
            })
        })
    });
}


/**
 * Initialisiert Loader-Klassen (lädt Raum)
 */
const initLoader = () => {
    const positionsSkalierungsfaktor = 4;

    gltfFilesVorladen().then(()=>{
        return fetch(`/api/level/${lobbystate.gewaehlteKarte.levelId}/0`, {
            method: 'GET',
        })
    }).then((response) => {
        if (!response.ok) {
            console.log("Fehler beim Abfragen der Level+Raum Kombo. Antwort war nicht 200 OK :(");
            return;
        }
        return response.json();

    }).then((RaumMobiliarListe) => {
        RaumMobiliarListe.forEach(function (raumMobiliar: any) {
            const posX = raumMobiliar.positionX;
            const posY = raumMobiliar.positionY;

            // Startposition ermitteln und hier festlegen. Ginge auch per fetch auf /api/level/startposition/{levelID}/{raumindex}, so ist es aber stabiler und schneller
            if (raumMobiliar.mobiliar.mobiliartyp == "EINGANG") {
                startPosition = new Position(positionsSkalierungsfaktor * posX, spieler.height * 3, positionsSkalierungsfaktor * posY);
            }

            // Jetzt werden nicht mehr alle gltfs heruntergeladen, wäre ja unnötig!
            const mobiliarId: number = raumMobiliar.mobiliar.mobiliarId;
            
            let res;
            if(gltfFiles.get(mobiliarId)) {
                res = gltfFiles.get(mobiliarId).clone();
                
                // Da die 3D-Objekte recht groß sind, werden sie mit mehr Abstand zueinander platziert.
                res.position.x = positionsSkalierungsfaktor * posX
                res.position.z = positionsSkalierungsfaktor * posY
                collidableList.push(res)

                // Wenn in dem Mobiliartyp SCHLUESSEL, NPC etc steht, ist das Objekt zusätzlich interagierbar
                if (['SCHLUESSEL', 'NPC', 'TUER', 'AUSGANG'].includes(raumMobiliar.mobiliar.mobiliartyp)) {
                    res.children[0].name = raumMobiliar.mobiliar.name;
                    if (raumMobiliar.mobiliar.mobiliartyp == 'TUER' || raumMobiliar.mobiliar.mobiliartyp == 'SCHLUESSEL') {
                        //Tür und Schlüssel bestehen aus mehreren Objekten,
                        //aber jeweils nur die Tür und der Schlüssel soll interactable sein (z.B kein Türrahmen)
                        interagierbar3dObjektListe.set(`${res.position.x};${res.position.z}`, res.children[0]);
                        interactableList.push(res.children[0]);
                    } else {
                        interagierbar3dObjektListe.set(`${res.position.x};${res.position.z}`, res.children[0]);
                        interactableList.push(res);
                    }
                }
                scene.add(res)

            }
        });
    }).then(()=>{

        console.log("Das gesamte Mobiliar des Raumes wurde erfolgreich platziert.")
        camera.position.set(startPosition.x, startPosition.y, startPosition.z);

        lobbystate.teilnehmerliste.forEach(function (mitspieler) {
            if (mitspieler.name != userStore.state.benutzername) {
                loader.ladeDatei('/assets/blender/player.gltf').then((spieler3D: any) => {

                    const objektInScene = spieler3D.scene;

                    scene.add(objektInScene)

                    objektInScene.position.x = positionsSkalierungsfaktor * startPosition.x;
                    objektInScene.position.z = positionsSkalierungsfaktor * startPosition.z;

                    mitspieler3dObjektListe.set(mitspieler.name, objektInScene);
                });
            }
        });

    }).catch((e)=>{
        console.log(e);
    });
};

/**
 * Initialisiert Kamera
 */
const initCamera = () => {
    stompClient.activate();
    spieler = new SpielerLokal(stompClient);
    subscribeToSpielerPositionenUpdater(stompClient);

    stompClient2.activate();
    subscribeToSchluesselUpdater(stompClient2);

    // First Person View inset (camera)
    camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, window.innerHeight);
    camera.position.set(0, spieler.height * 3, 0);
    camera.lookAt(new Three.Vector3(-2, spieler.height * 3, 0));

    // Developer Kamera Main (camera2)
    if (developer) {
        developerCamera = new Three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, window.innerHeight);
        developerCamera.position.set(-50, 50, -50);
        developerCamera.lookAt(new Three.Vector3(0, spieler.height, 0));

        // Axes Helper (x,y,z)
        const axesHelper = new Three.AxesHelper(30);
        scene.add(axesHelper)
    }

    // Minimap Kamera
    if (minimap) {
        // initialisiere Kamera der Minimap
        minimapCamera = new Three.OrthographicCamera();
        minimapCamera.layers.enable(1);
        minimapCamera.zoom = 0.1;
        minimapCamera.position.set(spieler.eigenschaften.position.x, minimapCamYPos, spieler.eigenschaften.position.z);
        minimapCamera.lookAt(new Three.Vector3(0, 0, 0));
        minimapCamera.updateProjectionMatrix();

        // initialisiere roten Punkt auf der Minimap
        const geometry = new Three.SphereGeometry(0.5, 15, 15);
        const material = new Three.MeshBasicMaterial({ color: new Three.Color("rgb(255, 0, 0)") });
        minimapMarker = new Three.Mesh(geometry, material);
        minimapMarker.layers.set(1);
        scene.add(minimapMarker);
    }

    // Kamera Collision objekt init
    const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
    const wireMaterial = new Three.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
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

    renderer.setSize(window.innerWidth, window.innerHeight-75);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Initialisiert die Steuerung
 */
const initControls = () => {
    mouseControls = new MyMouseControls(camera, document); //init Maussteuerung
    keyControls = new MyKeyboardControls(collidableList, cameraCollidable, document, spieler); //init Keyboardsteuerung
    connect();
}

/**
 * Initialisiert die Interaktionen
 */
const initInteractions = () => {
    interactions = new Interactions(interactableList, cameraCollidable, document, stompClient);
    interaktionText = document.getElementById("interaktionText");
    schluesselText = document.getElementById("schluesselText")
}


/**
* Initialisiert den InGame-Chat
*/
const initChat = () => {
    subscribeChat(lobbystate.lobbyID, ChatTyp.INGAME);

    const chat = document.getElementById("Chat");
    const chatButton = document.getElementById("ChatButton");

    if (chat != null && chatButton != null) {
        const btn = document.createElement("button");
        btn.id = "CloseButton";
        btn.innerHTML = "x";
        btn.onclick = function () {
            closeChat(chat, chatButton);
        };
        chat.appendChild(btn);

        chatButton.onclick = function () {
            openChat(chat, chatButton);
        };
        closeChat(chat, chatButton);
    }
}

/**
 * Verbindet die Eingabe-Controller und und schließt das Spielunterbrechungsfenster
 */
const connect = () => {
    window.addEventListener('click', mouseControls.lock); //locked die Maus     

    keyControls.connect();
    mouseControls.connect();

    const pauseFenster = document.getElementById('pause');
    if (pauseFenster != null) {
        pauseFenster.style.display = "none";
    }

    const zielFenster = document.getElementById('ziel');
    if (zielFenster != null) {
        zielFenster.style.display = "none";
    }
}

/**
 *  Trennen aller Controller und öffnen des Spielunterbrechungsfenster 
 */
const disconnect = () => {
    disconnectController();
    //TODO: unsubscirben wenn man das Spiel wirklich verlaesst
    //unsubscribeChat();
    //interactions.disconnect();
    window.removeEventListener('click', mouseControls.lock);
    interactions.keyDisconnect();
}

/**
 * Trennt die Verbindung zu den Eingabe-Controllern (Maus und Tastatursteuerung)
 * Getrennt von disconnect ausgeführt, da man die interactions sonst verliert
 */
const disconnectController = (element?: string) => {
    mouseControls.dispose();
    keyControls.disconnect();

    const pauseFenster = document.getElementById('pause');
    const zielFenster = document.getElementById('ziel');

    if (element != null) {
        if (element == "ziel" && zielFenster != null) {
            zielFenster.style.display = "";
        }
    } else {
        if (pauseFenster != null && zielFenster != null) {
            if (zielFenster.style.display !== "") {
                pauseFenster.style.display = "";
            }
        }
    }
}


const initPlane = () => {
    const plane = new Three.PlaneGeometry(80, 120);
    const material = new Three.MeshBasicMaterial({color: 0xB4A290, side: Three.DoubleSide});

    meshPlane = new Three.Mesh(plane, material);
    meshPlane.rotateX(1 / 2 * Math.PI)
    // Weil unsere Räume ab (0,0) platziert werden, schieben wir den Boden ein wenig passender hin
    meshPlane.position.x = 20
    meshPlane.position.z = 40
    scene.add(meshPlane);
};

const initRaycaster = () => {
    raycaster = new Three.Raycaster(new Three.Vector3(), new Three.Vector3(0, -1, 0), 0, 10);
}

const initRenderer = () => {
    renderer = new Three.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight - 75);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);
};

const initSkybox = () => {
    // Nach https://codinhood.com/post/create-skybox-with-threejs
    let skyboxGeo;
    let skybox;
    const skyboxImage = 'afterrain';

    function createPathStrings(filename: string) {
        // Alle Textur-Dateien folgen dem gleichen Aufbau, also können wir den Aufbau der URL in einer Schleife machen
        const basePath = `https://raw.githubusercontent.com/codypearce/some-skyboxes/master/skyboxes/${filename}/`;
        const baseFilename = basePath + filename;
        const fileType = '.jpg';
        const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
        return sides.map(side => {
            return baseFilename + '_' + side + fileType;
        });
    }

    function createMaterialArray(filename: string) {
        const skyboxImagepaths = createPathStrings(filename);
        return skyboxImagepaths.map(image => {
            // Lade 6 verschiedene Bilder für jede Seite des Würfels
            const texture = new Three.TextureLoader().load(image);

            return new Three.MeshBasicMaterial({map: texture, side: Three.BackSide});
        });
    }

    function init() {
        const materialArray = createMaterialArray(skyboxImage);

        skyboxGeo = new Three.BoxGeometry(1000, 1000, 1000);
        skybox = new Three.Mesh(skyboxGeo, materialArray);

        skybox.position.x = 0
        skybox.position.y = 0
        skybox.position.z = 0
        scene.add(skybox);
    }

    init();
}

const doAnimate = () => {
    requestAnimationFrame(doAnimate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    mouseControls.update(velocity, delta); // Maus Steuerung
    keyControls.update(camera, velocity, delta) //Tastatur Steuerung
    interactions.update(camera) //Interaktionen

    // Interaktionstext anzeigen, wenn eine Interaktion moeglich ist
    if (interactions.erkannteInteraktion) {
        zeigeInteraktionText(interactions.erkannteInteraktion)
    } else {
        verbergeInteraktionText()
    }

    prevTime = time;

    // developer sicht
    if (developer) {
        // Developer Kamera (Uebersicht)
        renderer.setClearColor(0x000000, 0);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, developerCamera);
        scene.add(cameraCollidable);

        // BoxHelper (geladene Objekte, erstmal nur IntroLevel)
        const material = new Three.Color(0xff0000);
        const boxHelper = new Three.BoxHelper(collidableList[0], material)
        scene.add(boxHelper)

        // Hauptkamera (POV)
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(30, 30, window.innerWidth / 4, window.innerHeight / 4);
        renderer.setViewport(30, 30, window.innerWidth / 4, window.innerHeight / 4);
        renderer.setClearColor(0x222222, 1);
        renderer.render(scene, camera);
        renderer.setScissorTest(false);
    } else {
        renderer.render(scene, camera);
    }

    if (minimap) {
        //// Hauptansicht:
        // Render-Einstellungen der Hauptansicht
        renderer.setClearColor(0x000000, 0);
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        //// Minimapansicht:
        // aktualisiere Position der Karte
        minimapCamera.position.set(spieler.eigenschaften.position.x, minimapCamYPos, spieler.eigenschaften.position.z);

        // aktualisiere Rotation der Karte
        const vector = new Three.Vector3();
        vector.setFromMatrixColumn(camera.matrix, 0);
        vector.crossVectors(camera.up, vector);
        const spher = new Three.Spherical();
        spher.setFromVector3(vector);
        minimapCamera.rotation.set(minimapCamera.rotation.x, minimapCamera.rotation.y, spher.theta + Math.PI);

        // aktualisiere Position des Markers
        minimapMarker.position.set(spieler.eigenschaften.position.x, minimapCamYPos - 1, spieler.eigenschaften.position.z);

        // Minimap Hintergrund (Outline)
        renderer.setScissorTest(true);
        renderer.setScissor(window.innerWidth - minimapWidth - 30 - 3, 30 - 3, minimapWidth + 6, minimapHeight + 6);
        renderer.setClearColor(new Three.Color("rgb(50, 50, 50)"), 1); // Outline-Farbe
        renderer.clearColor();

        // Render-Einstellungen der Minimapansicht
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(window.innerWidth - minimapWidth - 30, 30, minimapWidth, minimapHeight);
        renderer.setViewport(window.innerWidth - minimapWidth - 30, 30, minimapWidth, minimapHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.render(scene, minimapCamera);
        renderer.setScissorTest(false);
    } else {
        renderer.render(scene, camera);
    }
    spieler.eigenschaften.position.x = Math.round(camera.position.x * 100) / 100;
    spieler.eigenschaften.position.z = Math.round(camera.position.z * 100) / 100;
};

/**
 * Stoppt die Animationsschleife
 */
const stopAnimate = () => {
    cancelAnimationFrame(requestID);
    console.log("gameEngine.stopAnimate(): Animation erfolgreich gestoppt.");
}

/**
 * Startet die Animationsschleife und speichert die requestID,
 * die bentigt wird um den Prozess wieder zu stoppen.
 */
const startAnimate = () => {
    requestID = requestAnimationFrame(doAnimate);
    doAnimate();
}

const clearMapContent = () => {
    collidableList = new Array<Three.Object3D>();
    interactableList = new Array<Three.Object3D>();
    mitspieler3dObjektListe = new Map<string, Three.Object3D>();
    interagierbar3dObjektListe = new Map<string, Three.Object3D>();
    console.log("Mapstate: cleared");
}

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

/**
 * Setzt das Mitspieler 3d Objekt eines Mitspielers auf die richtige Position.
 *
 * @param spieler neu zu Positionierender Mitspieler.
 */
function setzeMitspielerAufPosition(mitspieler: Spieler) {
    const objektInScene = mitspieler3dObjektListe.get(mitspieler.name);

    if(objektInScene){
        objektInScene.position.x = 1 * mitspieler.eigenschaften.position.x;
        objektInScene.position.z = 1 * mitspieler.eigenschaften.position.z;
    }
}

/**
 * 
 * @param anzSchluessel anzahl der Schluessel in der Lobby
 * 
 * @param koordinaten koorinaten des Schlüssels der verschindet
 */
function setzteSchluesselAnz(anzSchluessel: number, koordinaten: string) {
    gamestate.anzSchluessel = anzSchluessel;
    console.log("GAMESTATE ANZ: " + gamestate.anzSchluessel)
    if(schluesselText){
        schluesselText.textContent = " x " + anzSchluessel;
        schluesselText.style.display = "block";
    }

    const removeObject = interagierbar3dObjektListe.get(koordinaten);
    console.log("DAS OBJECT MUSS WEG:")
    console.log(removeObject);

    if(removeObject){
        for (const interagierObj of interactableList) {
            if (removeObject.id === interagierObj.id) {
                console.log("Remove gefunden " + interagierObj)
                const index = interactableList.indexOf(interagierObj)
                if (index > -1) {
                    interactableList.splice(index, 1)
                }

            }
        }
        removeObject.parent?.remove(removeObject);
    } else {
        console.log("gameEndine.setzeSchluesselAnz: Zu entfernenden Schluessel nicht gefunden")
    }
}

/**
 * Methode zum öffnen der Tür, da wir die Tür nicht von der Braunen Wand trennen
 * könnten, lassen wir sie jetzt doch nur verschinden.
 * 
 * @param anzSchluessel anzahl der Schlüssel
 * @param koordinaten koorinaten der Tür
 * 
 * 
*/
function oeffneTuer(anzSchluessel: number, koordinaten: string) {
    gamestate.anzSchluessel = anzSchluessel;
    console.log("GAMESTATE ANZ: " + gamestate.anzSchluessel)
    if(schluesselText){
        schluesselText.textContent = " x " + anzSchluessel;
        schluesselText.style.display = "block";
    }

    const tuer = interagierbar3dObjektListe.get(koordinaten);
    console.log("DAS OBJECT MUSS AUF GEHEN:")
    console.log(tuer);
    if(tuer){
        tuer.rotation.x = Math.PI / 2;
    }
}

/**
 * Methode zum setzten des "Kein Schlueseel Textes"
 */
function setzteWarnText() {
    if(schluesselText){
        schluesselText.textContent = "Ihr habt noch keinen Schlüssel!";
        schluesselText.style.display = "block";
    }
}

function openChat(chat: HTMLElement, chatButton: HTMLElement) {
    chat.style.display = "block";
    chatButton.style.display = "none";
}

function closeChat(chat: HTMLElement, chatButton: HTMLElement) {
    chat.style.display = "none";
    chatButton.style.display = "block";
}

export function useGameEngine() {
    return {
        oeffneTuer,
        setzteSchluesselAnz,
        setzteWarnText,
        setzeMitspielerAufPosition,
        initScene,
        initLoader,
        initCamera,
        initPlane,
        initSkybox,
        initRaycaster,
        initRenderer,
        initControls,
        initInteractions,
        initChat,
        startAnimate,
        stopAnimate,
        clearMapContent,
        connect, disconnect, disconnectController,
        setContainer,
        scene,
        gamestate
    }
}
