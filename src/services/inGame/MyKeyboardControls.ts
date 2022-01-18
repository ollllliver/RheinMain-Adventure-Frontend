import { Euler, Vector3, EventDispatcher, Raycaster } from 'three';
import { SpielerLokal } from '../../models/SpielerLokal';
import { Camera } from "three/src/cameras/Camera";


const direction = new Vector3();

/**
 * Verwertet Tastatureingaben
 */
export class MyKeyboardControls {

    domElement: Document
    moveForward: boolean
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    moveUp: boolean;
    moveDown: boolean;
    canJump: boolean;
    update: (cameraPosition: any, velocity: any, delta: number) => void;
    cameraCollidable: any;
    collidableList: any;
    rayCaster: any;
    connect: () => void;
    disconnect: () => void;


    constructor(collidableList: any, cameraCollidable: any, domElement: Document, spieler: SpielerLokal) {

        const velocity = new Vector3();

        this.moveForward = false;
        this.domElement = domElement;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.canJump = false;
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
                    this.moveForward = true;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;

                case 'Space':
                    this.moveUp = true;
                    // if ( canJump === true ) velocity.y += 350;
                    // canJump = false;
                    break;

                case 'ShiftLeft':
                    this.moveDown = true;
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
                    this.moveForward = false;
                    break;

                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'Space':
                    this.moveUp = false;
                    // if ( canJump === true ) velocity.y += 350;
                    // canJump = false;
                    break;
                case 'ShiftLeft':
                    this.moveDown = false;
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

            direction.z = Number(this.moveForward) - Number(this.moveBackward);
            direction.x = Number(this.moveRight) - Number(this.moveLeft);
            direction.y = Number(this.moveDown) - Number(this.moveUp);
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

            if ((this.moveForward && !vorneCollision) || (this.moveBackward && !hintenCollision))
                velocity.z -= direction.z * speed * delta;
            if ((this.moveLeft&& !linksCollision ) || (this.moveRight&& !rechtsCollision ))
                velocity.x -= direction.x * speed * delta;
            if (this.moveUp || this.moveDown)
                velocity.y -= direction.y * speed * delta;


            // Nicht in Wand haengenbleiben, ist man halt ein Gummi Mensch
            if ((this.moveForward && vorneCollision) || (this.moveBackward && hintenCollision))
                velocity.z += direction.z * speed * delta;
            if ((this.moveLeft&& linksCollision ) || (this.moveRight&& rechtsCollision ))
                velocity.x += direction.x * speed * delta;

            //Wenn der Spieler keine Geschwindikeit mehr => er nicht mehr am Laufen ist
            if (velocity.x != 0 && velocity.z != 0 && velocity.y){
                spieler.updatePosition(spieler.position); //schickt via Stomp die Position des lokalen Spielers an das Backend
            }

        };
    }
}
