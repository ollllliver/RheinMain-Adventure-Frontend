<template>
    <div id="container"/>
</template>

<script>
import { defineComponent } from 'vue';
import * as Three from 'three'
export default defineComponent({
  name: 'RenderDemo',
  methods: {
    init: function() {
        let container = document.getElementById('container');

        this.camera = new Three.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, window.innerHeight);
        this.camera.position.z = 1;

        this.scene = new Three.Scene();

        let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
        let material = new Three.MeshNormalMaterial();

        this.mesh = new Three.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

    },
    animate: function() {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
})
</script>

<style scoped>

</style>
