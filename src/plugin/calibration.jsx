import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { config } from '@js/config';
import { styled } from 'solid-styled-components';
import Reticle from '@js/reticle';
import { Matrix4 } from 'three';


export default function Calibration(props) {

    const [difficult, setDifficult] = createSignal(false)

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("calibration", {

        onTap: () => {
            // // Call super
            // interactable.super.onTap();

            // if (props.planeFound || !Reticle.usePlaneDetection()) {
            //     props.setReferenceMatrix(Reticle.getHitMatrix());
            // }
        },

        renderLoop: () => {
            // console.log("Calibration anim in loop!")
        }
    });



    onMount(() => {

        Reticle.set({
            fileName: 'models/gizmo.glb'
        });

        console.log("App MODE:", game.appMode);
    });



    const handleOnDone = () => {
        if (config.debugOnDesktop) {
            console.warn("Siccome siamo in debug su desktop procediamo senza un reale ancoraggio");
            const fakeHitMatrix = new Matrix4();
            props.setReferenceMatrix(fakeHitMatrix);
        }
        else {
            if (props.planeFound) {
                props.setReferenceMatrix(Reticle.getHitMatrix());
            }
        }
    }



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

            <button
                onClick={handleOnDone}
            >DONE</button>
        </div>
    );
}
