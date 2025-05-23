// SOLID
import { createSignal, createEffect } from 'solid-js'
import { Dynamic } from "solid-js/web"

// UI
import ArNotSupported from './components/ui/arNotSupported';
import Welcome from './components/ui/welcome';

// XR
import SceneManager from "./xr/sceneManager.js";
import Reticle from "./xr/reticle.js";
import Persistence from "./xr/persistence.js";


// AppState
const AppState = {
    AR_NOT_SUPPORTED: ArNotSupported,
    WELCOME: Welcome,
};

// AppMode
const AppMode = {
    SAVE: "save",
    LOAD: "load"
}


// APP
function App() {
    // const [arSupported, setArSupported] = createSignal(true);
    const [currentState, setCurrentState] = createSignal(AppState.WELCOME);
    const [currentMode, setCurrentMode] = createSignal(AppMode.LOAD);




    // 1 - check for webxr session support
    if ("xr" in navigator) {
        navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
            document.getElementById("loading").style.display = "none";
            // setArSupported(supported);

            if (!supported){
                console.log("NOOOOOOOOOOOOO")
                setCurrentState(AppState.AR_NOT_SUPPORTED);
            } 
            else init();

            // if (supported) init();
        });
    }


    // 2 - initialize
    function init() {
        SceneManager.init();
        SceneManager.controller.addEventListener("select", onSelect);
        SceneManager.renderer.setAnimationLoop(render);

        Reticle.set({
            renderer: SceneManager.renderer,
            scene: SceneManager.scene,
            color: 0x00ff00,
            radius: 0.06,
            innerRadius: 0.05,
            segments: 4,
        })


    }


    // 3 - render
    function render(timestamp, frame) {
        if (frame) {

            Reticle.update(frame, (surfType) => {
                ///console.log("surfType", surfType);
            });
        }
        SceneManager.update();
    }


    // On Select
    function onSelect() {

    }



    return (
        <>
            {/* {!arSupported() && <ArNotSupported />} */}
            {
                <div id="overlay">
                    <Dynamic component={currentState()}/>
                </div>

                /* {value() && (
                <div class="card">
                    <div>
                        La scritta compare solo se value è true
                        <button onClick={() => setCount((count) => count + 1)}>
                            count is {count()}
                        </button>
                        <p>
                            {count()}
                        </p>
                    </div>
                </div>
            )} */}
        </>
    )

}

export default App;
export { AppState };