import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { styled } from 'solid-styled-components';
import SceneManager from '@xr/sceneManager';
import { BoxGeometry, MeshBasicMaterial, Mesh, MeshPhysicalMaterial } from 'three';




export default function BasicRotCube(props) {

    /*
    * Put here derived functions from Game
    */
    const { game } = useGame("basicRotCube", {

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
        setupScene();
    });


    /*
    * SETUP SCENE
    */
    let cube;
    function setupScene() {
        const geometry = new BoxGeometry(0.5, 0.5, 0.5);
        const material = new MeshBasicMaterial({ color: 0x00ff00 });
        const material2 = new MeshPhysicalMaterial({ color: 0x00ff00, metalness: 0, roughness: 0.1 });
        cube = new Mesh(geometry, material2);
        cube.position.z = -5;
        SceneManager.scene.add(cube);
    }


    /*
    * LOOP
    */
    function loop() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
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
        <Container>
            <Title>{game.gameDetails.title}</Title>
            <Description>{game.gameDetails.description}</Description>
            <Button
                onClick={() => game.saveGame()}
            >Test salva game</Button>
        </Container>
    );

}