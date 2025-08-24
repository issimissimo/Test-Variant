import { createSignal, createEffect, createContext, onMount, For } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { config } from '@js/config';
import { Matrix4 } from 'three';
import { styled } from 'solid-styled-components';

// Main components
import UI from './UI';

import Header from '@components/Header';
import Loader from '@components/Loader';
import { Container, Centered } from '@components/smallElements'



import Calibration from './Calibration';

import GAMES_LIST from '@plugin';


// XR
import SceneManager from '@js/sceneManager';




// ===== CONTEXT =====
export const Context = createContext();


const LOCALIZATION_STATE = {
    NONE: 'none',
    REQUIRED: 'required',
    COMPLETED: 'completed'
}



export default function ArSession(props) {

    //#region [constants]
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    const [localizationState, setLocalizationState] = createSignal(LOCALIZATION_STATE.NONE);
    const [referenceMatrix, setReferenceMatrix] = createSignal(new Matrix4());
    const [loading, setLoading] = createSignal(true);
    const [gamesImported, setGamesImported] = createSignal([]);
    const [gamesInitializing, setGamesInitializing] = createSignal(false);
    const [selectedGameId, setSelectedGameId] = createSignal(null);

    let _tapEnabled = true;
    let _gamesInitialized = 0;






    //#region [lifeCycle]
    onMount(() => {

        console.log("---- onMount")

        // Let's avoid annoying issue that each time I modify something
        // in this code the controller is "undefined", so I have to 
        // reload everything!
        // if (typeof SceneManager.controller === "undefined") {
        //     console.warn("The SceneManager.controller is UNDEFINED! Probably you have just updated something in arSession.jsx!")
        // }
        // else {

        // On TAP on screen
        // event listener
        SceneManager.controller.addEventListener("select", () => {

            // Avoid TAP on DOM elements
            if (!_tapEnabled) {
                _tapEnabled = true;
                return;
            }

            // Call onTap function of all the gamesRunning
            props.gamesRunning.forEach((el) => el.onTap());
        });
        // }

        if (props.marker.games.length > 0) loadAllModules();
        else setLoading(() => false);
    });


    createEffect(() => {
        console.log("---- Games running:", props.gamesRunning)
        console.log("---- Games imported:", gamesImported());
        console.log("---- Game id selected:", selectedGameId());
        console.log("---- Games initializing:", gamesInitializing());
    })


    /**
    * Load all the games (as bundles) of the marker.
    * In this way we keep the main bundle as small as possible!
    */
    async function loadAllModules() {
        for (const el of props.marker.games) {
            if (el.enabled) {
                // load dynamically the module
                await loadModule(el.id, el.name, true);


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
    const handleLocalizationCompleted = (matrix) => {
        setReferenceMatrix(() => matrix);

        // Show all the meshes of all the games
        setGamesVisible(true);

        setLocalizationState(() => LOCALIZATION_STATE.COMPLETED);
        console.log("LOCALIZATION COMPLETED! Matrix:", referenceMatrix());

    }


    /**
    * This function is called each time
    * a new Game is mounted,
    * to add it with its functions to gamesRunning of app.jsx
    * (N.B. the gameRunning IS NOT the module that we use here in the return 
    * to display the UI of each module!)
    */
    const handleGameLoaded = (el) => {
        console.log("MODULE LOADED: ", el)
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
            setGamesInitializing(() => false);

            // If just one of the game need localization,
            // we need to show the Localization component
            // as soon as all the games initialized

            for (let i = 0; i < props.gamesRunning.length; i++) {
                const _game = props.gamesRunning[i];

                const gameSpecs = GAMES_LIST.find(g => g.fileName === _game.name);
                if (gameSpecs.localized && localizationState() !== LOCALIZATION_STATE.COMPLETED) {

                    // Hide all the meshes of all the games
                    setGamesVisible(false);
                    // Show the Localization view
                    setLocalizationState(() => LOCALIZATION_STATE.REQUIRED);

                    break;
                }
            }
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
            // Use passive listeners for touch/pointer to avoid scroll-blocking warnings
            element.addEventListener('pointerdown', disableTap, { passive: true });
            element.addEventListener('touchstart', disableTap, { passive: true });
        });
        console.log("clickable DOM elements:", _clickableDomElements)
    };
    function removeClickableDomElements() {
        _clickableDomElements.forEach(element => {
            // remove with same capture option (passive doesn't affect removal but keep options explicit)
            element.removeEventListener('pointerdown', disableTap, { passive: true });
            element.removeEventListener('touchstart', disableTap, { passive: true });
        });
    };




    const setGamesVisible = (value, gameName = null) => {
        props.gamesRunning.forEach(el => {
            // only one game
            if (gameName) {
                if (el.name === gameName) el.setVisible(value);
            }
            // all games
            else {
                el.setVisible(value);
            }
        });
    }




    const handleSaveSelectedGame = async () => {

        const gameToSave = props.gamesRunning.find((el) => el.id === selectedGameId());
        setSelectedGameId(null);

        console.log("GAME TO SAVE:", gameToSave);

        const newGameId = await firebase.firestore.addGame(props.userId, props.marker.id, gameToSave.name);
        console.log('Creato in Firestore il game con ID:', newGameId)

        if (gameToSave.gameData) {
            try {
                const path = `${props.userId}/markers/${props.marker.id}/games/${newGameId}`;
                await firebase.realtimeDb.saveData(path, gameToSave.gameData);
                console.log('Creato in RealtimeDB il JSON con ID:', newGameId)

            } catch (error) {
                console.log("Errore nel salvataggio JSON:", error);
            }
        }
    }



    /**
    * Import module (game) on-demand.
    * The module will be added to the return of this function
    * (N.B. the module IS NOT the "gameRunning" that we use here and in app.jsx
    * to access its functions!
    * Each "gameRunning" will be added automatically as loaded
    * with the function "handleGameLoaded")
    */
    async function loadModule(moduleId, moduleName, storedOnDatabase, selectOnEnd = false) {

        setGamesInitializing(() => true);

        const raw = await import(`../../plugin/${moduleName}.jsx`);
        const newModule = {
            id: moduleId,
            name: moduleName,
            stored: storedOnDatabase,
            component: raw.default,
        }
        setGamesImported((prev) => [...prev, newModule]);


        // Select the new game created
        if (selectOnEnd) {
            setSelectedGameId(moduleId);
        }
    }






    //#region [return]

    return (
        <Context.Provider value={{
            onLoaded: handleGameLoaded,
            onInitialized: handleGameInitialized,
            appMode: props.appMode,
            userId: props.userId,
            markerId: props.marker.id,
            referenceMatrix: referenceMatrix(),
            localizationCompleted: () => localizationState() === LOCALIZATION_STATE.COMPLETED
        }}>
            <Container id="arSession">

                {/* HEADER */}
                <Header
                    showUser={false}
                    onClickBack={handleGoBack}
                />

                {
                    loading() ? (<Loader />)
                        :
                        <>
                            {gamesInitializing() && <Loader text="Inizializzo" />}

                            <For each={gamesImported()}>
                                {item => {
                                    const Component = item.component;
                                    return <Component
                                        id={item.id}
                                        stored={item.stored}
                                        selected={item.id === selectedGameId() ? true : false}
                                    />;
                                }}
                            </For>

                            {localizationState() === LOCALIZATION_STATE.REQUIRED ?
                                <Calibration
                                    planeFound={props.planeFound}
                                    setReferenceMatrix={(matrix) => handleLocalizationCompleted(matrix)}
                                />
                                :
                                <UI
                                    marker={props.marker}
                                    addNewModule={(id, name) => loadModule(id, name, false, true)}
                                    saveEnabled={selectedGameId() !== null ? true : false}
                                    saveGame={handleSaveSelectedGame}
                                />
                            }
                        </>
                }
            </Container>
        </Context.Provider>
    );
}
