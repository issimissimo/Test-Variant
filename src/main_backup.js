
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

import SceneManager from "./xr/sceneManager.js";
import Reticle from "./xr/reticle.js";
import Persistence from "./xr/persistence.js";



import "./utils/qr.js";

/// UI
import Alpine from 'alpinejs';
import './ui.js';


var data_output = document.getElementById('data-output');


let gizmo;
let flowersGltf;





// check for webxr session support
if ("xr" in navigator) {
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

    Alpine.store('ui').setDivVisibility('loader', false);

    if (supported) {
      Alpine.store('ui').setDivVisibility('overlay', true);
      init();
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





async function init() {

  SceneManager.init();
  SceneManager.renderer.xr.addEventListener("sessionstart", sessionStart);
  SceneManager.controller.addEventListener("select", onSelect);


  gizmo = await SceneManager.loadGltf("temp.glb");
  flowersGltf = await SceneManager.loadGltf("flowers.glb");


  SceneManager.renderer.setAnimationLoop(render);







  const mode = "save";

  function onSelect() {

    if (Reticle.isHitting()) {
      const hitMatrix = Reticle.getHitMatrix();

      // Initialize the persistence system
      if (!Persistence.isInitialized()) {

        Persistence.init(hitMatrix);
        SceneManager.addGltfToScene(gizmo, hitMatrix, "reference");

        // Load all saved matrix
        if (mode == "load") {

          const modelsMatrix = Persistence.load();
          modelsMatrix.forEach((modelMatrix) => {
            SceneManager.addTestCube(modelMatrix);
          });
        }
      }
      else {

        // Save this matrix
        if (mode == "save") {

          Persistence.save(hitMatrix);
          SceneManager.addTestCube(hitMatrix);
        }
      }
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


}



function render(timestamp, frame) {
  if (frame) {

    Reticle.update(frame, (surfType) => {
      ///console.log("surfType", surfType);
    });
  }

  SceneManager.update();
}






