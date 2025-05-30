// SOLID
import { createSignal, createEffect, onMount } from 'solid-js'
import { Dynamic } from "solid-js/web"

//HOPE-UI
import { HopeProvider } from '@hope-ui/solid'

// UI
import ArNotSupported from './components/ui/arNotSupported';
import Welcome from './components/ui/welcome';
import Calibration from './components/ui/calibration';
import Game from './components/ui/game';


// XR
import SceneManager from "./xr/sceneManager.js";
import Reticle from "./xr/reticle.js";
import Persistence from "./xr/persistence.js";


// AppState
export const AppState = {
    AR_NOT_SUPPORTED: ArNotSupported,
    WELCOME: Welcome,
    CALIBRATION: Calibration,
    GAME: Game,
};

// AppMode
export const AppMode = {
    SAVE: "save",
    LOAD: "load"
}

// Hope-UI theme
const AppTheme = {
    initialColorMode: "dark",
}



// APP
function App() {
    const [currentState, setCurrentState] = createSignal(AppState.WELCOME);
    const [currentMode, setCurrentMode] = createSignal(AppMode.LOAD);
    const [planeFound, setPlaneFound] = createSignal(false);


    /**
    * Checks if the WebXR API is available in the browser. If available, it verifies
    * support for "immersive-ar" sessions. Hides the loading indicator and updates
    * the application state based on AR support. If AR is supported, initializes the AR scene.
    */
    onMount(() => {
        if ("xr" in navigator) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
                document.getElementById("loading").style.display = "none";

                if (!supported) setCurrentState(() => AppState.AR_NOT_SUPPORTED);
                else init();
            });
        }
    });



    createEffect(() => {
        console.log("AppMode:", currentMode());
        console.log("PlaneFound:", planeFound());
    });


    /**
     * Initializes the AR scene and related components.
     * This function should be called once AR support is confirmed.
     */
    function init() {

        // Init SceneManager
        SceneManager.init();
        // SceneManager.controller.addEventListener("select", onSelect);
        SceneManager.renderer.setAnimationLoop(render);
        SceneManager.renderer.xr.addEventListener("sessionstart", () => {

            // Show Calibration when AR button is clicked
            setCurrentState(() => AppState.CALIBRATION);
        });


        // Init Reticle
        Reticle.set({
            renderer: SceneManager.renderer,
            scene: SceneManager.scene,
            color: 0x00ff00,
            radius: 0.06,
            innerRadius: 0.05,
            segments: 4,
        })


    };


    /**
     * Handles the rendering loop for the AR scene.
     * 
     * If an XR frame is available, updates the Reticle based on the current frame and surface type.
     * Always updates the SceneManager for each animation frame.
     */
    function render(timestamp, frame) {

        if (frame) {
            Reticle.update(frame, (surfType) => {
            });
            setPlaneFound(Reticle.isHitting())
        }
        SceneManager.update();
    };


    // On Select
    // function onSelect() {
    //     console.log("SELECT2")
    //     if (currentState() !== AppState.GAME) return;
    // };

    const myTest = () => {
        console.log("MY TEST")
    }

    let gizmo;
    /**
     * START GAME
     * 
     */
    async function startGame() {
        console.log("startGame")
        setCurrentState(() => AppState.GAME);

        const hitMatrix = Reticle.getHitMatrix();

        gizmo = await SceneManager.loadGltf("temp.glb");

        // Initialize the persistence system
        // if (!Persistence.isInitialized()) {
        Persistence.init(hitMatrix);
        SceneManager.addGltfToScene(gizmo, hitMatrix, "reference");

        // Load all saved matrix
        if (currentMode() === AppMode.LOAD) {

            const modelsMatrix = Persistence.load();
            modelsMatrix.forEach((matrix) => {
                console.log(matrix)
                SceneManager.addTestCube(matrix);
            });
        }

        // }
    };


    /**
     * Renders the main application UI wrapped in a HopeProvider with the specified theme.
     * Displays an overlay containing a dynamic component based on the current application state.
     *
     */
    return (
        <HopeProvider config={AppTheme}>
            <div id="overlay">
                <Dynamic
                    component={currentState()}
                    currentMode={currentMode()}
                    setCurrentMode={setCurrentMode}
                    planeFound={planeFound()}
                    startGame={startGame}
                    onButtonClick={myTest}
                />
            </div>
        </HopeProvider>
    );
}

export default App;
