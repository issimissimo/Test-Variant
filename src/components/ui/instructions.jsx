// SOLID
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'
import { Dynamic } from "solid-js/web"


function Instructions(props) {

    const [problems, setProblems] = createSignal(false);

    const WaitingForSurface = () => (<div>
        {problems() ? "Prova ad allontanarti" : "Inquadra il piano"}
        <img src="hand.png" />
    </div>
    )

    const SettingReference = () => (<div>
        CENTRA IL MARKER
    </div>
    )

    // State
    const State = {
        WAITING_FOR_SURFACE: WaitingForSurface,
        SETTING_REFERENCE: SettingReference
    };

    const [currentState, setCurrentState] = createSignal(State.WAITING_FOR_SURFACE)




    let timeout = null;

    onMount(() => {
        timeout = setTimeout(() => { setProblems(true) }, 2000)
    });

    onCleanup(() => {
        clearTimeout(timeout);
    });

    createEffect(() => {
        if (props.planeFound()) {
            console.log("plane is found!")
            setCurrentState(() => State.SETTING_REFERENCE);
            clearTimeout(timeout);
        }
        else {
            console.log("plane NOT found....")
            if (currentState() === State.WAITING_FOR_SURFACE) {

            }
            if (currentState() === State.SETTING_REFERENCE) {

            }
        }
    });

    return (
        // <Dynamic component={currentState()} />
        <div>
            {WaitingForSurface}
            {/* <Dynamic component={currentState()} /> */}
        </div>
    );
}
export default Instructions