/// THREE.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

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
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  renderer.xr.addEventListener("sessionstart", sessionStart);

  document.body.appendChild(
    ARButton.createButton(renderer, {
      requiredFeatures: ["local", "hit-test", "dom-overlay"],
      domOverlay: { root: document.querySelector("#overlay") },
    })
  );




  function loadGizmo() {
    const loader = new GLTFLoader();
    loader.load("temp.glb", (gltf) => {
      gizmo = gltf.scene;
      // gizmo.matrixAutoUpdate = false;
      // gizmo.visible = false;
      // gizmo.add(new THREE.AxesHelper(1));
      // scene.add(gizmo);
    });
  }


  function loadFlower() {
    const loader = new GLTFLoader();
    loader.load("flowers.glb", (gltf) => {
      flowersGltf = gltf.scene;
    });
  }


  // function onSelect() {
  //   console.log("onSelect");
  //   if (reticle.visible && flowersGltf) {
  //     //pick random child from flowersGltf
  //     const flower =
  //       flowersGltf.children[
  //       Math.floor(Math.random() * flowersGltf.children.length)
  //       ];
  //     const mesh = flower.clone();

  //     reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
  //     // const scale = Math.random() * 0.4 + 0.25;
  //     // mesh.scale.set(scale, scale, scale);
  //     //random rotation
  //     // mesh.rotateY(Math.random() * Math.PI * 2);
  //     scene.add(mesh);

  //     // // animate growing via hacky setInterval then destroy it when fully grown
  //     // const interval = setInterval(() => {
  //     //   mesh.scale.multiplyScalar(1.01);

  //     //   mesh.rotateY(0.03);
  //     // }, 16);
  //     // setTimeout(() => {
  //     //   clearInterval(interval);
  //     // }, 500);
  //     if (!initAnchorCreated) {
  //       initAnchorCreated = true;
  //       console.log(reticle.matrix);
  //       console.log(mesh.position);
  //       console.log(mesh.quaternion);
  //       console.log(mesh.scale);
  //       console.log(mesh.rotation);
  //       console.log("initAnchorCreated", initAnchorCreated);
  //       initAnchor = {
  //         position: {
  //           x: reticle.position.x,
  //           y: reticle.position.y,
  //           z: reticle.position.z
  //         },
  //         rotation: {
  //           x: reticle.rotation.x,
  //           y: reticle.rotation.y,
  //           z: reticle.rotation.z
  //         }
  //       }
  //       console.log(initAnchor);
  //     }

  //   }
  // }

  function onSelect() {

    if (Reticle.isHitting() && flowersGltf) {

      const hitMatrix = Reticle.getHitMatrix();

      // Initialize the persistence system
      if (!Persistence.isInitialized()) {
        Persistence.setReference(hitMatrix);

        const ref =
          gizmo.children[
          Math.floor(Math.random() * gizmo.children.length)
          ];
        const mesh = ref.clone();
        hitMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        scene.add(mesh);

      }
      else {
        // Persistence.save(hitMatrix);



        const flower =
          flowersGltf.children[
          Math.floor(Math.random() * flowersGltf.children.length)
          ];
        const mesh = flower.clone();

        hitMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        scene.add(mesh);
      }








      //pick random child from flowersGltf
      // const flower =
      //   flowersGltf.children[
      //   Math.floor(Math.random() * flowersGltf.children.length)
      //   ];
      // const mesh = flower.clone();

      // hitMatrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      // const scale = Math.random() * 0.4 + 0.25;
      // mesh.scale.set(scale, scale, scale);
      //random rotation
      // mesh.rotateY(Math.random() * Math.PI * 2);

      // mesh.position.copy(Reticle.hitPosition());
      // mesh.quaternion.copy(Reticle.hitQuaternion());

      // scene.add(mesh);

      // // animate growing via hacky setInterval then destroy it when fully grown
      // const interval = setInterval(() => {
      //   mesh.scale.multiplyScalar(1.01);

      //   mesh.rotateY(0.03);
      // }, 16);
      // setTimeout(() => {
      //   clearInterval(interval);
      // }, 500);
      // if (!initAnchorCreated) {
      //   initAnchorCreated = true;
      //   console.log(mesh.position);
      //   console.log(mesh.quaternion);
      //   console.log(mesh.scale);
      //   console.log(mesh.rotation);
      //   console.log("initAnchorCreated", initAnchorCreated);
      //   // initAnchor = {
      //   //   position: {
      //   //     x: reticle.position.x,
      //   //     y: reticle.position.y,
      //   //     z: reticle.position.z
      //   //   },
      //   //   rotation: {
      //   //     x: reticle.rotation.x,
      //   //     y: reticle.rotation.y,
      //   //     z: reticle.rotation.z
      //   //   }
      //   // }
      //   // console.log(initAnchor);
      // }

    }
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);







  Reticle.set({
    renderer: renderer,
    scene: scene,
    color: 0x00ff00,
    radius: 0.06,
    innerRadius: 0.05,
    segments: 4,
  })



  loadGizmo();
  loadFlower();

  window.addEventListener("resize", onWindowResize);


}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
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

  renderer.render(scene, camera);
}






