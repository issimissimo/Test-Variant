import {
    Scene,
    PerspectiveCamera,
    HemisphereLight,
    WebGLRenderer,
    Matrix4,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

export const useThree = (options = {}) => {
    // Configurazione con valori di default
    const config = {
        container: document.body,
        fov: 70,
        near: 0.01,
        far: 20,
        lightColor: 0xffffff,
        groundColor: 0xbbbbff,
        lightIntensity: 1,
        antialias: true,
        alpha: true,
        enableXR: true,
        domOverlayRoot: '#overlay',
        onSessionStart: null,
        onSessionEnd: null,
        onSelect: null,
        onRender: null,
        ...options
    };

    // Stato interno
    const state = {
        scene: null,
        camera: null,
        renderer: null,
        controller: null,
        hitTestSource: null,
        hitTestSourceRequested: false,
        xrSession: null,
        cleanupCallbacks: []
    };

    // Funzione per aggiungere callback di cleanup
    const addCleanup = (callback) => {
        state.cleanupCallbacks.push(callback);
    };

    // Inizializzazione
    const init = () => {
        // 1. Creazione scena
        state.scene = new Scene();

        // 2. Configurazione camera
        state.camera = new PerspectiveCamera(
            config.fov,
            config.container.clientWidth / config.container.clientHeight,
            config.near,
            config.far
        );

        // 3. Illuminazione
        const hemisphereLight = new HemisphereLight(
            config.lightColor,
            config.groundColor,
            config.lightIntensity
        );
        hemisphereLight.position.set(0.5, 1, 0.25);
        state.scene.add(hemisphereLight);

        // 4. Renderer
        state.renderer = new WebGLRenderer({
            antialias: config.antialias,
            alpha: config.alpha
        });
        state.renderer.setPixelRatio(window.devicePixelRatio);
        state.renderer.setSize(
            config.container.clientWidth,
            config.container.clientHeight
        );

        // 5. Abilitazione WebXR
        if (config.enableXR) {
            state.renderer.xr.enabled = true;

            // Controller XR
            state.controller = state.renderer.xr.getController(0);
            state.scene.add(state.controller);

            // Aggiunta ARButton
            const arButton = ARButton.createButton(state.renderer, {
                requiredFeatures: ["local", "hit-test", "dom-overlay"],
                domOverlay: { root: document.querySelector(config.domOverlayRoot) },
            });
            config.container.appendChild(arButton);

            // Registra cleanup per il bottone
            addCleanup(() => {
                if (arButton.parentNode) {
                    arButton.parentNode.removeChild(arButton);
                }
            });

            // Setup event listeners
            if (config.onSessionStart) {
                state.renderer.xr.addEventListener('sessionstart', config.onSessionStart);
                addCleanup(() => {
                    state.renderer.xr.removeEventListener('sessionstart', config.onSessionStart);
                });
            }

            if (config.onSessionEnd) {
                state.renderer.xr.addEventListener('sessionend', config.onSessionEnd);
                addCleanup(() => {
                    state.renderer.xr.removeEventListener('sessionend', config.onSessionEnd);
                });
            }

            if (config.onSelect) {
                state.controller.addEventListener('select', config.onSelect);
                addCleanup(() => {
                    state.controller.removeEventListener('select', config.onSelect);
                });
            }
        }

        // 6. Aggiunta al DOM
        config.container.appendChild(state.renderer.domElement);
        addCleanup(() => {
            if (state.renderer.domElement.parentNode) {
                state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
            }
        });

        // 7. Gestione resize
        const onResize = () => {
            state.camera.aspect = config.container.clientWidth / config.container.clientHeight;
            state.camera.updateProjectionMatrix();
            state.renderer.setSize(
                config.container.clientWidth,
                config.container.clientHeight
            );
        };

        window.addEventListener("resize", onResize);
        addCleanup(() => window.removeEventListener("resize", onResize));

        // 8. Setup render loop se specificato
        if (config.onRender) {
            startRenderLoop(config.onRender);
        }

        return state;
    };

    // Funzione di cleanup completo
    const cleanup = () => {
        // Esegui tutte le callback di cleanup
        state.cleanupCallbacks.forEach(cb => cb());
        state.cleanupCallbacks = [];

        // Dispose del renderer
        if (state.renderer) {
            state.renderer.dispose();
            state.renderer = null;
        }

        // Pulisci le altre proprietà
        state.scene = null;
        state.camera = null;
        state.controller = null;
        state.hitTestSource = null;
        state.hitTestSourceRequested = false;
        state.xrSession = null;
    };

    // Caricamento GLTF
    const loadGltf = (fileName) => {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                fileName,
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(error)
            );
        });
    };

    // Aggiunta di un modello alla scena
    const addGltfToScene = (gltf, matrix, name = "", childrenNumber = 0, matrixAutoUpdate = true, visible = true) => {
        const ref = gltf.children[childrenNumber];
        const mesh = ref.clone();
        matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        mesh.matrixAutoUpdate = matrixAutoUpdate;
        mesh.visible = visible;
        mesh.name = name;
        state.scene.add(mesh);
        return mesh;
    };

    // Funzione di render di base
    const render = () => {
        if (state.renderer) {
            state.renderer.render(state.scene, state.camera);
        }
    };

    // Funzione per avviare il render loop
    const startRenderLoop = (renderCallback) => {
        if (state.renderer) {
            state.renderer.setAnimationLoop((timestamp, frame) => {
                // Chiamata alla funzione di render fornita dall'utente
                if (renderCallback) renderCallback(timestamp, frame);

                // Render di base
                render();
            });

            addCleanup(() => stopRenderLoop());
        }
    };

    // Funzione per fermare il render loop
    const stopRenderLoop = () => {
        if (state.renderer) {
            state.renderer.setAnimationLoop(null);
        }
    };

    // Metodi per aggiornare i callback a runtime
    const setOnSessionStart = (callback) => {
        // Rimuovi il vecchio listener se esiste
        if (config.onSessionStart && state.renderer) {
            state.renderer.xr.removeEventListener('sessionstart', config.onSessionStart);
        }

        config.onSessionStart = callback;

        if (callback && state.renderer) {
            state.renderer.xr.addEventListener('sessionstart', callback);
            addCleanup(() => {
                state.renderer.xr.removeEventListener('sessionstart', callback);
            });
        }
    };

    const setOnSessionEnd = (callback) => {
        if (config.onSessionEnd && state.renderer) {
            state.renderer.xr.removeEventListener('sessionend', config.onSessionEnd);
        }

        config.onSessionEnd = callback;

        if (callback && state.renderer) {
            state.renderer.xr.addEventListener('sessionend', callback);
            addCleanup(() => {
                state.renderer.xr.removeEventListener('sessionend', callback);
            });
        }
    };

    const setOnSelect = (callback) => {
        if (config.onSelect && state.controller) {
            state.controller.removeEventListener('select', config.onSelect);
        }

        config.onSelect = callback;

        if (callback && state.controller) {
            state.controller.addEventListener('select', callback);
            addCleanup(() => {
                state.controller.removeEventListener('select', callback);
            });
        }
    };

    const setOnRender = (callback) => {
        config.onRender = callback;
        if (state.renderer) {
            stopRenderLoop();
            startRenderLoop(callback);
        }
    };

    // Inizializza immediatamente
    init();

    return {
        // Stato
        scene: state.scene,
        camera: state.camera,
        renderer: state.renderer,
        controller: state.controller,

        // Funzioni principali
        loadGltf,
        addGltfToScene,
        addTestCube,
        render,
        startRenderLoop,
        stopRenderLoop,
        cleanup,

        // Setters per i callback
        setOnSessionStart,
        setOnSessionEnd,
        setOnSelect,
        setOnRender,

        // 
        matrix: new Matrix4(),

        // Funzione per riconfigurare
        reconfigure: (newOptions) => {
            cleanup();
            Object.assign(config, newOptions);
            init();
        }
    };
};