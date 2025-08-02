import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { styled } from 'solid-styled-components';
import Reticle from '@xr/reticle';


export default function Calibration(props) {
    const [difficult, setDifficult] = createSignal(false)

    /*
    * Put here derived functions from Game
    */
    const { game  } = useGame("Calibration", {

        onTap: () => {
            // // Call super
            // interactable.super.onTap();

            if (props.planeFound || !Reticle.usePlaneDetection()) {
                props.setReferenceMatrix(Reticle.getHitMatrix());
            }
        },

        renderLoop: () => {
            console.log("Calibration anim in loop!")
        }
    });



    onMount(() => {

        Reticle.set({
            fileName: 'models/gizmo.glb'
        });

        console.log("App MODE:", game.appMode);
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
