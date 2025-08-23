import { onMount, createEffect } from 'solid-js';
import { useGame } from '@js/gameBase';
import { styled } from 'solid-styled-components';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";




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



    /*
    * On mount
    */
    onMount(() => {
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
        const gltflLoader = new GLTFLoader()
        const gltf = await gltflLoader.loadAsync("models/baloons.glb");
        const model = gltf.scene;
        model.position.z = -5;
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
            </Container>

            :
            <div />
    );

}