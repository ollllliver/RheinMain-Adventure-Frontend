<template>
  <div id="container"></div>
  
</template>

<script lang="ts">
import * as Three from "three";
import { defineComponent, onMounted } from "vue";
import { Loader } from './models/Loader';
import { MyMouseControls } from '@/components/models/MyMouseControls';
import { MyKeyboardControls } from '@/components/models/MyKeyboardControls';


export default defineComponent({
  name: "RenderDemo",
  setup() {

    let container: any;
    let camera: any;
    let scene: any;
    let renderer: any;
    let meshPlane: any;
    let meshCube: any;
    let raycaster: any;
    let loader: Loader;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;

    let mouseControls: MyMouseControls;
    let keyControls: MyKeyboardControls;

    let player = {
      height: .5,
      turnSpeed: .1,
      speed: .1,
      jumpHeight: .2,
      gravity: .01,
      velocity: 0,
      jumps: false,
      ducks: false,
    };

    let prevTime = performance.now();
		let velocity = new Three.Vector3();
		const direction = new Three.Vector3();

    onMounted(() => {
      container = document.getElementById("container");
      initScene();
      initLoader();
      initCamera();
      //initPlane();
      initCube();
      initRaycaster();
      initRenderer();
      initControls();
      doAnimate();
      
    });

    const initScene = () => {
      scene = new Three.Scene();

      var ambientLight = new Three.AmbientLight( 0xcccccc );
      scene.add( ambientLight );
              
      var directionalLight = new Three.DirectionalLight( 0xffffff );
      directionalLight.position.set( 0, 1, 1 ).normalize();
      scene.add( directionalLight );	
    };

    /**
     * Initialisiert Loader Klasse
     */
    const initLoader = () => {
      loader = new Loader();
      console.log(loader)
      loader.ladeDatei('/assets/blender/example.gltf')
      .then((res:any) => {
        // TODO: 
        // Kamera, Steuerung und scene.position der gltf.scene zuweisen (Hier oder in Loader Klasse?)
          //   gltf.scene.scale.set( 20, 20, 20 );			   
          //   gltf.scene.position.x = 0;				   
          //   gltf.scene.position.y = 0;				  
          //   gltf.scene.position.z = 0;		
          //   gltf.controls = controls	
          //   gltf.camera = camera; 
        // vielleicht extra Methode konfiguriere in Loader Klasse und dann hier loader.konfiguere(res.scene)
        console.log(res)
        scene.add(res.scene)
      })
    };

    /**
     * Initialisiert Kamera
     */
    const initCamera = () => {
      camera = new Three.PerspectiveCamera(50,window.innerWidth / window.innerHeight,0.1,window.innerHeight);
      camera.position.set(0, player.height, -5);
      camera.lookAt(new Three.Vector3(0, player.height, 0));
    };

    /**
     * Initialisiert die Steuerung
     */
    const initControls = () => {
      mouseControls = new MyMouseControls(camera, document); //init Maussteuerung
      keyControls = new MyKeyboardControls(document); //init Keyboardsteuerung

      window.addEventListener( 'click', function () { mouseControls.lock(); } ); //locked die Maus
    }

    // const initPlane = () => {
    //   let plane = new Three.PlaneGeometry(5, 5, 1, 1);
    //   let material = new Three.MeshBasicMaterial();

    //   meshPlane = new Three.Mesh(plane, material);
    //   meshPlane.position.z = -2
    //   rotateObject(meshPlane, -70, 0, 0);
    //   moveObject(meshPlane, 0, 1, 0);
    //   //scene.add(meshPlane);
    // };

    const initCube = () => {
      
      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      meshCube = new Three.Mesh(geometry, material);
      meshCube.position.z = -1;
      //scene.add(meshCube);
    };

    const initRaycaster = () => {
      raycaster = new Three.Raycaster( new Three.Vector3(), new Three.Vector3( 0, - 1, 0 ), 0, 10 );
    }

    const initRenderer = () => {
      renderer = new Three.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
    };

    const doAnimate = () => {
      requestAnimationFrame(doAnimate);
      // meshCube.rotation.x += 0.01;
      // meshCube.rotation.y += 0.02;
      //update();
      
      // const time = performance.now();
      // const delta = ( time - prevTime ) / 1000;
      // keyControls.update()(delta);


      
      const time = performance.now();
      const delta=(time-prevTime)/1000;
      //entweder hier oder in MyKeyboardControl
      velocity.x-=velocity.x*10.0*delta;
      velocity.z-=velocity.z*10.0*delta;
      velocity.y-=velocity.y*10.0*delta;

      
      mouseControls.update(velocity, delta); //Maus Steuerung
      keyControls.update(velocity, delta) //Tastatur Steuerung
			prevTime = time;

			renderer.render( scene, camera );
     
    };

    function degInRad(deg: number) {
      return (deg * Math.PI) / 90;
    }

    const onKeyDown = function ( event:KeyboardEvent ) {

					switch ( event.code ) {

						case 'ArrowUp':
						case 'KeyW':
							moveForward = true;
							break;

						case 'ArrowLeft':
						case 'KeyA':
							moveLeft = true;
							break;

						case 'ArrowDown':
						case 'KeyS':
							moveBackward = true;
							break;

						case 'ArrowRight':
						case 'KeyD':
							moveRight = true;
							break;

						case 'Space':
              moveUp=true;
							// if ( canJump === true ) velocity.y += 350;
							// canJump = false;
							break;
            
            case 'ShiftLeft':
							moveDown = true;
							break;

					}

				};

    const onKeyUp = function ( event:KeyboardEvent ) {

      switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
          moveForward = false;
          break;

        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = false;
          break;

        case 'ArrowDown':
        case 'KeyS':
          moveBackward = false;
          break;

        case 'ArrowRight':
        case 'KeyD':
          moveRight = false;
          break;
        case 'Space':
            moveUp = false;
							// if ( canJump === true ) velocity.y += 350;
							// canJump = false;
						break;
            
        case 'ShiftLeft':
						moveDown = false;
						break;

      }

    };

    document.addEventListener( 'keydown', onKeyDown),
    document.addEventListener( 'keyup', onKeyUp),

  
    function rotateObject(mesh: any, degreeX = 0, degreeY = 0, degreeZ = 0) {
      mesh.rotateX(Three.Math.degToRad(degreeX));
      mesh.rotateY(Three.Math.degToRad(degreeY));
      mesh.rotateZ(Three.Math.degToRad(degreeZ));
    }

    function moveObject(mesh: any, moveX = 0, moveY = 0, moveZ = 0) {
      mesh.position.x -= Math.min(moveX);
      mesh.position.y -= Math.min(moveY);
      mesh.position.z -= Math.min(moveZ);
    }
  },
});
</script>

<style scoped>
</style>
