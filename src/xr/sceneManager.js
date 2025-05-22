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
        this.container = document.createElement("div");

        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);

        this.controller = this.renderer.xr.getController(0);
        this.scene.add(this.controller);

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.body.appendChild(
            ARButton.createButton(this.renderer, {
                requiredFeatures: ["local", "hit-test", "dom-overlay"],
                domOverlay: { root: document.querySelector("#overlay") },
            })
        );

        _initialized = true;
    },


    update() {
        this.renderer.render(this.scene, this.camera);
    },

    // Add a mesh to the scene
    // mesh: THREE.Mesh, matrix: THREE.Matrix4, name: string, matrixAutoUpdate: boolean, visible: boolean,  
    addGltfToScene(gltf, matrix, name = "", childrenNumber = 0, matrixAutoUpdate = true, visible = true) {
        console.log("3")
        console.log(gltf)
        const ref = gltf.children[childrenNumber];
        const mesh = ref.clone();
        matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.matrixAutoUpdate = matrixAutoUpdate;
        mesh.visible = visible;
        mesh.name = name;
        this.scene.add(mesh);
        return mesh;
    },

    addTestCube(matrix, size = 0.2, name = "testCube") {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        matrix.decompose(cube.position, cube.quaternion, cube.scale);
        cube.name = name;
        this.scene.add(cube);
    },

    // loadGltf(fileName) {
    //     const loader = new GLTFLoader();
    //     loader.load(
    //         fileName,
    //         (gltf) => {
    //             // this.scene.add(gltf.scene);
    //             console.log("AAAAA")
    //             console.log(gltf.scene)
    //             return gltf.scene;
    //         },
    //         (xhr) => {
    //             // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //         },
    //         (error) => {
    //             console.error('An error happened', error);
    //             return null;
    //         }
    //     );
    // },

    loadGltf(fileName) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                fileName,
                (gltf) => {
                    resolve(gltf.scene);
                },
                (xhr) => {
                    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        });
    }
}

export default SceneManager;