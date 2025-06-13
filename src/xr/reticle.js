import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
    Vector3,
    Quaternion,
    Matrix4,
    PlaneGeometry,
    Mesh,
    MeshBasicMaterial,
    RingGeometry,
    DoubleSide,
    Scene,
    Camera,
    WebGLRenderer
} from 'three';


let _renderer = null;
let _scene = null;
let _camera = null;
let _planeMesh = null;
let _circleMesh = null;

// Elementi di stato
let _hitTestSource = null;
let _hitTestSourceRequested = false;
let _isHitting = false;
let _surfType = null;
let _planeHidden = false;
let _circleHidden = false;
let _reticleMode = null;


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
    _planeMesh.add(_reticleLookAt);
}


function _getReticleSurface() {
    _reticleLookAt.getWorldPosition(_reticleWorldPosition);
    _planeMesh.getWorldPosition(_reticleLookAtWorldPosition);
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
    zAxis.applyQuaternion(_planeMesh.quaternion);
    // Vettore di riferimento per "l'alto" (solitamente l'asse Y nel sistema di coordinate globale)
    const upVector = new THREE.Vector3(0, 1, 0);
    // Calcola l'angolo tra l'asse Z attuale e il vettore UP
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(zAxis, upVector);
    // Applica questa rotazione correttiva
    _planeMesh.quaternion.premultiply(quaternion);
    // Aggiorna la matrice dell'oggetto
    _planeMesh.updateMatrix();
}


function _setReticlePropertiers() {
    _planeMesh.matrixAutoUpdate = false;
    _planeMesh.visible = false;
    _scene.add(_planeMesh);
    _addPlaneForReticleSurface();
    _initialized = true;
}


const _options = {
    radius: 0.2,
    innerRadius: 0.1,
    segments: 32,
    color: 0x00ff00
}

const MODE = {
    PLANE: 'plane',
    FREE: 'free'
}




const Reticle = {
    /**
     * Configura le opzioni per l'oggetto XrReticle.
     *
     * @param {Object} [options={}] - Oggetto delle opzioni di configurazione.
     * @param {THREE.WebGLRenderer} [options.renderer] - Il renderer da utilizzare.
     * @param {THREE.Scene} [options.scene] - La scena a cui aggiungere il reticolo.
     * @param {THREE.Camera} [options.camera] - La camera a cui aggiungere il cerchio.
     * @param {string} [options.fileName] - Il percorso del file GLTF da caricare come mesh del reticolo.
     * @param {number} [options.radius] - Il raggio esterno del reticolo.
     * @param {number} [options.innerRadius] - Il raggio interno del reticolo.
     * @param {number} [options.segments] - Il numero di segmenti del reticolo.
     * @param {number} [options.color] - Il colore del reticolo.
     */
    set(options = {}) {

        if (options.renderer) _renderer = options.renderer;
        if (options.scene) _scene = options.scene;
        if (options.camera) _camera = options.camera;

        if (!_renderer || !_scene || !_camera) {
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
                    _planeMesh = ref.clone();
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
                color: _options.color || 0xffffff, side: THREE.DoubleSide
            });
            _planeMesh = new THREE.Mesh(ringGeometry, material);
            _setReticlePropertiers();
        }

        // Add the circle in front of the camera
        // to use in place of plane detection
        const circleGeometry = new THREE.RingGeometry(0, 0.02, 24);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        _circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
        _camera.add(_circleMesh);
        _circleMesh.position.z = -1;
        _scene.add(_camera);

        // At the end, we set the default mode
        this.setUsePlaneDetection(true)
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
        if (_planeHidden) {
            _planeMesh.visible = false;
            return;
        }

        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }

        const referenceSpace = _renderer.xr.getReferenceSpace();
        const session = _renderer.xr.getSession();


        // Update camera from pose
        const framePose = frame.getViewerPose(referenceSpace);
        if (framePose) {
            var position = framePose.transform.position;
            var rotation = framePose.transform.orientation;
            _camera.position.set(position.x, position.y, position.z);
            _camera.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
            _camera.updateMatrixWorld();
        }



        // Check for hit source
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
                _planeMesh.visible = true;

                const hit = hitTestResults[0];
                const pose = hit.getPose(referenceSpace);
                const rawMatrix = pose.transform.matrix;
                const threeMatrix = new THREE.Matrix4();
                threeMatrix.fromArray(rawMatrix);
                let pos = new THREE.Vector3();
                let quat = new THREE.Quaternion();
                let scale = new THREE.Vector3();
                threeMatrix.decompose(pos, quat, scale);
                _planeMesh.position.copy(pos);
                _planeMesh.quaternion.copy(quat);
                _planeMesh.updateMatrix(); ////// NON QUI!!!!!!!!

                _surfType = _getReticleSurface();
                if (_surfType == 'wall') _alignZAxisWithUp();

                ///// MA QUI!!!!!

                if (callback) callback(_surfType);

            } else {
                _isHitting = false;
                _planeMesh.visible = false;
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

    // getHitPosition() {
    //     if (!_initialized) {
    //         console.error("Reticle is not set");
    //         return;
    //     }
    //     return _planeMesh.position;
    // },

    // getHitQuaternion() {
    //     if (!_initialized) {
    //         console.error("Reticle is not set");
    //         return;
    //     }
    //     return _planeMesh.quaternion;
    // },

    getHitMatrix() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        if (_reticleMode === MODE.PLANE) return _planeMesh.matrix;
        return _circleMesh.matrixWorld;
    },


    setHidden(value) {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        _planeHidden = value;
    },

    hidden() {
        return _planeHidden;
    },

    surfType() {
        if (!_initialized) {
            console.error("Reticle is not set");
            return;
        }
        return _surfType;
    },

    setUsePlaneDetection(value) {
        _reticleMode = value ? MODE.PLANE : MODE.FREE;

        console.log('reticle MODE:', _reticleMode)

        // switch (_reticleMode) {
        //     case MODE.PLANE:
        //     console.log("PLANE MODE");
        //     _circleMesh.visible = false;

        //     case MODE.FREE:
        //     console.log("FREE MODE");


        // }

    },
}

export default Reticle;   