import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { styled } from 'solid-styled-components';
import SceneManager from '@xr/sceneManager';

export default function EnvLight(props) {

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("envLight", {

        onTap: () => {

        },

        renderLoop: () => {
            // console.log("Environment light anim in loop!")
        }
    });


    onMount(() => {

        // console.log("App MODE:", game.appMode);
        // console.log("stored:", props.stored);
        // console.log("DETAILS:", game.gameDetails)


        if (props.stored) {
            // Todo: load the data from Realtime DB

        }
    });


    const Container = styled('div')`
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 2em;
    `
    const Title = styled('h2')`
        text-align: center;
    `

    const Description = styled('p')`
        text-align: center;
    `

    const Button = styled('button')`
        margin: 1em;
    `

    return (
        <Container>
            <Title>{game.gameDetails.title}</Title>
            <Description>{game.gameDetails.description}</Description>
            <Button>Test salva game e dati</Button>
            <Button>Test carica dati</Button>
        </Container>
    );

}