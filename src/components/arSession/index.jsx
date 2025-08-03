import { createSignal, createEffect, onMount, For } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { AppMode } from '@/app';
import { config } from '@/config';
import { Matrix4 } from 'three';
import { styled } from 'solid-styled-components';

// Main components
import Inventory from './inventory';
import Calibration from '@games/calibration';

// UI
import { BackButton } from '@/ui';

// XR
import SceneManager from '@xr/sceneManager';
// import AssetManager from '../xr/assetManager';



// export const BlurBackground = styled('div')`
//     background: rgba(68, 68, 68, 0.2);
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
//     backdrop-filter: blur(5px);
//     -webkit-backdrop-filter: blur(7.1px);
//     `

import { Context } from '@games/common';




export default function Main(props) {

    //#region [constants]

    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);

    const [jsonData, setJsonData] = createSignal(null);

    const [referenceMatrix, setReferenceMatrix] = createSignal(new Matrix4());
    const [calibrationCompleted, setCalibrationCompleted] = createSignal(false);
    const [componentsLoaded, setComponentsLoaded] = createSignal([]);



    let tapEnabled = true;









    //#region [lifeCycle]
    onMount(() => {

        // On TAP on screen
        // event listener
        SceneManager.controller.addEventListener("select", () => {

            // Avoid TAP on DOM elements
            if (!tapEnabled) {
                tapEnabled = true;
                return;
            }

            // Call onTap function of all the gamesRunning
            props.games.forEach((el) => el.onTap());
        });


        // Load all the games that are saved 
        // on the current marker
        if (props.marker.games.length > 0) {
            props.marker.games.forEach((el) => {
                console.log("GAME:", el)
                // Load all the components by name
                loadComponent(el.id, el.name, true);
            })
        }
    });


    createEffect(() => {
        console.log("Loaded Games:", props.games)
    })



    //#region [handlers]




    // /**
    //  * Load JSON from Firebase Realtime DB
    //  * and set jsonData()
    //  */
    // const handleLoadMarkerData = async () => {
    //     try {
    //         const path = `${props.userId}/${props.marker.id}/data`;
    //         const data = await firebase.realtimeDb.loadData(path);
    //         setJsonData(() => data);
    //     } catch (error) {
    //         console.error("Errore nel caricamento JSON:", error);
    //     }
    // }



    // /**
    //  * Save jsonData() to Firebase Realtime DB
    //  * and, if necessary, update Firestore marker data:
    //  * withData = true
    //  */
    // const handleSaveMarkerData = async (data) => {
    //     try {
    //         const path = `${props.userId}/${props.marker.id}/data`;
    //         await firebase.realtimeDb.saveData(path, data);
    //         setJsonData(() => data);

    //         if (!props.marker.withData) {
    //             firebase.firestore.updateMarker(props.userId, props.marker.id,
    //                 props.marker.name, true);
    //         }
    //     } catch (error) {
    //         console.log({ type: 'error', text: `Errore: ${error.message}` });
    //     }
    // }




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
    }


    /**
    * This function is called each time
    * a new Game is mounted,
    * to add it with its functions to gamesRunning of app.jsx
    * (N.B. the gameRunning IS NOT the module that we use here in the return 
    * to display the UI of each module!)
    */
    const handleGameReady = (el) => {
        props.addGame(el);

        // update the DOM elements that can be clicked
        updateClickableDomElements();
    };


    //#region [functions]




    // /**
    // * Add a new game on Firestore
    // */
    // const addGameOnFirestore = async () => {
    //     const newGameId = await firebase.firestore.addGame(props.userId, props.marker.id, "testGame");
    //     // setMarkerId(() => newMarkerId);
    //     // props.onNewMarkerCreated(newMarkerId, markerName);
    //     console.log('Creato in Firestore il game con ID:', newGameId)
    // }









    let _clickableDomElements = [];

    function disableTap(e) {
        tapEnabled = false;
        e.stopPropagation();
    };

    function updateClickableDomElements() {
        removeClickableDomElements();
        _clickableDomElements = document.querySelectorAll('#overlay button, #overlay a, #overlay [data-interactive]');
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
                <Inventory>

                </Inventory>
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
    async function loadComponent(componentId, componentName, storedOnDatabase) {
        const module = await import(`./games/${componentName}.jsx`);
        const loadedComponent = {
            id: componentId,
            name: componentName,
            stored: storedOnDatabase,
            component: module.default,
        }
        setComponentsLoaded((prev) => [...prev, loadedComponent]);
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
            appMode: props.appMode,
            userId: props.userId,
            markerId: props.marker.id,

        }}>
            <Container id="arSession">

                <BackButton onClick={handleGoBack} />

                <Calibration
                    planeFound={props.planeFound}
                    setReferenceMatrix={(matrix) => handleCalibrationCompleted(matrix)}
                />;

                {/* {renderView()} */}


                <For each={componentsLoaded()}>
                    {(item) => {
                        const Component = item.component;
                        return <Component id={item.id} stored={item.stored} />;
                    }}
                </For>

            </Container>
        </Context.Provider>
    );
}
