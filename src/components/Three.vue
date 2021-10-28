<template>
  <div style="height: 100%; width: 100%">
    <div id="wrapper">
      <div id="container" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
    </div>
    <div id="controlsContainer">
      <input type="button" value="Load Model" @click="onBtnClickLoadModel" />
      <br />
      <input type="button" value="Zoom All" @click="onBtnClickZoomAll" />
      <input
        type="checkbox"
        v-model="gridVisibility"
        id="gridToggle"
        @change="setGridVisibility(!gridVisibility)"
      />
      <label for="gridToggle">Grid</label>
      <br />
      Scale:
      <input
        type="range"
        v-model="scaleFactor"
        min="0.1"
        max="100"
        @change="updateScale"
      />
      {{ scaleFactor }}
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
      gridVisibility: true,
      scaleFactor: 10
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

      scene.add(new THREE.AmbientLight(0xffffff));
      let light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(-20, 40, 0);
      scene.add(light);

      this.updateGridVisibility();
      this.updateScale();

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
    onBtnClickLoadModel() {
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
    onBtnClickZoomAll() {
      if (!sceneContent) return;
      // ref: https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/3
      const offset = 1.25;
      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject(sceneContent);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      const size = new THREE.Vector3();
      boundingBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs((maxDim / 4) * Math.tan(fov * 2));
      cameraZ *= offset;
      camera.position.z = cameraZ;
      const minZ = boundingBox.min.z;
      const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
      camera.far = cameraToFarEdge * 10;
      camera.updateProjectionMatrix();
      if (controls) {
        controls.target = center;
        controls.maxDistance = cameraToFarEdge * 2;
        controls.saveState();
      } else {
        camera.lookAt(center);
      }
    },
    setGridVisibility() {
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
    },
    updateScale() {
      if (!sceneContent) return;
      let sF = this.scaleFactor;
      sceneContent.scale.set(sF, sF, sF);
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