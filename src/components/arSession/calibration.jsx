import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import useInteractable from './useInteractable';

import { styled } from 'solid-styled-components';




export default function Calibration(props) {
    const [difficult, setDifficult] = createSignal(false)

    let timeout = null;

    // createEffect(() => {
    //     if (!props.planeFound) {
    //         timeout = setTimeout(() => {
    //             setDifficult(() => true);
    //         }, 10000);
    //     }
    //     return () => clearTimeout(timeout)
    // })


    // onCleanup(() => {
    //     if (timeout) clearTimeout(timeout)
    // })


    const interactable = useInteractable("calibration", {

        // Override completo - sostituisce tutto
        onTap: () => {
            console.log("calibration: onTap");
        }
    });

    // Add this interactable
    props.onInteractableReady?.(interactable);


    return (
        <div>
            {props.planeFound ?
                <div>
                    FOUND!
                </div>
                :
                <div>
                    LOOK...
                </div>
            }
        </div>
    );
}
