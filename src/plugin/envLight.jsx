import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { useGame } from './common';
import { styled } from 'solid-styled-components';
import SceneManager from '@js/sceneManager';

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EquirectangularReflectionMapping } from 'three';

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


    /*
    * DATA
    */
    const [gameData, setGameData] = createSignal(null)

    const defaultGameData = {
        fileName: "images/hdr/studio.hdr",
        rotation: 0
    }


    /*
    * On mount
    */
    onMount(() => {

        // console.log("App MODE:", game.appMode);
        // console.log("stored:", props.stored);
        // console.log("DETAILS:", game.gameDetails)


        if (props.stored) {
            // Load the game data from RealtimeDB
            console.log("Load the game data from RealtimeDB");
            game.loadGameData(props.id, (data) => setGameData(() => data))
        }
        else {
            // Set default gameData
            console.log("Set default gameData");
            setGameData(() => defaultGameData)
        }
    });


    createEffect(() => {
        if (gameData()) {
            console.log("gameData:", gameData());
            setupScene();
        }
    })



    /*
    * SETUP SCENE
    */
    function setupScene() {

        // initialize environment
        const rgbeLoader = new RGBELoader()
        rgbeLoader.load(gameData().fileName, (envMap) => {
            const environment = envMap;
            environment.mapping = EquirectangularReflectionMapping;
            SceneManager.scene.environment = environment;
            SceneManager.scene.environmentRotation = gameData().rotation;
            SceneManager.scene.remove(SceneManager.light);

            /*
            * Don't forget to call "game.initialized()" at finish 
            */
            game.initialized();
        });
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
                onClick={() => game.saveGame(gameData)}
            >Test salva game e dati</Button>
            {/* <Button
                onClick={() => game.loadData(props.id, (data) => setGameData(() => data))}
            >Test carica dati</Button> */}
        </Container>
    );

}