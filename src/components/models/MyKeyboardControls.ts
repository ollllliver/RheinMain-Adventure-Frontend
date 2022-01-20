import {Vector3, Raycaster, ArrowHelper} from 'three';

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


    constructor(collidableList: any, cameraCollidable: any, domElement: Document) {

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


        const connect = () => {
            this.domElement.addEventListener('keydown', onKeyDown),
                this.domElement.addEventListener('keyup', onKeyUp)
        };

        const disconnect = () => {
            this.domElement.removeEventListener('keydown', onKeyDown),
                this.domElement.removeEventListener('keyup', onKeyUp)
        };

        const collisionDetection = (blickVektor:any, originPoint: any) => {

            // TODO: (EXTRA) Raycasting nur wenn Taste gedrueckt bzw mit Maus umgeschaut wird und in Intervallen checken, nicht jedes Frame (PERFORMANCE)
            // TODO: Springen und crouchen ueberhaupt noch einbauen ?

            // Raycaster nur updaten anstatt immer neu zu bauen (performance)
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

            const speed = 50.0; //Geschwindigkeit der Kamera

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
            // Nimmt Punkt auf den Kamera schaut (von 0,0,0) und addiert aktuelle Position der Kamera drauf 
            const blickRichtung = new Vector3(0,0,-1).applyQuaternion(camera.quaternion)
            
            const blickRichtungCubePos = blickRichtung.clone().add(camera.position) 
            cameraCollidable.lookAt(blickRichtungCubePos)
            
            // 90 Grad Winkel 
            // vorne ist einfach die Blickrichtung
            const links = Math.PI / 2;
            const hinten = Math.PI;
            const rechts = (3*Math.PI)/2;

            // um Y-Achse drehen (y-achse geht nach oben)
            const drehVektor = new Vector3(0,1,0); 

            const vorneVektor = blickRichtung.clone().setComponent(1,0);
            const linksVektor = vorneVektor.clone().applyAxisAngle(drehVektor, links)
            const hintenVektor = vorneVektor.clone().applyAxisAngle(drehVektor, hinten)
            const rechtsVektor = vorneVektor.clone().applyAxisAngle(drehVektor, rechts)

            this.rayCaster = new Raycaster(originPoint,vorneVektor,0,1);
            const vorneCollision = collisionDetection(vorneVektor,originPoint);
            const hintenCollision = collisionDetection(hintenVektor,originPoint);
            const linksCollision = collisionDetection(linksVektor,originPoint);
            const rechtsCollision = collisionDetection(rechtsVektor,originPoint);
            
            // Axishelper Farben: x rot, y gelb, z blau
    
            if ((this.moveForward && !vorneCollision) || (this.moveBackward && !hintenCollision))
                velocity.z -= direction.z * speed * delta;    
            if ((this.moveLeft&& !linksCollision ) || (this.moveRight&& !rechtsCollision ))
                velocity.x -= direction.x * speed * delta;
            if (this.moveUp || this.moveDown)
                velocity.y -= direction.y * speed * delta;


            // Nicht in Wand haengenbleiben, man bounced leicht ab (speed einfach auf 1 gesetzt)
            if ((this.moveForward && vorneCollision) || (this.moveBackward && hintenCollision))
                velocity.z += direction.z * 1 * delta; 
            if ((this.moveLeft&& linksCollision ) || (this.moveRight&& rechtsCollision ))
                velocity.x += direction.x * 1 * delta;


        };



        connect();

    }


}