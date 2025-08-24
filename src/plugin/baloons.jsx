import { onMount, createEffect } from 'solid-js';
import { useGame } from '@js/gameBase';
import { styled } from 'solid-styled-components';


export default function Baloons(props) {

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("baloons", props.id, {

        onTap: () => {

        },

        renderLoop: () => loop()

    });


    /*
    * DATA
    */
    const defaultGameData = {
        fileName: "images/hdr/studio.hdr",
        rotation: 0
    }


    /*
    * On mount
    */
    onMount(() => {
        game.loader.load("models/baloon.glb");
    });


    /*
    * On localizationCompleted
    */
    createEffect(() => {
        if (game.localizationCompleted()) {
            setupScene();
        }
    })


    /*
    * SETUP SCENE
    */
    async function setupScene() {

        const model = game.loader.gltf.scene;
        model.position.z = -3;
        game.addToScene(model);




        /*
        * Don't forget to call "game.initialized()" at finish 
        */
        game.initialized();
    }


    /*
    * LOOP
    */
    function loop() {
        if (game.loader.loaded())
            game.loader.animate();
    }




    /*
    * STYLE
    */
    const Container = styled('div')`
    position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 2em;
        pointer-events: none;
    `
    const Title = styled('h2')`
        text-align: center;
    `

    const Description = styled('p')`
        text-align: center;
    `


    /*
    * RENDER
    */
    return (
        props.showUI ?

            <Container>
                <Title>{game.gameDetails.title}</Title>
                <Description>{game.gameDetails.description}</Description>
            </Container>

            :
            <div />
    );

}