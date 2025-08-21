import { createSignal, createEffect, onMount, For } from 'solid-js';
import { config } from '@js/config';
import { Matrix4 } from 'three';
import { styled } from 'solid-styled-components';

// Main components
import UI from './UI';

import Loader from '@components/Loader';


import { Context } from '@plugin/common';
import Calibration from '@plugin/calibration';

import GAMES_LIST from '@plugin';


// XR
import SceneManager from '@js/sceneManager';



export default function ArSession(props) {

    //#region [constants]
    const [currentView, setCurrentView] = createSignal(null);
    const [referenceMatrix, setReferenceMatrix] = createSignal(new Matrix4());
    const [calibrationCompleted, setCalibrationCompleted] = createSignal(true);
    const [loading, setLoading] = createSignal(true);
    const [gamesImported, setGamesImported] = createSignal([]);
    const [gamesInitializing, setGamesInitializing] = createSignal(false);
    let _tapEnabled = true;
    let _gamesInitialized = 0;


    //#region [lifeCycle]
    onMount(() => {

        // On TAP on screen
        // event listener
        SceneManager.controller.addEventListener("select", () => {

            // Avoid TAP on DOM elements
            if (!_tapEnabled) {
                _tapEnabled = true;
                return;
            }

            // Call onTap function of all the gamesRunning
            props.games.forEach((el) => el.onTap());
        });


        // Load all games of this marker
        if (props.marker.games.length > 0) loadAllGames();
        else setLoading(() => false);
    });


    createEffect(() => {
        console.log("Loaded Games:", props.games)
    })



    // Load all the games that are saved 
    // on the current marker
    async function loadAllGames() {
        for (const el of props.marker.games) {
            console.log("Now loading game:", el)
            if (el.enabled) {

                // load dynamically the game
                await loadGame(el.id, el.name, true);

                // check if the game need calibration
                const gameSpecs = GAMES_LIST.find(g => g.fileName === el.name);
                if (gameSpecs.localized) {
                    console.log("Il game " + el.name + " richiede la calibrazione!")

                    setCalibrationCompleted(() => false);
                }
            }
        }
        setLoading(() => false);
    }


    //#region [handlers]
    /**
     * Go back
     */
    const handleGoBack = () => {
        removeClickableDomElements();
        props.onBack();
    }



    /**
     * Set the reference Matrix4
     * that will be used to set the relative position
     * of the loaded 3D objects
     */
    const handleCalibrationCompleted = (matrix) => {
        setReferenceMatrix(() => matrix);
        setCalibrationCompleted(() => true);
        console.log("CALIBRATION COMPLETED! Matrix:", referenceMatrix());
        setGamesInitializing(() => true);
    }


    /**
    * This function is called each time
    * a new Game is mounted,
    * to add it with its functions to gamesRunning of app.jsx
    * (N.B. the gameRunning IS NOT the module that we use here in the return 
    * to display the UI of each module!)
    */
    const handleGameReady = (el) => {
        console.log("GAME READY: ", el)
        props.addGame(el);

        // update the DOM elements that can be clicked
        updateClickableDomElements();
    };


    /**
    * This function is called each time
    * a new Game is totally initialized
    * (so, everything in the game has been loaded and created)
    * to hide the initializing component message
    */
    const handleGameInitialized = () => {
        _gamesInitialized++;
        if (_gamesInitialized === gamesImported().length) {
            console.log("all games initialized!")
            console.log(SceneManager.scene)
            setGamesInitializing(() => false);
        }
    }


    //#region [functions]


    let _clickableDomElements = [];

    function disableTap(e) {
        _tapEnabled = false;
        e.stopPropagation();
    };

    function updateClickableDomElements() {
        removeClickableDomElements();
        _clickableDomElements = document.querySelectorAll('#ar-overlay button, #ar-overlay a, #ar-overlay [data-interactive]');
        _clickableDomElements.forEach(element => {
            element.addEventListener('pointerdown', disableTap);
            element.addEventListener('touchstart', disableTap);
        });
        console.log("clickable DOM elements:", _clickableDomElements)
    };

    function removeClickableDomElements() {
        _clickableDomElements.forEach(element => {
            element.removeEventListener('pointerdown', disableTap);
            element.removeEventListener('touchstart', disableTap);
        });
    };









    /**
     * The view that will be showed
     */
    const renderView = () => {

        if (config.debugOnDesktop) {
            return (
                <UI>

                </UI>
            )
        }
        else {
            return (
                <Calibration
                    planeFound={props.planeFound}
                    setAnimation={props.setAnimation}
                    setReferenceMatrix={(matrix) => handleCalibrationCompleted(matrix)}
                />
            )
        }
    };



    /**
    * Import module (game) on-demand.
    * The module will be added to the return of this function
    * (N.B. the module IS NOT the "gameRunning" that we use here and in app.jsx
    * to access its functions!
    * Each "gameRunning" will be added automatically as loaded
    * with the function "handleGameReady")
    */
    async function loadGame(gameId, gameName, storedOnDatabase) {
        const module = await import(`../../plugin/${gameName}.jsx`);
        const loadedGame = {
            id: gameId,
            name: gameName,
            stored: storedOnDatabase,
            component: module.default,
        }
        setGamesImported((prev) => [...prev, loadedGame]);
    }






    //#region [style]

    const Container = styled('div')`
        /* min-height: 100vh;
        width: 100vw; */
    `;



    //#region [return]

    return (
        <Context.Provider value={{
            onReady: handleGameReady,
            onInitialized: handleGameInitialized,
            appMode: props.appMode,
            userId: props.userId,
            markerId: props.marker.id,
        }}>
            <Container id="arSession">
                {loading() ? (<Loader />)
                    :
                    !calibrationCompleted() ? (
                        <Calibration
                            planeFound={props.planeFound}
                            setReferenceMatrix={(matrix) => handleCalibrationCompleted(matrix)}
                        />
                    )
                        :
                        (
                            <>
                                {gamesInitializing() && <Loader />}

                                <For each={gamesImported()}>
                                    {(item) => {
                                        const Component = item.component;
                                        return <Component
                                            id={item.id}
                                            stored={item.stored}
                                        />;
                                    }}
                                </For>
                            </>
                        )}
            </Container>
        </Context.Provider>
    );
}
