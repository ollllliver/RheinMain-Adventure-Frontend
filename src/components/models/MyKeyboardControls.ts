import { Euler, Vector3, EventDispatcher } from 'three';

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
    update: (velocity: any, delta: number) => void;

    constructor(domElement: Document) {

        const velocity = new Vector3();

        this.moveForward = false;
        this.domElement = domElement;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.canJump = false;

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

        const connect = () => {
            this.domElement.addEventListener('keydown', onKeyDown),
                this.domElement.addEventListener('keyup', onKeyUp)
        };

        const disconnect = () => {
            this.domElement.removeEventListener('keydown', onKeyDown),
                this.domElement.removeEventListener('keyup', onKeyUp)
        };

        /**
         * Aktualisiert die Kameraposition
         */
        this.update = (velocity: any, delta: number) => {

            direction.z = Number(this.moveForward) - Number(this.moveBackward);
            direction.x = Number(this.moveRight) - Number(this.moveLeft);
            direction.y = Number(this.moveDown) - Number(this.moveUp);
            direction.normalize(); // this ensures consistent movements in all directions

            const speed = 50.0; //geschwindigkeit der camera

            if (this.moveForward || this.moveBackward)
                velocity.z -= direction.z * speed * delta;
            if (this.moveLeft || this.moveRight)
                velocity.x -= direction.x * speed * delta;
            if (this.moveUp || this.moveDown)
                velocity.y -= direction.y * speed * delta;

        };
        connect();
    }
}
