/// THREE.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";


import "./utils/qr.js";

/// UI
import Alpine from 'alpinejs';
import './ui.js';

// import "./style.css";

///////////////////////////////////////////////

import { initDeviceSensors, getDeviceYaw } from './utils/deviceOrientation.js';


import { LocalStorage } from "./utils/localStorage.js";

// await initDeviceSensors();

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


let initAnchorCreated = false;
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





function alignZAxisWithUp(mesh) {
  // Calcola l'attuale direzione dell'asse Z della mesh
  const zAxis = new THREE.Vector3(0, 0, 1);
  zAxis.applyQuaternion(mesh.quaternion);

  // Vettore di riferimento per "l'alto" (solitamente l'asse Y nel sistema di coordinate globale)
  const upVector = new THREE.Vector3(0, 1, 0);

  // Calcola l'angolo tra l'asse Z attuale e il vettore UP
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(zAxis, upVector);

  // Applica questa rotazione correttiva
  mesh.quaternion.premultiply(quaternion);

  // Aggiorna la matrice dell'oggetto
  mesh.updateMatrix();
}









function sessionStart() {
  planeFound = false;
  //show #tracking-prompt
  document.getElementById("tracking-prompt").style.display = "block";
}


let reticleWorldPosition = new THREE.Vector3();
let reticleLookAtWorldPosition = new THREE.Vector3();
let reticleDirection = new THREE.Vector3();
let reticleLookAtDirection = new THREE.Vector3();
function getReticleSurface() {
  reticleLookAt.getWorldPosition(reticleWorldPosition);
  reticle.getWorldPosition(reticleLookAtWorldPosition);
  reticleDirection.subVectors(reticleWorldPosition, reticleLookAtWorldPosition).normalize();
  if (reticleDirection.y == 1) {
    return 'floor';
  } else if (reticleDirection.y == -1) {
    return 'ceiling';
  } else {
    return 'wall';
  }
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


  function createReticle() {
    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 4).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    reticle.add(new THREE.AxesHelper(0.5));
    scene.add(reticle);

    geomLookAt = new THREE.PlaneGeometry(.05, .05);
    reticleLookAt = new THREE.Mesh(
      geomLookAt.rotateX(- Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    reticleLookAt.translateY(.3);
    reticleLookAt.visible = false;
    reticle.add(reticleLookAt);
  }


  function loadGizmo() {
    const loader = new GLTFLoader();
    loader.load("temp.glb", (gltf) => {
      gizmo = gltf.scene;
      gizmo.matrixAutoUpdate = false;
      gizmo.visible = false;
      gizmo.add(new THREE.AxesHelper(1));
      scene.add(gizmo);
    });
  }


  function loadFlower() {
    const loader = new GLTFLoader();
    loader.load("temp.glb", (gltf) => {
      flowersGltf = gltf.scene;
    });
  }


  function onSelect() {
    console.log("onSelect");
    if (reticle.visible && flowersGltf) {
      //pick random child from flowersGltf
      const flower =
        flowersGltf.children[
        Math.floor(Math.random() * flowersGltf.children.length)
        ];
      const mesh = flower.clone();

      reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      // const scale = Math.random() * 0.4 + 0.25;
      // mesh.scale.set(scale, scale, scale);
      //random rotation
      // mesh.rotateY(Math.random() * Math.PI * 2);
      scene.add(mesh);

      // // animate growing via hacky setInterval then destroy it when fully grown
      // const interval = setInterval(() => {
      //   mesh.scale.multiplyScalar(1.01);

      //   mesh.rotateY(0.03);
      // }, 16);
      // setTimeout(() => {
      //   clearInterval(interval);
      // }, 500);
      if (!initAnchorCreated) {
        initAnchorCreated = true;
        console.log(reticle.matrix);
        console.log(mesh.position);
        console.log(mesh.quaternion);
        console.log(mesh.scale);
        console.log(mesh.rotation);
        console.log("initAnchorCreated", initAnchorCreated);
        initAnchor = {
          position: {
            x: reticle.position.x,
            y: reticle.position.y,
            z: reticle.position.z
          },
          rotation: {
            x: reticle.rotation.x,
            y: reticle.rotation.y,
            z: reticle.rotation.z
          }
        }
        console.log(initAnchor);
      }

    }
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  // reticle = new THREE.Mesh(
  //   new THREE.RingGeometry(0.15, 0.2, 4).rotateX(-Math.PI / 2),
  //   new THREE.MeshBasicMaterial()
  // );
  // reticle.matrixAutoUpdate = false;
  // reticle.visible = false;
  // scene.add(reticle);




  createReticle();
  loadGizmo();


  // //load flowers.glb
  // const loader = new GLTFLoader();
  // loader.load("temp.glb", (gltf) => {
  //   flowersGltf = gltf.scene;
  // });
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



function render(timestamp, frame) {
  if (frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    const session = renderer.xr.getSession();

    if (hitTestSourceRequested === false) {
      session.requestReferenceSpace("viewer").then(function (referenceSpace) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then(function (source) {
            hitTestSource = source;
          });
      });

      session.addEventListener("end", function () {
        hitTestSourceRequested = false;
        hitTestSource = null;
      });

      hitTestSourceRequested = true;
    }



    if (hitTestSource) {
      const hitTestResults = frame.getHitTestResults(hitTestSource);

      if (hitTestResults.length) {
        if (!planeFound) {
          planeFound = true;
          //hide #tracking-prompt
          document.getElementById("tracking-prompt").style.display = "none";
          document.getElementById("instructions").style.display = "flex";
          console.log("plane found");
        }

        const hit = hitTestResults[0];
        reticle.visible = true;
        // reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);

        const pose = hit.getPose(referenceSpace);
        const rawMatrix = pose.transform.matrix;
        const threeMatrix = new THREE.Matrix4();
        threeMatrix.fromArray(rawMatrix);
        let pos = new THREE.Vector3();
        let quat = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        threeMatrix.decompose(pos, quat, scale);
        
        reticle.position.copy(pos);
        reticle.quaternion.copy(quat);
        reticle.updateMatrix();

        

        const surf = getReticleSurface();

        // alignZAxisWithUp(reticle);

        if (surf == 'wall') {
          alignZAxisWithUp(reticle);
        }
        // if (surf == 'floor') {
        //   reticle.updateMatrix();
        // } else if (surf == 'wall') {
        //   alignZAxisWithUp(reticle);
        // } else {
        //   reticle.updateMatrix();
        // } 





        // gizmo.position.copy(pos);
        // gizmo.quaternion.copy(quat);
        // gizmo.updateMatrix();






        data_output.innerHTML = surf;


      } else {
        reticle.visible = false;
        gizmo.visible = false;
      }
    }
  }

  renderer.render(scene, camera);
}
