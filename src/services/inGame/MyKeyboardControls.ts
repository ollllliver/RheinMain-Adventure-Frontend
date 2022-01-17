import { Euler, Vector3, EventDispatcher, Raycaster, Mesh} from 'three';
import { SpielerLokal } from '../../models/SpielerLokal';
import { Camera } from "three/src/cameras/Camera";
import { useGameEngine } from "@/services/inGame/gameEngine";


const direction = new Vector3();

/**
 * Verwertet Tastatureingaben
 */
export class MyKeyboardControls {

    domElement: Document
    update: (cameraPosition: any, velocity: typeof Vector3, delta: number) => void;
    cameraCollidable: typeof Mesh;
    collidableList: any;
    rayCaster: any;
    connect: () => void;
    disconnect: () => void;


    constructor(collidableList: any, cameraCollidable: typeof Mesh, domElement: Document, spieler: SpielerLokal) {

        const velocity = new Vector3();

        this.domElement = domElement;
        this.cameraCollidable = cameraCollidable;
        this.collidableList = collidableList;

        /**
		 * Wird ausgelöst wenn eine Taste gedrückt wird
         * @param event Taste die gedrückt wurde
		 */
        const onKeyDown = (event: KeyboardEvent) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    spieler.moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    spieler.moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    spieler.moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    spieler.moveRight = true;
                    break;

                case 'Space':
                    spieler.moveUp = true;
                    // if ( canJump === true ) velocity.y += 350;
                    // canJump = false;
                    break;

                case 'ShiftLeft':
                    spieler.moveDown = true;
                    break;
            }

        };

        /**
		 * Wird ausgelöst wenn eine Taste losgelassen wird
         * @param event Taste die losgelassen wurde
		 */
        const onKeyUp = (event: KeyboardEvent) => {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW':
                    spieler.moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    spieler.moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    spieler.moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    spieler.moveRight = false;
                    break;
                case 'Space':
                    spieler.moveUp = false;
                    // if ( canJump === true ) velocity.y += 350;
                    // canJump = false;
                    break;
                case 'ShiftLeft':
                    spieler.moveDown = false;
                    break;
                case 'Escape':
                    console.log("MyKeyboardControls.onKeyUp: ESCAPE")
                    useGameEngine().disconnect();
                    break;

            }
        }

        /**
         * Listener für 'keydown' und 'keyup' werden gesetzet
         */
        this.connect = () => {
            this.domElement.addEventListener('keydown', onKeyDown),
            this.domElement.addEventListener('keyup', onKeyUp)
            // console.log("MyKeyboardControls.connect: Tastatursteuerung connected")
        };

        /**
         * Listener für 'keydown' und 'keyup' werden entfernt
         */
        this.disconnect = () => {
            this.domElement.removeEventListener('keydown', onKeyDown),
            this.domElement.removeEventListener('keyup', onKeyUp)
            // console.log("MyKeyboardControls.disconnect: Tastatursteuerung disconnected")
        };

        const collisionDetection = (blickVektor:any, originPoint: any) => {

            // TODO: Raycasting nur wenn Taste gedrueckt bzw mit Maus umgeschaut wird und in Intervallen checken, nicht jedes Frame (PERFORMANCE)
            // TODO: Springen und crouchen auch testen

            this.rayCaster.set(originPoint, blickVektor);

            // // Blickhelper fuer Blickrichtung der Collisiondetection, braucht scene uebergabe in constructor....
            // const arrowHelper = new ArrowHelper( blickVektor, originPoint, 1, 0xffff00 );
            // scene.add( arrowHelper )

            const collisionResult = this.rayCaster.intersectObjects( collidableList);
            if (collisionResult.length > 0 && collisionResult[0].distance < this.cameraCollidable.geometry.attributes.position.count){
                return true
            }
            return false
        }


        this.update = (camera: any, velocity: any, delta: number) => {

            direction.z = Number(spieler.moveForward) - Number(spieler.moveBackward);
            direction.x = Number(spieler.moveRight) - Number(spieler.moveLeft);
            direction.y = Number(spieler.moveDown) - Number(spieler.moveUp);
            direction.normalize(); // this ensures consistent movements in all directions

            const speed = 50.0; //geschwindigkeit der camera

            // cameraCollidable immer mit Kamera updaten
            this.cameraCollidable.position.set(camera.position.x,camera.position.y, camera.position.z)
            // cameraCollidable ist Object3D (siehe Mesh) bestehend aus:
            // - BoxGeometry(Buffergeometry bestehend aus BufferAttribute)
            // - single oder Array von Material(MeshBasicMaterial)

            // Positionsvariable benoetigt zum berechnen der (Blickrichtung der Kamera fuer) CollisionDetection
            const originPoint = this.cameraCollidable.position.clone(); // position in SPielfeld
            // cameraCollidable.                        arbeitet auf Mesh

            // cameraCollidable.geometry.               arbeitet auf Buffergeometry
            // cameraCollidable.geometry.attributes.    arbeitet auf Bufferattribute



            // Blickrichtung cameraCollidable an KameraBlickrichtung anpassen
            // nimmt punkt auf den Kamera schaut (von 0,0,0) und addiert aktuelle Position der Kamera drauf
            const blickRichtung = new Vector3(0,0,-1).applyQuaternion(camera.quaternion)

            const blickRichtungCubePos = blickRichtung.clone().add(camera.position)
            cameraCollidable.lookAt(blickRichtungCubePos)

            // 90 Grad Winkel
            // vorne ist einfach die Blickrichtung
            const links = Math.PI / 2;
            const hinten = Math.PI;
            const rechts = (3*Math.PI)/2;

            const drehVektor = new Vector3(0,1,0); // um Y-Achse drehen (y-achse geht nach oben)

            const vorneVektor = blickRichtung.clone()
            const linksVektor = vorneVektor.clone().applyAxisAngle(drehVektor, links)
            const hintenVektor = vorneVektor.clone().applyAxisAngle(drehVektor, hinten)
            const rechtsVektor = vorneVektor.clone().applyAxisAngle(drehVektor, rechts)


            // 45 grad winkel EXTRA SICHER, muss aber nicht da
            // const vorneLinks = Math.PI / 4;
            // const vorneRechts = (7*Math.PI)/4;
            // const hintenLinks = (3*Math.PI)/4
            // const hintenRechts = (5*Math.PI)/4
            // const vorneLinksV = blickRichtung.clone().applyAxisAngle(drehVektor, vorneLinks)
            // const vorneRechtsV = blickRichtung.clone().applyAxisAngle(drehVektor, vorneRechts)
            // const hintenLinksV = blickRichtung.clone().applyAxisAngle(drehVektor, hintenLinks)
            // const hintenRechtsV = blickRichtung.clone().applyAxisAngle(drehVektor, hintenRechts)


            this.rayCaster = new Raycaster(originPoint,vorneVektor,0,1);
            const vorneCollision = collisionDetection(vorneVektor,originPoint);
            const hintenCollision = collisionDetection(hintenVektor,originPoint);
            const linksCollision = collisionDetection(linksVektor,originPoint);
            const rechtsCollision = collisionDetection(rechtsVektor,originPoint);


            //console.log(vorneCollision,hintenCollision,linksCollision,rechtsCollision)

            // x rot, y gelb, z blau

            if ((spieler.moveForward && !vorneCollision) || (spieler.moveBackward && !hintenCollision)){
                velocity.z -= direction.z * speed * delta;
                // spieler.updatePosition(spieler.position); //schickt via Stomp die Position des lokalen Spielers an das Backend
            }
            if ((spieler.moveLeft&& !linksCollision ) || (spieler.moveRight&& !rechtsCollision )){
                velocity.x -= direction.x * speed * delta;
                // spieler.updatePosition(spieler.position); //schickt via Stomp die Position des lokalen Spielers an das Backend
            }
            if (spieler.moveUp || spieler.moveDown){
                velocity.y -= direction.y * speed * delta;
                // spieler.updatePosition(spieler.position); //schickt via Stomp die Position des lokalen Spielers an das Backend
            }
            if (velocity.z != 0 || velocity.x != 0 || velocity.y != 0){ //solange der Spieler eine Geschwindigkeit hat, wird die Spielerposition geupdated
                spieler.updatePosition(spieler.position); //schickt via Stomp die Position des lokalen Spielers an das Backend
                //TODO update Velocity an Backend
            }


            // Nicht in Wand haengenbleiben, ist man halt ein Gummi Mensch
            if ((spieler.moveForward && vorneCollision) || (spieler.moveBackward && hintenCollision))
                velocity.z += direction.z * speed * delta;
            if ((spieler.moveLeft&& linksCollision ) || (spieler.moveRight&& rechtsCollision ))
                velocity.x += direction.x * speed * delta;

        };

    }
}
