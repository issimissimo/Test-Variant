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
    const defaultGameData = [
        {
            position: "la posizione del primo baloon",
        },
        {
            position: "la posizione del secondo baloon",
        }
    ]


    /*
    * On mount
    */
    onMount(async () => {
        const gltf = await game.loader.load("models/baloon.glb");

        /*
        * Don't forget to call "game.initialized()" at finish 
        */
        game.initialized();
    });


    /*
    * On localizationCompleted
    */
    createEffect(() => {
        if (game.localizationCompleted()) {

            async function waitForGltf() {
                while (!game.loader.gltf) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                setupScene();
            }

            waitForGltf();
            // setupScene();
        }
    })


    /*
    * SETUP SCENE
    */
    async function setupScene() {

        const model = game.loader.gltf.scene;
        model.position.z = -3;
        game.addToScene(model);


        /// test per aggiungere dati
        game.setGameData(defaultGameData);
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
        props.selected ?

            <Container>
                <Title>{game.gameDetails.title}</Title>
                <Description>{game.gameDetails.description}</Description>
            </Container>

            :
            <div />
    );

}