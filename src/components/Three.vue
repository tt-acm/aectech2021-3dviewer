<template>
  <div style="height: 100%; width: 100%">
    <div id="wrapper">
      <div id="container" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
    </div>
    <!-- <input type="button" value="Click Me!" @click="onBtnClick" /> -->
    <v-btn color="primary" @click="onBtnClick">
      Load Model
    </v-btn>
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

let sceneContent;

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

      scene.add(new THREE.AmbientLight(0xffffff));
      let light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(-20, 40, 0);
      scene.add(light);

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
    },
    animate() {
      renderer.setAnimationLoop(() => {
        controls.update();
        composer.render();
        // renderer.render(scene, camera);
      });
    },
    onMouseDown() {},
    onMouseUp() {},
    onBtnClick() {
      if (sceneContent) scene.remove(sceneContent);
      let sceneObject = new THREE.Object3D();
      let rh3dmLoader = new Rhino3dmLoader();
      rh3dmLoader.setLibraryPath(
        "https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/"
      );
      rh3dmLoader.load("models/3dm/story+of+life.3dm", function(model) {
        console.log(model);
        sceneObject.add(model);
        sceneContent = sceneObject;
        scene.add(sceneContent);
      });
    }
  },
  mounted() {
    this.init();
    this.animate();
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