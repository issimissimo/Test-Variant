import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';
import { AppMode } from '../app';
import { config } from '../config';

// UI
import Welcome from './arSession/welcome';
import EditMarker from './arSession/editMarker';
import Calibration from './arSession/calibration';
import Game from './arSession/game';
import MarkerNotExist from './arSession/markerNotExist';
import Playground from './arSession/playground'; // for DEBUG!

// XR
import SceneManager from '../xr/sceneManager';
import AssetManager from '../xr/assetManager';
import Reticle from '../xr/reticle';


const VIEWS = {
    WELCOME: 'welcome',
    EDIT_MARKER: 'editMarker',
    CALIBRATION: 'calibration',
    GAME: 'game',
    MARKER_NOT_EXIST: 'markerNotExist',
    PLAYGROUND: 'playground'
};


export default function ArSession(props) {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    const [markerName, setMarkerName] = createSignal(props.marker?.name || '');
    const [jsonData, setJsonData] = createSignal(null);
    const [planeFound, setPlaneFound] = createSignal(false);


    //
    // switch from Welcome / EditMarker
    //
    onMount(async () => {

        if (props.currentMode === AppMode.SAVE) {

            // regular mode
            if (!config.usePlayGround) {
                goToEditMarker();
                initialize();
            }
            // debug mode
            else {
                loadMarkerJsonData();
                goToPlayGround();
            }

        }
        else if (props.currentMode === AppMode.LOAD) {
            await loadMarkerJsonData();
            if (jsonData()) {

                // All good, we've loaded the JSON data and we can
                // go to Welcome screen
                goToWelcome();
                initialize();
            }
            else {
                console.error("You are loading a marker as anonymous, but marker has no data or does not exist!")
                goToMarkerNotExist();
            }

            // Hide the preloader
            props.loading(false);
        }
        else console.error("AppMode not specified")
    })



    const loadMarkerJsonData = async () => {
        try {
            // Load JSON from Realtime DB
            const path = `${props.userId}/${props.marker.id}/data`;
            const data = await firebase.realtimeDb.loadData(path);
            setJsonData(() => data);
            console.log(data);
        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }


    const saveMarkerJsonData = async () => {
        try {
            // Salva nel Real Time Database
            const path = `${props.userId}/${props.marker.id}/data`;
            await firebase.realtimeDb.saveData(path, jsonData());
            console.log({ type: 'success', text: 'Dati salvati con successo!' });

            if (!props.marker.withData) {
                // Aggiorna anche Firestore
                await firebase.firestore.updateMarker(props.userId, props.marker.id,
                    props.marker.name, true);
                console.log("firebase aggiornato!")
            }
        } catch (error) {
            console.log({ type: 'error', text: `Errore: ${error.message}` });
        }
    }



    /**
     * Initialize the XR scene just when a marker is loaded,
     * both as admin (SAVE mode) or user (LOAD mode)
     * (with Three.js, xr, Reticle)
     */
    const initialize = () => {
        if (!SceneManager.initialized) {

            SceneManager.init();
            SceneManager.renderer.setAnimationLoop(render);
            SceneManager.renderer.xr.addEventListener("sessionstart", onARSessionStarted);
            SceneManager.controller.addEventListener("select", onTapOnScreen);
            SceneManager.loadGizmo();
            // // Init Reticle
            // Reticle.set({
            //     renderer: SceneManager.renderer,
            //     scene: SceneManager.scene,
            //     color: 0x00ff00,
            //     radius: 0.06,
            //     innerRadius: 0.05,
            //     segments: 4,
            // });

            // Init Reticle
            Reticle.set({
                renderer: SceneManager.renderer,
                scene: SceneManager.scene,
                fileName: 'gridPlane.glb'
            });
        }
    }


    /**
     * We do some stuff, when the user click "Enter AR" button
     * and consequently 'onSessionStarted' is called
     */
    const onARSessionStarted = () => {
        if (props.currentMode === AppMode.SAVE) {

            // Check if is a new marker
            console.log('current marker:', props.marker)

            if (props.marker.id) {
                console.log('current marker is saved, with id:', props.marker.id)

                if (props.marker.withData) {
                    console.log('...and it seem to have a JSON saved too...')
                    loadMarkerJsonData();
                }
            }

            else {
                console.log('current marker is not saved, we need to save it on Firestore...')
                handleCreateMarker(markerName());
            }
        }
        console.log("NOW GO TO CALIBRATION!")
        goToCalibration();
    }



    /**
     * After the user click the button (calibration.jsx)
     * to complete calibration
     */
    const onTapOnScreen = () => {

        console.log("--- TAP")
        if (!Reticle.isHitting()) return;



        const hitMatrix = Reticle.getHitMatrix();
        console.log(hitMatrix)

        // if (!Persistence.isInitialized()) {
        //     Persistence.init(hitMatrix);
        //     console.log("persistence initialized")
        //     // if (!SceneManager.isInitialized) {
        //     //     console.error('SceneManager not yet initialized!');
        //     //     return;
        //     // }
        //     console.log(SceneManager.gizmo)
        //     SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix, "reference");

        //     goToGame();
        // }

        if (!AssetManager.isInitialized()) {
            AssetManager.init(SceneManager.scene, hitMatrix);
            console.log("AssetManager initialized")


            SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix, "referenceGizmo");

            goToGame();
        }
    }




    const handleBackToHome = () => {
        props.backToHome();
    }


    //
    // Create a new marker,
    // only in firebase (JSON should be created later on)
    //
    const handleCreateMarker = async (name) => {
        try {
            const newMarkerId = await firebase.firestore.addMarker(firebase.auth.user().uid, name);
            props.onSaveMarker(newMarkerId, name);
            console.log('Creato in Firestore il marker con ID:', newMarkerId)
        } catch (error) {
            console.error('Errore aggiunta marker:', error);
            throw error;
        }
    };


    /// NON LO USIAMO!!! PERCHE' CARICHIAMO I DATI (SE ESISTONO) QUANDO SI ENTRA IN AR (CLICCANDO SUL TASTO START AR)
    // //
    // // Modify an existing marker that have a JSON associated,
    // // loading its JSON
    // //
    // const handleModifyMarker = async () => {
    //     await loadMarkerJsonData();
    //     // goToGame();
    // }


    //
    // Delete a marker,
    // both from firebase and its JSON from RealTime DB,
    // and go back to Home
    //
    const handleDeleteMarker = async () => {
        try {
            await firebase.firestore.deleteMarker(props.userId, props.marker.id);
            const path = `${props.userId}/${props.marker.id}`;
            await firebase.realtimeDb.deleteData(path);
            handleBackToHome();
        } catch (error) {
            console.error("Errore completo cancellazione marker:", error);
        }
    };


    /**
     * Handles the rendering loop for the AR scene.
     * 
     * If an XR frame is available, updates the Reticle based on the current frame and surface type.
     * Always updates the SceneManager for each animation frame.
     */
    function render(timestamp, frame) {
        if (frame) {
            Reticle.update(frame, (surfType) => {
            });
            setPlaneFound(Reticle.isHitting())
        }
        SceneManager.update();
    };


    /**
     * Navigation helpers
     */
    const goToWelcome = () => setCurrentView(VIEWS.WELCOME);
    const goToEditMarker = () => setCurrentView(VIEWS.EDIT_MARKER);
    const goToCalibration = () => setCurrentView(VIEWS.CALIBRATION);
    const goToGame = () => setCurrentView(VIEWS.GAME);
    const goToMarkerNotExist = () => setCurrentView(VIEWS.MARKER_NOT_EXIST);
    const goToPlayGround = () => setCurrentView(VIEWS.PLAYGROUND);


    /**
     * The view that will be showed
     */
    const renderView = () => {

        switch (currentView()) {

            case VIEWS.WELCOME:
                return <Welcome
                    jsonData={jsonData()}
                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    marker={props.marker}
                    markerName={markerName()}
                    setMarkerName={(name) => setMarkerName(() => name)}
                    onCreate={handleCreateMarker}
                    // onModify={handleModifyMarker}
                    onDelete={handleDeleteMarker}
                    onCancel={handleBackToHome}
                />;

            case VIEWS.CALIBRATION:
                return <Calibration
                    planeFound={planeFound()}
                />;

            case VIEWS.GAME:
                return <Game
                    marker={props.marker}
                    jsonData={jsonData()}
                />;

            case VIEWS.MARKER_NOT_EXIST:
                return <MarkerNotExist
                />;

            case VIEWS.PLAYGROUND:
                return <Playground
                    jsonData={jsonData()}
                    setJsonData={(data) => setJsonData(() => data)}
                    save={saveMarkerJsonData}
                />;
        }
    };


    /**
     * Return
     */
    return (
        <div class="full-screen">
            {renderView()}
        </div>
    );
}
