import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let _renderer = null;
let _scene = null;
let _mesh = null;

// Elementi di stato
let _hitTestSource = null;
let _hitTestSourceRequested = false;
let _isHitting = false;
let _surfType = null;

// Variabili per il Piano di riferimento per l'orientamento del reticolo
let _geomLookAt = null;
let _reticleLookAt = null;
let _reticleWorldPosition = new THREE.Vector3();
let _reticleLookAtWorldPosition = new THREE.Vector3();
let _reticleDirection = new THREE.Vector3();

let _initialized = false;


function _addPlaneForReticleSurface() {
    _geomLookAt = new THREE.PlaneGeometry(0.1, 0.1);
    _reticleLookAt = new THREE.Mesh(
        _geomLookAt.rotateX(- Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    _reticleLookAt.translateY(.3);
    _reticleLookAt.visible = false;
    _mesh.add(_reticleLookAt);
}


function _getReticleSurface() {
    _reticleLookAt.getWorldPosition(_reticleWorldPosition);
    _mesh.getWorldPosition(_reticleLookAtWorldPosition);
    _reticleDirection.subVectors(_reticleWorldPosition, _reticleLookAtWorldPosition).normalize();
    if (_reticleDirection.y == 1) {
        return 'floor';
    } else if (_reticleDirection.y == -1) {
        return 'ceiling';
    } else {
        return 'wall';
    }
}


function _alignZAxisWithUp() {
    // Calcola l'attuale direzione dell'asse Z della mesh
    const zAxis = new THREE.Vector3(0, 0, 1);
    zAxis.applyQuaternion(_mesh.quaternion);
    // Vettore di riferimento per "l'alto" (solitamente l'asse Y nel sistema di coordinate globale)
    const upVector = new THREE.Vector3(0, 1, 0);
    // Calcola l'angolo tra l'asse Z attuale e il vettore UP
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(zAxis, upVector);
    // Applica questa rotazione correttiva
    _mesh.quaternion.premultiply(quaternion);
    // Aggiorna la matrice dell'oggetto
    _mesh.updateMatrix();
}


function _setReticlePropertiers() {
    _mesh.matrixAutoUpdate = false;
    _mesh.visible = false;
    _scene.add(_mesh);
    _addPlaneForReticleSurface();
    _initialized = true;
}


const _options = {
    radius: 0.2,
    innerRadius: 0.1,
    segments: 32,
    color: 0x00ff00
}



const Reticle = {
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
    set(options = {}) {

        if (options.renderer) _renderer = options.renderer;
        if (options.scene) _scene = options.scene;

        if (!_renderer || !_scene) {
            console.error("XrReticle: renderer or scene not set");
            return;
        }

        if (options.radius) _options.radius = options.radius;
        if (options.innerRadius) _options.innerRadius = options.innerRadius;
        if (options.segments) _options.segments = options.segments;
        if (options.color) _options.color = options.color;

        if (options.fileName) {
            const loader = new GLTFLoader();
            loader.load(
                options.fileName,
                (gltf) => {
                    const r = gltf.scene;
                    const ref = r.children[0];
                    _mesh = ref.clone();
                    _setReticlePropertiers();
                },
                (xhr) => {
                    // console.log((xhr.loaded / xhr.total * 100) + '% loaded of reticle');
                },
                (error) => {
                    console.error('An error happened', error);
                }
            );



        }
        else {
            const ringGeometry = new THREE.RingGeometry(_options.innerRadius, _options.radius, _options.segments).rotateX(-Math.PI / 2);
            const material = new THREE.MeshBasicMaterial({
                color: _options.color || 0x00ff00, transparent: true,
                opacity: 0.8, side: THREE.DoubleSide
            });
            _mesh = new THREE.Mesh(ringGeometry, material);
            _setReticlePropertiers();
        }

        // _mesh.matrixAutoUpdate = false;
        // _mesh.visible = false;
        // _scene.add(_mesh);
        // _addPlaneForReticleSurface();

        // _initialized = true;
    },

    /**
     * Updates the reticle's position and visibility based on the current XR frame's hit test results.
     *
     * @param {XRFrame} frame - The current XRFrame from the XR session.
     * @param {function} [callback] - Optional callback invoked with the detected surface type ('wall', 'floor', etc.) after a successful hit test.
     *
     * @returns {void}
     */
    update(frame, callback) {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }

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
                _mesh.updateMatrix(); ////// NON QUI!!!!!!!!

                _surfType = _getReticleSurface();
                if (_surfType == 'wall') _alignZAxisWithUp();

                ///// MA QUI!!!!!

                if (callback) callback(_surfType);

            } else {
                _isHitting = false;
                _mesh.visible = false;
                _surfType = null;
            }
        }
    },

    isHitting() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _isHitting;
    },

    getHitPosition() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _mesh.position;
    },

    getHitQuaternion() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _mesh.quaternion;
    },

    getHitMatrix() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _mesh.matrix;
    },

    setVisible(visible) {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        _mesh.visible = visible;
    },

    surfType() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _surfType;
    }
}

export default Reticle;   