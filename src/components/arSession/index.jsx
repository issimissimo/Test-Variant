import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { AppMode } from '@/app';
import { config } from '@/config';
import { Matrix4 } from 'three';
import { styled } from 'solid-styled-components';

// UI
import { BackButton } from '@/ui';

// Components
import Inventory from './inventory';

// Games
import Calibration from './interactables/calibration';
// import Game from './game';
// import Playground from './playground'; // for DEBUG!

// XR
import SceneManager from '@xr/sceneManager';
// import AssetManager from '../xr/assetManager';
// import Reticle from '../../xr/reticle';


// export const BlurBackground = styled('div')`
//     background: rgba(68, 68, 68, 0.2);
//     box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
//     backdrop-filter: blur(5px);
//     -webkit-backdrop-filter: blur(7.1px);
//     `

import { Context } from './interactables/common';

// const VIEWS = {
//     CALIBRATION: 'calibration',
//     GAME: 'game',
// };



export default function Main(props) {

    //#region [constants]

    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    // const [markerName, setMarkerName] = createSignal(props.marker?.name || '');
    const [jsonData, setJsonData] = createSignal(null);
    // const [planeFound, setPlaneFound] = createSignal(false);
    const [referenceMatrix, setReferenceMatrix] = createSignal(new Matrix4());
    // const [tapEnabled, setTapEnabled] = createSignal(true);
    // const [canEdit, setCanEdit] = createSignal(props.currentMode === AppMode.SAVE ? true : false);

    let tapEnabled = true;
    // let calibrationCompleted = false;



    const [interactable, setInteractable] = createSignal(null);

    createEffect(() => {
        console.log("Loaded Game:", interactable())
    })


    //#region [lifeCycle]

    onMount(() => {

        // On TAP on screen
        SceneManager.controller.addEventListener("select", () => {

            // Avoid TAP on DOM elements
            if (!tapEnabled) {
                tapEnabled = true;
                return;
            }

            // Subscribe Games that will be loaded or created
            // for this marker to the TAP event
            interactable()?.onTap();
        });








        // start();

        // if (props.currentMode === AppMode.SAVE) {

        //     // regular mode
        //     if (!config.usePlayGround) {
        //         goToEditMarker();
        //         initialize();
        //     }
        //     // debug mode
        //     else {
        //         handleLoadMarkerData();
        //         goToPlayGround();
        //     }

        // }
        // else if (props.currentMode === AppMode.LOAD) {
        //     await handleLoadMarkerData();
        //     if (jsonData()) {

        //         // All good, we've loaded the JSON data and we can
        //         // go to Welcome screen
        //         goToWelcome();
        //         initialize();
        //     }
        //     else {
        //         console.error("You are loading a marker as anonymous, but marker has no data or does not exist!")
        //         goToMarkerNotExist();
        //     }

        //     // Hide the preloader
        //     props.loading(false);
        // }
        // else console.error("AppMode not specified")
    });






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
     * Set the reference (initial) Matrix4
     */
    const handleOnCalibrationCompleted = (matrix) => {
        setReferenceMatrix(() => matrix);
        console.log("CALIBRATION COMPLETED! Matrix:", referenceMatrix());
    }


    /**
    * This function is called each time
    * a new Interactable is mounted,
    * thanks to useInteractable
    */
    const handleInteractableReady = (el) => {
        // set the interactable that we are using
        setInteractable(() => el);
        // update the DOM elements that can be clicked
        updateClickableDomElements();
    };


    //#region [functions]



    const init = () => {
        if (props.currentMode === AppMode.SAVE) {

        }
        else if (props.currentMode === AppMode.LOAD) {

        }
        else {

        }
    }













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
     * Initialize the XR scene,
     * both as admin (SAVE mode) or user (LOAD mode)
     * (with Three.js, xr, Reticle)
     */
    // const start = () => {

    //     SceneManager.renderer.setAnimationLoop(render);
    //     SceneManager.controller.addEventListener("select", () => {
    //         if (!tapEnabled) {
    //             tapEnabled = true;
    //             return;
    //         }
    //         interactable()?.onTap();
    //     });

    //     // // only for debug, load the default gizmo to show
    //     // // where we tap
    //     // SceneManager.loadGizmo();


    //     // // Init Reticle
    //     // Reticle.set({
    //     //     renderer: SceneManager.renderer,
    //     //     scene: SceneManager.scene,
    //     //     camera: SceneManager.camera,
    //     //     color: 0x00ff00,
    //     //     radius: 0.06,
    //     //     innerRadius: 0.05,
    //     //     segments: 4,
    //     // });

    //     // // Init Reticle
    //     // Reticle.set({
    //     //     renderer: SceneManager.renderer,
    //     //     scene: SceneManager.scene,
    //     //     camera: SceneManager.camera,
    //     //     fileName: 'models/gizmo.glb'
    //     // });

    // }


    // /**
    //  * We do some stuff, when the user click "Enter AR" button
    //  * and consequently 'onSessionStarted' is called
    //  */
    // const onARSessionStarted = () => {
    //     if (props.currentMode === AppMode.SAVE) {

    //         // Check if is a new marker
    //         console.log('current marker:', props.marker)

    //         if (props.marker.id) {
    //             console.log('current marker is saved, with id:', props.marker.id)

    //             if (props.marker.withData) {
    //                 console.log('...and it seem to have a JSON saved too...')
    //                 handleLoadMarkerData();
    //             }
    //         }

    //         else {
    //             console.log('current marker is not saved, we need to save it on Firestore...')
    //             handleCreateMarker(markerName());
    //         }
    //     }
    //     console.log("NOW GO TO CALIBRATION!")
    //     goToCalibration();
    // }






    //     // if (!canEdit()) return;

    //     // console.log('>> onTapOnScreen:', tapEnabled())

    //     // // Stop here if it's a DOM event
    //     // if (!tapEnabled()) {
    //     //     setTapEnabled(() => true);
    //     //     return;
    //     // }

    //     // if (Reticle.isHitting() || !Reticle.usePlaneDetection()) {
    //     //     const reticleMatrix = new Matrix4().copy(Reticle.getHitMatrix());

    //     //     // Set the hitMatrix signal
    //     //     setHitMatrix(() => reticleMatrix);
    //     //     console.log("MATRICE CAMBIATA!")

    //     //     // First time...
    //     //     if (!calibrationCompleted) {

    //     //         if (config.isDebug) {
    //     //             SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix(), "referenceGizmo");
    //     //         }

    //     //         calibrationCompleted = true;
    //     //         goToGame();
    //     //     }
    //     // }
    // }









    // /**
    //  * Navigation helpers
    //  */
    // const goToCalibration = () => {
    //     setCurrentView(VIEWS.CALIBRATION)
    // };
    // const goToGame = () => {
    //     setCurrentView(VIEWS.GAME)
    // };
    // const goToPlayGround = () => setCurrentView(VIEWS.PLAYGROUND);




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
                    setReferenceMatrix={(matrix) => handleOnCalibrationCompleted(matrix)}
                />
            )
        }

        // switch (currentView()) {

        // case VIEWS.WELCOME:
        //     return <WelcomeUser
        //         jsonData={jsonData()}
        //     />;

        // case VIEWS.EDIT_MARKER:
        //     return <EditMarker
        //         userId={props.userId}
        //         marker={props.marker}
        //         markerName={markerName()}
        //         setMarkerName={(name) => setMarkerName(() => name)}
        //         onCreate={handleCreateMarker}
        //         // onModify={handleModifyMarker}
        //         onDelete={handleDeleteMarker}
        //     // onCancel={handleBackToHome}
        //     />;

        // case VIEWS.CALIBRATION:
        //     return <Calibration
        //         planeFound={planeFound()}
        //     />;

        // case VIEWS.GAME:
        //     return <Game
        //         currentMode={props.currentMode}
        //         // disableTap={setTapEnabled(() => false)}
        //         canEdit={canEdit()}
        //         setCanEdit={(value) => setCanEdit(() => value)}
        //         userId={props.userId}
        //         marker={props.marker}
        //         saveData={(data) => handleSaveMarkerData(data)}
        //         scene={SceneManager.scene}
        //         data={jsonData()}
        //         hitMatrix={hitMatrix()}
        //     // onClose={handleBackToHome}
        //     />;

        // case VIEWS.MARKER_NOT_EXIST:
        //     return <Unavailable
        //     />;

        // case VIEWS.PLAYGROUND:
        //     return <Playground
        //         jsonData={jsonData()}
        //         setJsonData={(data) => setJsonData(() => data)}
        //         save={handleSaveMarkerData}
        //     />;
        // }
    };










    //#region [style]

    const Container = styled('div')`
        /* min-height: 100vh;
        width: 100vw; */
    `;



    //#region [return]

    return (
        <Context.Provider value={{ onReady: handleInteractableReady }}>
            <Container id="arSession">

                <BackButton onClick={handleGoBack} />

                {/* <Calibration
                    // planeFound={planeFound()}
                    planeFound={props.planeFound}
                    setAnimation={props.setAnimation}
                    setReferenceMatrix={(matrix) => handleOnCalibrationCompleted(matrix)}
                />; */}

                {renderView()}
            </Container>
        </Context.Provider>
    );
}
