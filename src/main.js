/// THREE.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

import SceneManager from "./xr/sceneManager.js";
import Reticle from "./xr/reticle.js";
import Persistence from "./xr/persistence.js";



import "./utils/qr.js";

/// UI
import Alpine from 'alpinejs';
import './ui.js';

// import "./style.css";

///////////////////////////////////////////////







var data_output = document.getElementById('data-output');






/////////////////////////////////////////////////



let container;
let camera, scene, renderer;
let controller;

let reticle;
let gizmo;
let geomLookAt;
let reticleLookAt;

let hitTestSource = null;
let hitTestSourceRequested = false;
let planeFound = false;
let flowersGltf;


// let initAnchorCreated = false;
let initAnchor = null;


// check for webxr session support
if ("xr" in navigator) {
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

    Alpine.store('ui').setDivVisibility('loader', false);

    if (supported) {
      Alpine.store('ui').setDivVisibility('overlay', true);
      init();
      animate();
    }
    else {
      Alpine.store('ui').setDivVisibility('arNotSupported', true);
    }
  });
}














function sessionStart() {
  planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}





function init() {
  // container = document.createElement("div");
  // document.body.appendChild(container);

  // scene = new THREE.Scene();

  // camera = new THREE.PerspectiveCamera(
  //   70,
  //   window.innerWidth / window.innerHeight,
  //   0.01,
  //   20
  // );

  // const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  // light.position.set(0.5, 1, 0.25);
  // scene.add(light);

  // renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.xr.enabled = true;
  // container.appendChild(renderer.domElement);

  // renderer.xr.addEventListener("sessionstart", sessionStart);

  // document.body.appendChild(
  //   ARButton.createButton(renderer, {
  //     requiredFeatures: ["local", "hit-test", "dom-overlay"],
  //     domOverlay: { root: document.querySelector("#overlay") },
  //   })
  // );

  // controller = renderer.xr.getController(0);
  // controller.addEventListener("select", onSelect);
  // scene.add(controller);

  SceneManager.init();
  SceneManager.renderer.xr.addEventListener("sessionstart", sessionStart);
  SceneManager.controller.addEventListener("select", onSelect);




  // function loadGizmo() {
  //   const loader = new GLTFLoader();
  //   loader.load("temp.glb", (gltf) => {
  //     gizmo = gltf.scene;
  //   });
  // }


  // function loadFlower() {
  //   const loader = new GLTFLoader();
  //   loader.load("flowers.glb", (gltf) => {
  //     flowersGltf = gltf.scene;
  //   });
  // }

  gizmo = SceneManager.loadGltf("temp.glb");
  console.log("1")
  console.log(gizmo)
  flowersGltf = SceneManager.loadGltf("flowers.glb");










  const mode = "save";
  function onSelect() {
    console.log("onSelect!");
    
    if (Reticle.isHitting()) {

      const hitMatrix = Reticle.getHitMatrix();

      // Initialize the persistence system
      if (!Persistence.isInitialized()) {
        Persistence.setReference(hitMatrix);

        // const ref =
        //   gizmo.children[
        //   Math.floor(Math.random() * gizmo.children.length)
        //   ];
        // const mesh = ref.clone();
        // hitMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        // scene.add(mesh);
        console.log("2")
        console.log(gizmo)
        SceneManager.addGltfToScene(gizmo, hitMatrix, "reference");

        // if (mode == "load") {
        //   const modelsMatrix = Persistence.load();
        //   console.log(modelsMatrix);

        //   if (modelsMatrix) {
        //     modelsMatrix.forEach((modelMatrix) => {
        //       const flower =
        //         flowersGltf.children[0];
        //       const mesh = flower.clone();
        //       modelMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        //       scene.add(mesh);
        //     });
        //   }
        // }

      }
      // else {

      //   if (mode == "save") {
      //     const flower =
      //       flowersGltf.children[
      //       Math.floor(Math.random() * flowersGltf.children.length)
      //       ];
      //     const mesh = flower.clone();

      //     hitMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      //     scene.add(mesh);

      //     Persistence.save(hitMatrix);
      //   }
      // }
    }
  }









  Reticle.set({
    renderer: SceneManager.renderer,
    scene: SceneManager.scene,
    color: 0x00ff00,
    radius: 0.06,
    innerRadius: 0.05,
    segments: 4,
  })



  // loadGizmo();
  // loadFlower();

  // window.addEventListener("resize", onWindowResize);


}

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

function animate() {
  SceneManager.renderer.setAnimationLoop(render);
}



// function render(timestamp, frame) {
//   if (frame) {
//     Reticle.update(frame, (surfType) => {
//       ///console.log("surfType", surfType);
//     });
//   }

//   renderer.render(scene, camera);
// }

const render = (timestamp, frame) => {
  if (frame) {

    Reticle.update(frame, (surfType) => {
      ///console.log("surfType", surfType);
    });
  }

  SceneManager.update();
  // renderer.render(scene, camera);
}






