import * as Three from "three";
import {defineComponent, onMounted} from "vue";
import {GraphicLoader} from '@/services/inGame/GraphicLoader';
import {MyMouseControls} from '@/services/inGame/MyMouseControls';
import {MyKeyboardControls} from '@/services/inGame/MyKeyboardControls';
import { Interactions } from '@/services/inGame/Interactions';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Wird benutzt fuer Developersicht in bspw. initRenderer
import {SpielerLokal} from '@/models/SpielerLokal';
import { gamebrokerStompclient, subscribeToSpielerPositionenUpdater } from "@/services/inGame/spielerPositionierer";
import { Position } from "@/models/Spieler";



let container: any;
let camera: any;
let cameraCollidable: any;
let scene: any;
let renderer: any;
let meshPlane: any;
let meshCube: any;
let raycaster: any;
const loader = new GraphicLoader();
// let moveForward = false;
// let moveBackward = false;
// let moveLeft = false;
// let moveRight = false;
// let moveUp = false;
// let moveDown = false;
const collidableList: Array<any> = [];
const interactableList: Array<any> = [];
const developer = false;
let developerCamera: any;
let controls: any;

let mouseControls: MyMouseControls;
let keyControls: MyKeyboardControls;
let interactions: Interactions;
let interaktionText: any;

let spieler: SpielerLokal

let prevTime = performance.now();
const velocity = new Three.Vector3();
const direction = new Three.Vector3();

const stompClient = gamebrokerStompclient;

function setContainer(element: HTMLElement|null){
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
 * Initialisiert Loader Klasse
 */



const initLoader = () => {

    // TODO: Level-ID dynamisch bestimmen

    // const { lobbystate } = useLobbyStore()
    // const levelId : number = lobbystate.levelID

    fetch('http://localhost:3000/api/level/1/0', {
    method: 'GET',
    }).then((response) => {
    if (!response.ok) {
        console.log("error");
        return;
    }
    return response.json();

    }).then((RaumMobiliarListe) => {
    console.log(RaumMobiliarListe);
    console.log("Jetzt wird iteriert")
    RaumMobiliarListe.forEach(function (raumMobiliar) {
        // console.log(raumMobiliar)
        const posX = raumMobiliar.positionX;
        const posY = raumMobiliar.positionY;
        // Idee von Olli:
        // In nächster Ausbaustufe 3D Modelle nur 1 mal pro Typ abfragen und dann "mehrfach" platzieren
        // Davor müsste man zu begin ein Set des Mobiliars erstellen

        const mobiliarId: number = raumMobiliar.mobiliar.mobiliarId;
        loader.ladeDatei('http://localhost:3000/api/level/' + mobiliarId).then((res: any) => {
        // console.log(res)
        res.scene.position.x = 1 * posX
        res.scene.position.z = 1 * posY
        collidableList.push(res.scene)
        scene.add(res.scene)
        });
    });
    console.log("Fertig iteriert")
    });
};

/**
 * Initialisiert Kamera
 */
const initCamera = () => {

    stompClient.activate();
    spieler = new SpielerLokal(stompClient);
    subscribeToSpielerPositionenUpdater(stompClient);

    // First Person View inset (camera)
    camera = new Three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, window.innerHeight);
    //camera.position.set(0, player.height, -5);
    camera.position.set(-2, spieler.height * 3, -5);
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
 window.addEventListener('resize', () =>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
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
    interactions = new Interactions(interactableList, cameraCollidable, document);
    interaktionText = document.getElementById("interaktionText");
}

const connect = () => {
    window.addEventListener('click', mouseControls.lock); //locked die Maus
}

const disconnect = () => {
    mouseControls.dispose();
    keyControls.disconnect();
    interactions.disconnect();
    window.removeEventListener('click', mouseControls.lock);
    console.log("Müsste disconnected sein")
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

    loader.ladeDatei('/assets/blender/key.gltf').then((key: any) => {
        const keyModel = key.scene;
        keyModel.children[0].name = "Schluessel";
        keyModel.position.x = -5;
        keyModel.position.y = 0.5;
        keyModel.position.z = -3;
        scene.add(keyModel);
        interactableList.push(keyModel);
    }).catch((e)=>
    console.log('ERROR:',e));
  };


const initRaycaster = () => {
    raycaster = new Three.Raycaster(new Three.Vector3(), new Three.Vector3(0, -1, 0), 0, 10);
}

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

const doAnimate = () => {
    requestAnimationFrame(doAnimate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    //entweder hier oder in MyKeyboardControl
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    mouseControls.update(velocity, delta); //Maus Steuerung
    keyControls.update(camera, velocity, delta) //Tastatur Steuerung
    interactions.update(camera) //Interaktionen

    // Interaktionstext anzeigen, wenn eine Interaktion moeglich ist
    if(interactions.erkannteInteraktion){
        zeigeInteraktionText(interactions.erkannteInteraktion)
    }else{
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
    spieler.position.x = camera.position.x.toFixed(2);
    spieler.position.y = camera.position.y.toFixed(2);
    spieler.position.z = camera.position.z.toFixed(2);

    renderer.render(scene, camera);

};

function zeigeInteraktionText(interaktion:any){
    if(interaktionText != null /*&& interaktionText.style.display == "none"*/){
        interaktionText.textContent = "Interagiere mit " + interaktion.object.name
        interaktionText.style.display = "block"
      }
  }

  function verbergeInteraktionText(){
    if(interaktionText != null /*&& interaktionText.style.display != "none"*/){
        interaktionText.textContent = ""
        interaktionText.style.display = "none"
      }
  }

function setzeMitspielerAufPosition(position: Position){
    loader.ladeDatei('/assets/blender/player.gltf').then((res: any) => {
        // console.log(res)
        res.scene.position.x = 1 * position.x
        res.scene.position.z = 1 * position.z
        scene.add(res.scene)
    }).catch((e)=>
    console.log('ERROR:',e));
}

export function useGameEngine(){
    return {
        setzeMitspielerAufPosition,
        initScene,
        initLoader,
        initCamera,
        initPlane,
        initInteractionTestObject,
        initRaycaster,
        initRenderer,
        initControls,
        initInteractions,
        doAnimate,
        connect, disconnect,
        setContainer,
        scene
    }
}
