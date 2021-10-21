<template>
  <div id="wrapper">
    <div id="container" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader.js";

window.THREE = THREE;

let container, renderer, scene, camera, controls, composer;

// let sceneContent;

export default {
  data() {
    return {};
  },
  methods: {
    onContainerResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    },
    init() {
      container = document.getElementById("container");

      camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        10,
        10000000
      );
      camera.position.set(300, 800, 600);
      camera.lookAt(new THREE.Vector3());

      scene = new THREE.Scene();
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.xr.enabled = true;
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.update();

      window.addEventListener(
        "resize",
        () => {
          this.onContainerResize();
        },
        false
      );
      this.onContainerResize();

      let geometry = new THREE.SphereGeometry(400, 32, 32);
      let material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });
      let sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Add Rhino Geometries
      const loader = new Rhino3dmLoader();
      // Specify path to a folder containing WASM/JS libraries or a CDN.
      loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");
      // loader.setLibraryPath("rhino3dm/rhino3dm.js");

      loader.load(
          // "https://taste-test.s3.amazonaws.com/story+of+life.3dm",
          "https://taste-test.s3.amazonaws.com/LGA+sculpture+export.3dm",
          function (object) {
          console.log("object", object);
          scene.add(object);

          // hide spinner
          // document.getElementById("loader").style.display = "none";
          }
      );
    },
    animate() {
      renderer.setAnimationLoop(() => {
        controls.update();
        composer.render();
        // renderer.render(scene, camera);
      });
    },
    onMouseDown() {},
    onMouseUp() {}
  },
  mounted() {
    this.init();
    this.animate();
    setTimeout(this.loadModel, 2000);
  }
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
}

#wrapper {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
}
</style>