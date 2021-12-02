<template>
  <div id="container"></div>
  
</template>

<script lang="ts">
import * as Three from "three";
import { defineComponent, onMounted } from "vue";
import {Loader} from './models/Loader'

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
    let canJump = false;                                        

    let controls = {};
    let player = {
      height: .5,
      turnSpeed: .1,
      speed: .1,
      jumpHeight: .2,
      gravity: .01,
      velocity: 0,
      
      playerJumps: false
    };

    let prevTime = performance.now();
		const velocity = new Three.Vector3();
		const direction = new Three.Vector3();

    onMounted(() => {
      container = document.getElementById("container");
      initScene();
      initLoader();
      initCamera();
      initPlane();
      initCube();
      initRaycaster();
      initRenderer();
      control();
      // onKeyDown();
      // onKeyUp();
      doAnimate();
      //doKeyMovement();
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

    const initCamera = () => {
      camera = new Three.PerspectiveCamera(50,window.innerWidth / window.innerHeight,0.1,window.innerHeight);
      camera.position.set(0, player.height, -5);
      camera.lookAt(new Three.Vector3(0, player.height, 0));
    };

    const initPlane = () => {
      let plane = new Three.PlaneGeometry(5, 5, 1, 1);
      let material = new Three.MeshBasicMaterial();

      meshPlane = new Three.Mesh(plane, material);
      meshPlane.position.z = -2
      rotateObject(meshPlane, -70, 0, 0);
      moveObject(meshPlane, 0, 1, 0);
      //scene.add(meshPlane);
    };


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
/*
     const initControls = () => {
       controls = new OrbitControls(camera, renderer.domElement);
      
       camera.position.set( 0, 100, 500 );
       controls.update();
     };*/

    document.addEventListener('keydown', ({ keyCode }) => { controls[keyCode] = true });
    document.addEventListener('keyup', ({ keyCode }) => { controls[keyCode] = false });

    const control = () => {
      // Controls:Engine 
      if(controls[87]){ // w
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
        console.log("Vorne")
        
      }
      if(controls[83]){ // s
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
      }
      if(controls[65]){ // a
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
      }
      if(controls[68]){ // d
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
      }
      if(controls[37]){ // la
        camera.rotation.y -= player.turnSpeed;
      }
      if(controls[39]){ // ra
        camera.rotation.y += player.turnSpeed;
      }
      if(controls[32]) { // space
        // if(player.jumps) return false;
        // player.jumps = true;
        // player.velocity = -player.jumpHeight;
      }
    }

    const ixMovementUpdate = () => {
      player.velocity += player.gravity;
      camera.position.y -= player.velocity;
      
      if(camera.position.y < player.height) {
        camera.position.y = player.height;
       // player.jumps = false;
      }
    }

    const update = () => {
      control();
      ixMovementUpdate();
    }




    const doAnimate = () => {
      requestAnimationFrame(doAnimate);
      meshCube.rotation.x += 0.01;
      meshCube.rotation.y += 0.02;

      const time = performance.now();
      update();

      // if (controls.isLocked === true) {
      //   const time = performance.now();
      //   raycaster.ray.origin.copy( controls.getObject().position );
      //   raycaster.ray.origin.y -= 10;

      //   const delta = ( time - prevTime ) / 1000;
      //   velocity.x -= velocity.x * 10.0 * delta;
			// 	velocity.z -= velocity.z * 10.0 * delta;

      //   direction.z = Number( moveForward ) - Number( moveBackward );
      //   direction.x = Number( moveRight ) - Number( moveLeft );
      //   direction.normalize();

      //   if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
			// 	if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

      //   controls.moveRight( - velocity.x * delta );
			// 	controls.moveForward( - velocity.z * delta );

      //   prevTime = time;
			// 	renderer.render( scene, camera );
      // }

      renderer.render(scene, camera);
    };

    const doKeyMovement = () => {
      let speed = 100;
      window.addEventListener("keypress", (e) => {
        switch (e.key) {
          case "w":
            camera.position.z -= degInRad(speed);
            console.log("Gehe nach vorne");
            break;
          case "a":
            camera.position.x -= degInRad(speed);
            console.log("Gehe nach links");
            break;
          case "s":
            camera.position.z += degInRad(speed);
            console.log("Gehe nach hinten");
            break;
          case "d":
            camera.position.x += degInRad(speed);
            console.log("Gehe nach rechts");
            break;
          case "e":
            camera.rotation.y -= degInRad(speed);
            console.log("Drehe nach links");
            break;
          case "q":
            camera.rotation.y += degInRad(speed);
            console.log("Drehe nach rechts");
            break;
          case "Enter":
            console.log(e.key + " gedrückt");
            break;
          case "Esc":
          case "Escape":
            console.log(e.key + " gedrückt");
            break;
          case " ":
            console.log(e.key + " gedrückt");
            break;
          default:
            console.log(e.key + " gedrückt (keinem Befehl zugewiesen)");
        }
      });
    };

    function degInRad(deg: number) {
      return (deg * Math.PI) / 90;
    }

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
