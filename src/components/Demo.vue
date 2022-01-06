<template>
  <div id="container"></div>
  
</template>

<script lang="ts">
import * as Three from "three";
import { defineComponent, onMounted } from "vue";
import { GraphicLoader } from './models/GraphicLoader';
import { MyMouseControls } from '@/components/models/MyMouseControls';
import { MyKeyboardControls } from '@/components/models/MyKeyboardControls';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Wird benutzt fuer Developersicht in bspw. initRenderer


export default defineComponent({
  name: "RenderDemo",
  setup() {


    let container: any;
    let camera: any;
    let cameraCollidable: any;
    let scene: any;
    let renderer: any;
    let meshPlane: any;
    let meshCube: any;
    let raycaster: any;
    let loader: GraphicLoader;
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;
    let collidableList: Array<any> = [];
    let developer = true;
    let developerCamera: any;
    let controls: any;

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

      let ambientLight = new Three.AmbientLight( 0xcccccc );
      scene.add( ambientLight );
              
      let directionalLight = new Three.DirectionalLight( 0xffffff );
      directionalLight.position.set( 0, 1, 1 ).normalize();
      scene.add( directionalLight );	
    };

    /**
     * Initialisiert Loader Klasse
     */
    const initLoader = () => {
      loader = new GraphicLoader();
      console.log(loader)
      loader.ladeDatei('/assets/blender/room.gltf')
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
        // TODO: Mehrere Dateien handlen koennen fuer Collision Detection
        collidableList.push(res.scene)
      })
    };

    /**
     * Initialisiert Kamera
     */
    const initCamera = () => {

      

      // First Person View inset (camera)
      camera = new Three.PerspectiveCamera(50,window.innerWidth / window.innerHeight,0.1,window.innerHeight);
      //camera.position.set(0, player.height, -5);
      camera.position.set(-2, player.height*3, -5);
      camera.lookAt(new Three.Vector3(-2, player.height*3, 0));

      // Developer Kamera Main (camera2)
      if (developer){
        developerCamera = new Three.PerspectiveCamera(30,window.innerWidth / window.innerHeight,0.1,window.innerHeight);
        developerCamera.position.set(-50, 50, -50);
        developerCamera.lookAt(new Three.Vector3(0, player.height, 0));

        // Axes Helper (x,y,z)
        const axesHelper = new Three.AxesHelper(30);
        scene.add(axesHelper)
        
      }
      

      

      // Kamera Collision objekt init
      
      let cubeGeometry = new Three.BoxGeometry(1,1,1);
      let wireMaterial = new Three.MeshBasicMaterial( {color: 0xff0000, wireframe: true});
      cameraCollidable = new Three.Mesh(cubeGeometry, wireMaterial);
      cameraCollidable.position.set(0, player.height/2, 0);
      cameraCollidable.lookAt(new Three.Vector3(0, player.height, 0))
      

    };

    /**
     * Initialisiert die Steuerung
     */
    const initControls = () => {
      mouseControls = new MyMouseControls(camera, document); //init Maussteuerung
      keyControls = new MyKeyboardControls(collidableList, cameraCollidable, document); //init Keyboardsteuerung

      connect();
    }

    const connect = () => {
      window.addEventListener( 'click', mouseControls.lock ); //locked die Maus
    }

    const disconnect = () => {
      mouseControls.dispose();
      keyControls.disconnect();
      window.removeEventListener('click', mouseControls.lock );
      console.log("Müsste disconnected sein")
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

      
      
      

      // main scene (oben ansicht)
      renderer = new Three.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
      container.appendChild(renderer.domElement);

      // Fuer automatische Verfolgung des Blocks im Level in Developersicht, funktioniert noch nicht ganz
      // (auskommentierter Code auch in doAnimate controls.target...)
      // controls = new OrbitControls(developerCamera, renderer.domElement);
      // controls.minDistance = 50;
      // controls.maxDistance = 300;

      
        
      
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
      keyControls.update(camera, velocity, delta) //Tastatur Steuerung
			prevTime = time;

      // developer sicht
      if (developer){
        // Developer Kamera (Uebersicht)
        renderer.setClearColor( 0x000000, 0 );
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render( scene, developerCamera );
        scene.add(cameraCollidable);     

        // BoxHelper (geladene Objekte, erstmal nur IntroLevel)
        const boxHelper = new Three.BoxHelper(collidableList[0], new Three.MeshBasicMaterial( 0xff0000 ))
        scene.add(boxHelper)

        // Hauptkamera (POV)
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(30, 30, window.innerWidth/4, window.innerHeight/4);
        renderer.setViewport(30, 30, window.innerWidth/4, window.innerHeight/4);
        renderer.setClearColor( 0x222222, 1 );

        //controls.target.copy(camera.position);
      
        renderer.render(scene, camera);

        renderer.setScissorTest(false);
      }else{ // standard pov sicht
        renderer.render( scene, camera );
      }

      
     
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
    
    return {connect, disconnect}

  },
  beforeUnmount() {

    this.disconnect();
    console.log("unmounted")
  },
});


</script>

<style scoped>
</style>
