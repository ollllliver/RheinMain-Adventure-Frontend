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
    collisionDetected: boolean;
    collidableList: any;


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
        this.collisionDetected = false;
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

            
            
                // Ziel also letztendlich blickwinkel und cube nur auf x achse drehen sodass pfeile direction immer richtig sind, nicht wenn nach unten schauen dann in wand glitchen...

            // TODO Raycaster rausziehen, nicht jeden Frame neu erstellen
                //rayCaster.ray.origin.copy(originPoint);
                //originPoint.getWorldDirection(rayCaster.ray.direction)
            const rayCaster = new Raycaster(originPoint, blickVektor);

            const collisionResult = rayCaster.intersectObjects( collidableList);
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
            
            // Mittelpunkt cameraCollidable ??? NICHT! 
            // const position = this.cameraCollidable.geometry.attributes.position; // 
            
            // cameraCollidable.geometry.               arbeitet auf Buffergeometry
            // cameraCollidable.geometry.attributes.    arbeitet auf Bufferattribute 

            // Wie breit soll der Radius der Collisiondetection sein
            const fatness = 5;

            


            // Blickrichtung cameraCollidable an KameraBlickrichtung anpassen
            // nimmt punkt auf den Kamera schaut (von 0,0,0) und addiert aktuelle Position der Kamera drauf 
            const blickRichtung = new Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position) 
            cameraCollidable.lookAt(blickRichtung)
            

            // Blickhelper fuer Blickrichtung der Collisiondetection, braucht scene uebergabe in constructor....
            // const length = 1;
            // const hex = 0xffff00;
            // const arrowHelper = new ArrowHelper( camera.quaternion, camera.position, length, hex );
            // scene.add( arrowHelper )


            
            // 90 Grad Winkel 
            // vorne ist einfach die Blickrichtung
            const links = Math.PI / 2;
            const hinten = Math.PI;
            const rechts = (3*Math.PI)/2;

            const drehVektor = new Vector3(0,1,0); // um Y-Achse drehen (y-achse geht nach oben)
            

            const vorneVektor = blickRichtung.clone()
            const rechtsVektor = blickRichtung.clone().applyAxisAngle(drehVektor, links)
            const hintenVektor = blickRichtung.clone().applyAxisAngle(drehVektor, hinten)
            const linksVektor = blickRichtung.clone().applyAxisAngle(drehVektor, rechts)

            // 45 grad winkel 
            // const vorneLinks = Math.PI / 4;
            // const vorneRechts = (7*Math.PI)/4;
            // const hintenLinks = (3*Math.PI)/4
            // const hintenRechts = (5*Math.PI)/4
            // const vorneLinksV = blickRichtung.clone().applyAxisAngle(drehVektor, vorneLinks)
            // const vorneRechtsV = blickRichtung.clone().applyAxisAngle(drehVektor, vorneRechts)
            // const hintenLinksV = blickRichtung.clone().applyAxisAngle(drehVektor, hintenLinks)
            // const hintenRechtsV = blickRichtung.clone().applyAxisAngle(drehVektor, hintenRechts)

            
            
            //const blickLinks = blickRichtung.clone().add(new Vector3(0,0,fatness))
            
            //Collision Berechnung (erstmal nur in vier Richtungen)

            // const vorneCollision = collisionDetection(new Vector3(0,0,fatness),camera.position,position);
            // const hintenCollision = collisionDetection(new Vector3(0,0,-fatness),originPoint,position);
            // const linksCollision = collisionDetection(new Vector3(fatness,0,0),originPoint,position);
            // const rechtsCollision = collisionDetection(new Vector3(-fatness,0,0),originPoint,position);

            const vorneCollision = collisionDetection(vorneVektor,originPoint);
            // const blickRichtung = new Vector3(0,0,-1).applyQuaternion(camera.quaternion)//.add(camera.position)
            // const origin = camera.position;
            

            const hintenCollision = collisionDetection(hintenVektor,originPoint);
            const linksCollision = collisionDetection(linksVektor,originPoint);
            const rechtsCollision = collisionDetection(rechtsVektor,originPoint);

            // const blickRichtung = new Three.Vector3(0,0,-1).applyQuaternion(camera.quaternion)//.add(camera.position)
            // const origin = camera.position;
            // const length = 1;
            // const hex = 0xffff00;
            // const arrowHelper = new Three.ArrowHelper( blickRichtung, origin, length, hex );


            this.collisionDetected = false;
            
            

            // Versuch durch Eckpunkte durchzugehen, funktioniert soweit, nur wenn einmal gegen Wand, dann haengenbleiben...
                // const anzahlEckpunkte = this.cameraCollidable.geometry.attributes.position.count // 24
                // const vektorLaenge = this.cameraCollidable.geometry.attributes.position.itemSize // 3
                // const anzahlPaare = anzahlEckpunkte/vektorLaenge
                // const vektorWerte = this.cameraCollidable.geometry.attributes.position.array // 8*3 = 24
                // // console.log(this.cameraCollidable.geometry.attributes.position.array)
                // // console.log(this.cameraCollidable.geometry.attributes.position.array[0])
                // //8 punkte herausziehen so dass nutzbar fuer collision detection
                // // sobald einer von den sagt getroffen==> COLLISION
                // const vektorWertAuszug = new Vector3();
                // vektorWertAuszug.x = vektorWerte
                // // const mittelpunktCollisionCube = this.cameraCollidable.geometry.attributes.position;
                //     for (let i = 0; i < anzahlPaare; i++) { // 8
                //         // for (let j = i*3; j > j-3; j--){
                //         if (i == 0){
                //             vektorWertAuszug.x = vektorWerte[0]
                //             vektorWertAuszug.y = vektorWerte[1]
                //             vektorWertAuszug.z = vektorWerte[2]
                //         }else{
                //             vektorWertAuszug.x = vektorWerte[i*3]
                //             vektorWertAuszug.y = vektorWerte[i*3+1]
                //             vektorWertAuszug.z = vektorWerte[i*3+2]
                //         }
                //         // HIER ueberpruefen originPoint und vektor
                //         vektorWertAuszug.add(originPoint)
                //         const ray = new Raycaster(originPoint, vektorWertAuszug.clone());
                //         const collisionResult = ray.intersectObjects( collidableList);
                //         if (collisionResult.length > 0 && collisionResult[0].distance < mittelpunktCollisionCube.count){
                //             this.collisionDetected = true;
                //         }else{
                //             this.collisionDetected = false;
                //         }
                //     }


            console.log(vorneCollision,hintenCollision,linksCollision,rechtsCollision)

            // x rot, y gelb, z blau
    
            if ((this.moveForward && !vorneCollision) || (this.moveBackward && !hintenCollision))
                velocity.z -= direction.z * speed * delta;    
            if ((this.moveLeft&& !linksCollision ) || (this.moveRight&& !rechtsCollision ))
                velocity.x -= direction.x * speed * delta;
            if (this.moveUp || this.moveDown)
                velocity.y -= direction.y * speed * delta;


            // Test Nicht in Wand haengen mit velocity
            if ((this.moveForward && vorneCollision) || (this.moveBackward && hintenCollision))
                velocity.z += direction.z * speed * delta; 
            if ((this.moveLeft&& linksCollision ) || (this.moveRight&& rechtsCollision ))
                velocity.x += direction.x * speed * delta;
            
            
            
            

            // if ((this.moveForward && !vorneCollision ) || (this.moveBackward && !hintenCollision))
            //     velocity.z -= direction.z * speed * delta;                
            // if ((this.moveLeft&& !linksCollision ) || (this.moveRight&& !rechtsCollision ))
            //     velocity.x -= direction.x * speed * delta;
            // if (this.moveUp || this.moveDown)
            //     velocity.y -= direction.y * speed * delta;
            

            // Versuch mit Eckpunkten, nur bleibt man haengen sobal einmal collision erkannt...
            // if ((this.moveForward && !this.collisionDetected ) || (this.moveBackward && !this.collisionDetected ))
            //     velocity.z -= direction.z * speed * delta;                
            // if ((this.moveLeft && !this.collisionDetected ) || (this.moveRight && !this.collisionDetected ))
            //     velocity.x -= direction.x * speed * delta;
            // if (this.moveUp || this.moveDown)
            //     velocity.y -= direction.y * speed * delta;
            


        };



        connect();

    }


}