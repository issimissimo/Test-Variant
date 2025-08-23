import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from '@js/gameBase';
import { styled } from 'solid-styled-components';
import SceneManager from '@js/sceneManager';
import { BoxGeometry, MeshBasicMaterial, Mesh, MeshPhysicalMaterial } from 'three';




export default function Baloons(props) {

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("baloons", {

        onTap: () => {

        },

        renderLoop: () => loop()

    });


    /*
    * DATA
    */



    /*
    * On mount
    */
    onMount(() => {
        console.log("Baloons: onMount")
        setupScene();
    });


    /*
    * SETUP SCENE
    */
    function setupScene() {

        /*
        * Don't forget to call "game.initialized()" at finish 
        */
        game.initialized();
    }


    /*
    * LOOP
    */
    function loop() {
        
    }




    /*
    * STYLE
    */
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



    /*
    * RENDER
    */
    return (
        props.showUI ?

            <Container>
                <Title>{game.gameDetails.title}</Title>
                <Description>{game.gameDetails.description}</Description>
                <Button
                    onClick={() => game.saveGame()}
                >Test salva game</Button>
            </Container>

            :
            <div />
    );

}