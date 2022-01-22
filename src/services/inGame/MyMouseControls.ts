import { Euler, Vector3, EventDispatcher } from 'three';
import { Camera } from "three/src/cameras/Camera";
import * as Three from "three";
import { useGameEngine } from './gameEngine';


const _euler = new Euler(0, 0, 0, 'YXZ');
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

/**
 * Verwertet Mauseingaben 
 */
class MyMouseControls extends EventDispatcher {

	constructor(camera: Camera, owner: Document) {

		super();

		if (owner.body === undefined) {

			console.warn('THREE.PointerLockControls: The second parameter "domElement" is now mandatory.');
			owner = document;

		}

		this.domElement = owner.body;
		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		const onMouseMove = (event: MouseEvent) => {

			if (this.isLocked === false) return;

			const movementX = event.movementX;
			const movementY = event.movementY;

			_euler.setFromQuaternion(camera.quaternion);

			_euler.y -= movementX * 0.002;
			_euler.x -= movementY * 0.002;

			_euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x));

			camera.quaternion.setFromEuler(_euler);

			this.dispatchEvent(_changeEvent);

		}

		const onPointerlockChange = () => {

			if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {

				this.dispatchEvent(_lockEvent);

				this.isLocked = true;
				// console.log("MyMouseControls.onPointerlockChange: isLocked - "+ this.isLocked)

			} else {

				this.dispatchEvent(_unlockEvent);

				this.isLocked = false;
				useGameEngine().disconnectController();
				// console.log("MyMouseControls.onPointerlockChange: isLocked - "+ this.isLocked)

			}
			
		}

		function onPointerlockError() {
			console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
		}

		/**
		 * Achtet auf Änderungen Maus
		 */
		this.connect = function () {
			this.domElement.ownerDocument.addEventListener('mousemove', onMouseMove);
			this.domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
			this.domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);
			// console.log("### MyMouseControls.connect: mouse controls connected")


		};

		/**
		 * Achtet nicht mehr auf Änderungen Maus
		 */
		this.disconnect = function () {
			this.unlock();
			this.domElement.ownerDocument.removeEventListener('mousemove', onMouseMove);
			this.domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
			this.domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError);
			// console.log("### MyMouseControls.disconnect: mouse controls disconnected")


		};

		this.dispose = function () {

			this.disconnect();

		};

		this.getObject = function () { // retaining this method for backward compatibility

			return camera;

		};

		this.getDirection = function () {

			const direction = new Vector3(0, 0, - 1);

			return function (v) {

				return v.copy(direction).applyQuaternion(camera.quaternion);

			};

		}();


		/**
		 * Beweget die Kamera nach vorne
		 * @param distance Wert wie weit die Kamera sich nach vorne bewegt
		 */
		this.moveForward = function (distance:any) {

			// bewegt  parallel zur xz-achse

			_vector.setFromMatrixColumn(camera.matrix, 0);

			_vector.crossVectors(camera.up, _vector);

			camera.position.addScaledVector(_vector, distance);

		};

		/**
		 * Beweget die Kamera nach rechts
		 * @param distance Wert wie weit die Kamera sich nach rechts bewegt
		 */
		this.moveRight = function (distance:any) {

			_vector.setFromMatrixColumn(camera.matrix, 0);

			camera.position.addScaledVector(_vector, distance);

		};

		/**
		 * "Lockt" die Maus 
		 */
		this.lock = () => {
			this.domElement.requestPointerLock();
			console.log("mouse controls: lock")
		};

		/**
		 * Lässt die Maus wieder frei 
		 */
		this.unlock = () => {
			this.domElement.ownerDocument.exitPointerLock();
			console.log("mouse controls: unlock")
		};

		/**
		 * Aktualisiert die Bewegungen
		 */
		this.update = (velocity: any, delta: number) => {
			this.moveRight(-velocity.x * delta);
			this.moveForward(-velocity.z * delta);
			this.getObject().position.y += (velocity.y * delta);
		};

		this.connect();



	}

}

export { MyMouseControls };
