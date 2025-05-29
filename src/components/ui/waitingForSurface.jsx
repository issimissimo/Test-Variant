// SOLID
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

function WaitingForSurface() {
    const [problems, setProblems] = createSignal(false);

    let timeout;

    onMount(() => {
        console.log("MOUNTED!!!")
        timeout = setTimeout(() => { setProblems(true) }, 3000)
    })

    onCleanup(() => {
        // console.log("...unmounted :(");
        clearTimeout(timeout);
    });

    return (
        <>
            {<div id="instructions">
                {problems() ? "Prova ad allontanarti" : "Inquadra il piano" }
                <img src="hand.png" />
            </div>}
        </>
    )
}

export default WaitingForSurface