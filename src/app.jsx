// SOLID
import { createSignal, createEffect, onMount } from 'solid-js'
import { Dynamic } from "solid-js/web"

// UI
import ArNotSupported from './components/ui/arNotSupported';
import Welcome from './components/ui/welcome';
import WaitingForSurface from './components/ui/waitingForSurface';
import SettingReference from './components/ui/settingReference';

// XR
import SceneManager from "./xr/sceneManager.js";
import Reticle from "./xr/reticle.js";
import Persistence from "./xr/persistence.js";


// AppState
const AppState = {
    AR_NOT_SUPPORTED: ArNotSupported,
    WELCOME: Welcome,
    WAITING_FOR_SURFACE: WaitingForSurface,
    SETTING_REFERENCE: SettingReference
};

// AppMode
const AppMode = {
    SAVE: "save",
    LOAD: "load"
}


// APP
function App() {
    const [currentState, setCurrentState] = createSignal(AppState.WELCOME);
    const [currentMode, setCurrentMode] = createSignal(AppMode.LOAD);



    /**
    * Lifecycle hook that runs after the component is mounted.
    * 
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



    /**
     * Initializes the AR scene and related components.
     *
     * - Sets up the SceneManager.
     * - Adds an event listener for the "select" event on the controller.
     * - Sets the animation loop for the renderer to the render function.
     * - Configures the Reticle with specified renderer, scene, color, radius, inner radius, and segments.
     *
     * This function should be called once AR support is confirmed.
     */
    function init() {

        // Init SceneManager
        SceneManager.init();
        SceneManager.controller.addEventListener("select", onSelect);
        SceneManager.renderer.setAnimationLoop(render);
        SceneManager.renderer.xr.addEventListener("sessionstart", () => {
            
            // Show UI WaitingForSurface
            setCurrentState(() => AppState.WAITING_FOR_SURFACE);
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

        
    }


    /**
     * Handles the rendering loop for the AR scene.
     * 
     * @param {DOMHighResTimeStamp} timestamp - The current time when the callback is run.
     * @param {XRFrame} frame - The XRFrame object for the current animation frame, if available.
     * 
     * If an XR frame is available, updates the Reticle based on the current frame and surface type.
     * Always updates the SceneManager for each animation frame.
     */
    function render(timestamp, frame) {
        if (frame) {
            Reticle.update(frame, (surfType) => {
                // console.log("surfType", surfType);

                if (surfType && currentState() === AppState.WAITING_FOR_SURFACE) {
                    
                    // Show UI SettingReference
                    setCurrentState(() => AppState.SETTING_REFERENCE);
                }
            });
        }
        SceneManager.update();
    }


    // On Select
    function onSelect() {

    }



    return (
        <>
            {
                <div id="overlay">
                    <Dynamic component={currentState()} setCurrentMode={setCurrentMode} />
                </div>
            }
        </>
    )

}

export default App;
export { AppState };