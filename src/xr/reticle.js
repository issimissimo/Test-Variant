import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class XrReticle {
    constructor(options = {}) {
        this.options = {
            renderer: options.renderer, // Il renderer Three.js
            scene: options.scene, // La scena Three.js in cui aggiungere il reticolo
            // session: options.session, // La sessione XR corrente
            glbFileName: options.glbFileName || null,
            color: options.color || 0xFFFFFF,
            radius: options.radius || 0.05,
            innerRadius: options.innerRadius || 0.02,
            segments: options.segments || 32,
            ringWidth: options.ringWidth || 0.002,
            pulseSpeed: options.pulseSpeed || 1.0,
            pulseMin: options.pulseMin || 0.5,
            pulseMax: options.pulseMax || 1.0,
            hitTestEnabled: options.hitTestEnabled !== undefined ? options.hitTestEnabled : true,
            visible: options.visible !== undefined ? options.visible : false,
            zUpOnWalls: options.zUpOnWalls !== undefined ? options.zUpOnWalls : true,
        };

        // Crea il mesh del reticolo
        this.mesh = this._createReticleMesh();


        // Elementi di stato
        // this.xrSession = this.options.session;
        this.hitTestSource = null;
        this.hitTestSourceRequested = false;
        this.lastHitPose = null;
        this.isHitting = false;

        // Variabili per l'animazione
        this.pulseValue = 1.0;
        this.pulseDirection = -1;
        this.clock = new THREE.Clock();

        // Variabili per il Piano di riferimento per l'orientamento del reticolo
        this.geomLookAt = null;
        this.reticleLookAt = null;
        this.reticleWorldPosition = new THREE.Vector3();
        this.reticleLookAtWorldPosition = new THREE.Vector3();
        this.reticleDirection = new THREE.Vector3();
        this.reticleLookAtDirection = new THREE.Vector3();
    }


    _createReticleMesh() {
        let mesh = null;

        // Carica il modello GLB se fornito
        if (this.options.glbFileName) {
            const loader = new GLTFLoader();
            loader.load(this.options.glbFileName, (gltf) => {
                mesh = gltf.scene;
            }, undefined, (error) => {
                alert('Errore nel caricamento del modello GLB:', error);
            });
        }
        // Crea un reticolo di base
        else {
            const ringGeometry = new THREE.RingGeometry(
                this.options.innerRadius,
                this.options.radius,
                this.options.segments
            ).rotateX(-Math.PI / 2);

            const material = new THREE.MeshBasicMaterial({
                color: this.options.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });

            mesh = new THREE.Mesh(ringGeometry, material);
            mesh.rotation.x = -Math.PI / 2;
        }

        mesh.visible = this.options.visible;
        mesh.matrixAutoUpdate = false;

        return mesh;

        // this.addToScene();


        // // Crea il Piano di riferimento per l'orientamento del reticolo
        // this.geomLookAt = new THREE.PlaneGeometry(0.05, 0.05);
        // this.reticleLookAt = new THREE.Mesh(
        //     this.geomLookAt.rotateX(-Math.PI / 2),
        //     new THREE.MeshBasicMaterial({ color: 0xff0000 })
        // );
        // this.reticleLookAt.translateY(0.3);
        // this.reticleLookAt.visible = false;
        // this.mesh.add(this.reticleLookAt);
    }

    addToScene() {
        this.options.scene.add(this.mesh);

    }

    removeFromScene() {
        this.options.scene.remove(this.mesh);
    }

    /**
     * Aggiorna il reticolo con lo stato corrente dell'XR Session
     * @param {XRFrame} frame - Il frame XR corrente
     * @param {XRReferenceSpace} referenceSpace - Lo spazio di riferimento XR
     */
    update(frame) {
        // Aggiorna l'animazione pulsante
        // this._updatePulse();





        const self = this;


        const referenceSpace = this.options.renderer.xr.getReferenceSpace();
        const session = this.options.renderer.xr.getSession();

        if (self.hitTestSourceRequested === false) {
            session.requestReferenceSpace("viewer").then(function (referenceSpace) {
                session
                    .requestHitTestSource({ space: referenceSpace })
                    .then(function (source) {
                        self.hitTestSource = source;
                    });
            });

            session.addEventListener("end", function () {
                self.hitTestSourceRequested = false;
                self.hitTestSource = null;
            });

            self.hitTestSourceRequested = true;
        }



        if (self.hitTestSource) {
            const hitTestResults = frame.getHitTestResults(self.hitTestSource);

            if (hitTestResults.length) {
                // if (!planeFound) {
                //     planeFound = true;
                //     //hide #tracking-prompt
                //     document.getElementById("tracking-prompt").style.display = "none";
                //     document.getElementById("instructions").style.display = "flex";
                //     console.log("plane found");
                // }
                this.mesh.visible = true;

                const hit = hitTestResults[0];
                // console.log(this.mesh);
                // reticle.visible = true;

                // console.log(this.mesh);
                // console.log(self.mesh);
                // return;


                const pose = hit.getPose(referenceSpace);
                const rawMatrix = pose.transform.matrix;
                const threeMatrix = new THREE.Matrix4();
                threeMatrix.fromArray(rawMatrix);
                let pos = new THREE.Vector3();
                let quat = new THREE.Quaternion();
                let scale = new THREE.Vector3();
                threeMatrix.decompose(pos, quat, scale);

                this.mesh.position.copy(pos);
                this.mesh.quaternion.copy(quat);
                this.mesh.updateMatrix();



                // const surf = getReticleSurface();

                // alignZAxisWithUp(reticle);

                // if (surf == 'wall') {
                //     alignZAxisWithUp(reticle);
                // }







                // data_output.innerHTML = surf;


            } else {
                this.mesh.visible = this.options.visible;
            }
        }


    }

    /**
     * Richiede una sorgente di hit test per la sessione XR
     * @param {XRReferenceSpace} referenceSpace - Lo spazio di riferimento XR
     * @private
     */
    _requestHitTestSource(referenceSpace) {
        if (!this.xrSession) return;

        this.xrSession.requestReferenceSpace('viewer')
            .then((viewerSpace) => {
                this.xrSession.requestHitTestSource({
                    space: viewerSpace
                }).then((source) => {
                    this.hitTestSource = source;
                }).catch(err => {
                    console.error('Error creating hit test source:', err);
                    this.hitTestSourceRequested = false;
                });
            }).catch(err => {
                console.error('Error requesting viewer reference space:', err);
                this.hitTestSourceRequested = false;
            });
    }

    /**
     * Aggiorna l'effetto pulsante del reticolo
     * @private
     */
    _updatePulse() {
        const deltaTime = this.clock.getDelta();
        console.log(this.mesh);

        // Aggiorna il valore della pulsazione
        this.pulseValue += this.pulseDirection * deltaTime * this.options.pulseSpeed;

        // Inverte la direzione quando raggiunge i limiti
        if (this.pulseValue <= this.options.pulseMin) {
            this.pulseValue = this.options.pulseMin;
            this.pulseDirection = 1;
        } else if (this.pulseValue >= this.options.pulseMax) {
            this.pulseValue = this.options.pulseMax;
            this.pulseDirection = -1;
        }

        // Applica la scala pulsante
        this.mesh.scale.set(this.pulseValue, this.pulseValue, this.pulseValue);

        // Aggiorna anche l'opacità per un effetto migliore
        if (this.mesh.material) {
            this.mesh.material.opacity = 0.6 * this.pulseValue;
        }
    }

    /**
     * Allinea il reticolo alla superficie colpita
     * @param {XRQuaternion} orientation - L'orientamento della superficie
     * @private
     */
    _alignToSurface(orientation) {
        if (!orientation) return;

        // Converti il quaternione XR in quaternione Three.js
        const quaternion = new THREE.Quaternion(
            orientation.x,
            orientation.y,
            orientation.z,
            orientation.w
        );

        // Assicura che l'asse Z punti verso l'alto
        const zAxis = new THREE.Vector3(0, 0, 1);
        zAxis.applyQuaternion(quaternion);

        const upVector = new THREE.Vector3(0, 1, 0);
        const alignQuaternion = new THREE.Quaternion();
        alignQuaternion.setFromUnitVectors(zAxis, upVector);

        quaternion.premultiply(alignQuaternion);

        // Applica il quaternione al reticolo
        this.mesh.quaternion.copy(quaternion);

        // Assicurati che il reticolo sia sempre rivolto verso l'alto
        this.mesh.rotation.x = -Math.PI / 2;
    }


    getReticleSurface() {
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

    /**
     * Imposta la sessione XR
     * @param {XRSession} session - La sessione XR
     */
    setXRSession(session) {
        this.xrSession = session;
        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
    }

    /**
     * Termina e pulisce le risorse
     */
    dispose() {
        if (this.hitTestSource) {
            this.hitTestSource.cancel();
            this.hitTestSource = null;
        }

        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }

        if (this.mesh.material) {
            this.mesh.material.dispose();
        }

        this.hitTestSourceRequested = false;
        this.xrSession = null;
    }

    /**
     * Restituisce la posizione corrente del reticolo
     * @returns {THREE.Vector3} La posizione del reticolo
     */
    getPosition() {
        return this.mesh.position.clone();
    }

    /**
     * Verifica se il reticolo sta colpendo una superficie
     * @returns {boolean} True se il reticolo sta colpendo una superficie
     */
    isHittingSurface() {
        return this.isHitting;
    }


    setVisible(visible) {
        this.options.visible = visible;
        this.mesh.visible = visible && this.isHitting;
    }

    /**
     * Imposta il colore del reticolo
     * @param {number} color - Il colore in formato esadecimale
     */
    setColor(color) {
        this.options.color = color;
        if (this.mesh.material) {
            this.mesh.material.color.set(color);
        }
    }

    /**
     * Imposta il raggio del reticolo
     * @param {number} radius - Il raggio del reticolo
     */
    setRadius(radius) {
        this.options.radius = radius;
        this._updateGeometry();
    }

    /**
     * Imposta il raggio interno del reticolo
     * @param {number} radius - Il raggio interno del reticolo
     */
    setInnerRadius(radius) {
        this.options.innerRadius = radius;
        this._updateGeometry();
    }

    /**
     * Aggiorna la geometria del reticolo
     * @private
     */
    _updateGeometry() {
        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }

        this.mesh.geometry = new THREE.RingGeometry(
            this.options.innerRadius,
            this.options.radius,
            this.options.segments
        );
    }

    /**
     * Imposta i parametri di pulsazione
     * @param {Object} pulseOptions - Opzioni di pulsazione
     * @param {number} pulseOptions.speed - Velocità di pulsazione
     * @param {number} pulseOptions.min - Valore minimo di pulsazione
     * @param {number} pulseOptions.max - Valore massimo di pulsazione
     */
    setPulseOptions(pulseOptions) {
        if (pulseOptions.speed !== undefined) {
            this.options.pulseSpeed = pulseOptions.speed;
        }

        if (pulseOptions.min !== undefined) {
            this.options.pulseMin = pulseOptions.min;
        }

        if (pulseOptions.max !== undefined) {
            this.options.pulseMax = pulseOptions.max;
        }
    }
}