import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

let _initialized = false;

const SceneManager = {
    init() {
        if (_initialized) {
            console.warn("Scene already initialized");
            return;
        }
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        this.light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        this.light.position.set(0.5, 1, 0.25);
        this.scene.add(this.light);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        this.controller = this.renderer.xr.getController(0);
        this.scene.add(this.controller);
        this.container = document.createElement("div");
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);
        window.addEventListener("resize", _onWindowResize);

        document.body.appendChild(
            ARButton.createButton(this.renderer, {
                requiredFeatures: ["local", "hit-test", "dom-overlay"],
                domOverlay: { root: document.querySelector("#overlay") },
            })
        );

        _initialized = true;
    },

    // _initScene() {
    //     this.scene = new THREE.Scene();
    // },

    // _initCamera() {
    //     this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    //     this.camera.position.set(0, 0, 2);
    //     this.light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    //     this.light.position.set(0.5, 1, 0.25);
    //     this.scene.add(this.light);
    // },

    // _initRenderer() {
    //     this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //     this.renderer.setPixelRatio(window.devicePixelRatio);
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    //     this.renderer.xr.enabled = true;
    //     document.body.appendChild(this.renderer.domElement);

    //     // Espone l'oggetto renderer per poter accedere a xr dall'esterno
    //     // Gli eventi possono essere sottoscritti tramite SceneManager.renderer.xr.addEventListener(...)
    // },

    // _initController() {
    //     const controller = this.renderer.xr.getController(0);
    //     this.scene.add(controller);
    // },

    // _initReticle() {
    //     // Initialize reticle here
    // },

    // _initPersistence() {
    //     // Initialize persistence here
    // },

    update() {
        this.renderer.render(this.scene, this.camera);
    },

    _onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    // Add a mesh to the scene
    // mesh: THREE.Mesh, matrix: THREE.Matrix4, name: string, matrixAutoUpdate: boolean, visible: boolean,  
    addMesh(mesh, matrix, name = "", matrixAutoUpdate = true, visible = true) {
        mesh.matrix.copy(matrix);
        mesh.matrixAutoUpdate = matrixAutoUpdate;
        mesh.visible = visible;
        mesh.name = name;
        this.scene.add(mesh);
    },

    addTestCube(matrix, size) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        matrix.decompose(cube.position, cube.quaternion, cube.scale);
        this.scene.add(cube);
    },
}

export default SceneManager;