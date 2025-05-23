import { createSignal, createEffect } from 'solid-js'
import ArNotSupported from './components/ui/arNotSupported';

function App() {
    const [arSupported, setArSupported] = createSignal(true)


    // check for webxr session support
    if ("xr" in navigator) {
        navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

            document.getElementById("loading").style.display = "none";
            setArSupported(supported);
            if (supported) init();
        });
    }


    function init() {
        console.log("INIT!");
    }

    return (
        <>
            {!arSupported() && <ArNotSupported />}
            {/* {value() && (
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

export default App