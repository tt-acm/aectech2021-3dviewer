<template>
  <div style="height: 100%; width: 100%">
    <div id="wrapper">
      <div id="container" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
    </div>
    <div id="controlsContainer">
      <input type="button" value="Load Model!" @click="onBtnClick" />
      <input
        type="button"
        value="Toggle Grid"
        @click="setGridVisibility(!gridVisibility)"
      />
      <br />
      Colour Scheme:
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as utils from "@/utils/index.js";

window.THREE = THREE;

let container, renderer, scene, camera, controls, composer;

let sceneContent;
let groundGrid;

export default {
  data() {
    return {
      gridVisibility: true
    };
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
      camera.position.set(-700, 800, -200);
      camera.lookAt(new THREE.Vector3());

      scene = new THREE.Scene();
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.xr.enabled = true;
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xf2f2f2);
      container.appendChild(renderer.domElement);

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;
      controls.update();

      this.updateGridVisibility();

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
      let that = this;
      let sceneObject = new THREE.Object3D();
      let gltfLoader = new GLTFLoader();
      let url = "models/gltf/3d_modern_bungalow/scene.gltf";
      gltfLoader.load(url, gltf => {
        let modelData = gltf.scene;
        that.updateScale();
        console.log(modelData);
        sceneObject.add(modelData);
        sceneContent = sceneObject;
        scene.add(sceneContent);
      });
    },
    setGridVisibility(newVal) {
      this.gridVisibility = newVal;
      this.updateGridVisibility();
    },
    updateGridVisibility() {
      if (groundGrid) scene.remove(groundGrid);
      if (this.gridVisibility) {
        let gg = utils.makeGrid(100000, 10, 10, "#cccccc", "#dedede");
        gg.rotation.x = -Math.PI / 2;
        scene.add(gg);
        groundGrid = gg;
      }
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

#controlsContainer {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 4px;
}
</style>