import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useInteractable } from './hooks';

import { styled } from 'solid-styled-components';

// import SceneManager from '../../xr/sceneManager';
import Reticle from '../../xr/reticle';


export default function Calibration(props) {
    const [difficult, setDifficult] = createSignal(false)

    onMount(() => {

        // Setup Reticle for calibration
        // Reticle.set({
        //     renderer: SceneManager.renderer,
        //     scene: SceneManager.scene,
        //     camera: SceneManager.camera,
        //     fileName: 'models/gizmo.glb'
        // });
        Reticle.set({
            fileName: 'models/gizmo.glb'
        });
    });

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


    // Put here derived functions
    // from useInteractable
    const { interactable } = useInteractable("calibration", {

        onTap: () => {
            // Call super
            interactable.super.onTap();

            // function
            console.log("calibration: onTap");
        }
    });


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
