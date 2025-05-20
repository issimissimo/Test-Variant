import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let _renderer = null;
let _scene = null;
let _mesh = null;

// Elementi di stato
let _hitTestSource = null;
let _hitTestSourceRequested = false;
let _lastHitPose = null;
let _isHitting = false;

// Variabili per il Piano di riferimento per l'orientamento del reticolo
let _geomLookAt = null;
let _reticleLookAt = null;
let _reticleWorldPosition = new THREE.Vector3();
let _reticleLookAtWorldPosition = new THREE.Vector3();
let _reticleDirection = new THREE.Vector3();
let _reticleLookAtDirection = new THREE.Vector3();


const XrReticle = {
    /**
     * Configura le opzioni per l'oggetto XrReticle.
     *
     * @param {Object} [options={}] - Oggetto delle opzioni di configurazione.
     * @param {THREE.WebGLRenderer} [options.renderer] - Il renderer da utilizzare.
     * @param {THREE.Scene} [options.scene] - La scena a cui aggiungere il reticolo.
     * @param {string} [options.fileName] - Il percorso del file GLTF da caricare come mesh del reticolo.
     * @param {number} [options.radius] - Il raggio esterno del reticolo.
     * @param {number} [options.innerRadius] - Il raggio interno del reticolo.
     * @param {number} [options.segments] - Il numero di segmenti del reticolo.
     * @param {number} [options.color] - Il colore del reticolo.
     */
    init(options = {}) {

        _renderer = options.renderer;
        _scene = options.scene;

        if (options.fileName) {
            const loader = new GLTFLoader();
            loader.load(options.fileName, (gltf) => {
                _mesh = gltf.scene;
            });
        }
        else {
            const ringGeometry = new THREE.RingGeometry(options.innerRadius || 0.3, options.radius || 0.2, options.segments || 32).rotateX(-Math.PI / 2);
            const material = new THREE.MeshBasicMaterial({
                color: options.color || 0x00ff00, transparent: true,
                opacity: 0.8, side: THREE.DoubleSide
            });
            _mesh = new THREE.Mesh(ringGeometry, material);
        }
        _mesh.matrixAutoUpdate = false;
        _mesh.visible = false;
        _scene.add(_mesh);
    },


    update(frame) {
        const referenceSpace = _renderer.xr.getReferenceSpace();
        const session = _renderer.xr.getSession();
        
        if (_hitTestSourceRequested === false) {
            session.requestReferenceSpace("viewer").then(function (referenceSpace) {
                session
                    .requestHitTestSource({ space: referenceSpace })
                    .then(function (source) {
                        _hitTestSource = source;
                    });
            });

            session.addEventListener("end", function () {
                _hitTestSourceRequested = false;
                _hitTestSource = null;
            });

            _hitTestSourceRequested = true;
        }

        if (_hitTestSource) {
            const hitTestResults = frame.getHitTestResults(_hitTestSource);
            if (hitTestResults.length) {
                
                _isHitting = true;
                _mesh.visible = true;

                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);
                const rawMatrix = pose.transform.matrix;
                const threeMatrix = new THREE.Matrix4();
                threeMatrix.fromArray(rawMatrix);
                let pos = new THREE.Vector3();
                let quat = new THREE.Quaternion();
                let scale = new THREE.Vector3();
                threeMatrix.decompose(pos, quat, scale);

                _mesh.position.copy(pos);
                _mesh.quaternion.copy(quat);
                _mesh.updateMatrix();



                // const surf = getReticleSurface();

                // alignZAxisWithUp(reticle);

                // if (surf == 'wall') {
                //     alignZAxisWithUp(reticle);
                // }







                // data_output.innerHTML = surf;


            } else {
                _isHitting = false;
                _mesh.visible = false;
            }
        }
    }

}




export default XrReticle;   