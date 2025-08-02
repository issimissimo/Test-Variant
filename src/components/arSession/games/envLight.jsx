import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { styled } from 'solid-styled-components';
import SceneManager from '@xr/sceneManager';

export default function EnvLight(props) {

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("Environment light", {

        onTap: () => {

        },

        renderLoop: () => {
            console.log("Environment light anim in loop!")
        }
    });


    const [appMode, setAppMode] = createSignal(game.appMode);

    


    return (
        <div>
            <h1>ENV LIGHT</h1>
        </div>
    );

}