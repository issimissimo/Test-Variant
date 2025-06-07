import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';
import { AppMode } from '../app';
import { config } from '../config';

import { Matrix4 } from 'three';

// UI
import Welcome from './arSession/welcome';
import EditMarker from './arSession/editMarker';
import Calibration from './arSession/calibration';
import Game from './arSession/game';
import Unavailable from './arSession/unavailable';
import Playground from './arSession/playground'; // for DEBUG!

// XR
import SceneManager from '../xr/sceneManager';
// import AssetManager from '../xr/assetManager';
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
    const [hitMatrix, setHitMatrix] = createSignal(new Matrix4());
    const [calibrationCompleted, setCalibrationCompleted] = createSignal(false);


    /**
    * At the beginning we need to switch
    * from SAVE or LOAD page (EditMarker / Welcome)
     */
    onMount(async () => {

        if (props.currentMode === AppMode.SAVE) {

            // regular mode
            if (!config.usePlayGround) {
                goToEditMarker();
                initialize();
            }
            // debug mode
            else {
                handleLoadMarkerData();
                goToPlayGround();
            }

        }
        else if (props.currentMode === AppMode.LOAD) {
            await handleLoadMarkerData();
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



    /**
    * Create a new marker, only in firebase
    * and with the property withData = false 
    * (JSON should be created later on)
     */
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




    /**
    * Delete a marker,
    * both from firebase and its JSON from RealTime DB,
    * and go back to Home
     */
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
     * Load JSON from Firebase Realtime DB
     * and set jsonData()
     */
    const handleLoadMarkerData = async () => {
        try {
            const path = `${props.userId}/${props.marker.id}/data`;
            const data = await firebase.realtimeDb.loadData(path);
            setJsonData(() => data);
        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }



    /**
     * Save jsonData() to Firebase Realtime DB
     * and, if necessary, update Firestore marker data:
     * withData = true
     */
    const handleSaveMarkerData = async (data) => {
        try {
            const path = `${props.userId}/${props.marker.id}/data`;
            await firebase.realtimeDb.saveData(path, data);
            setJsonData(() => data);
            console.log({ type: 'success', text: 'Dati salvati con successo!' });

            if (!props.marker.withData) {
                firebase.firestore.updateMarker(props.userId, props.marker.id,
                    props.marker.name, true);
            }
        } catch (error) {
            console.log({ type: 'error', text: `Errore: ${error.message}` });
        }
    }




    /**
     * Go back to home screen
     * TODO: better management
     */
    const handleBackToHome = () => {
        props.backToHome();
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


            // Init Reticle
            Reticle.set({
                renderer: SceneManager.renderer,
                scene: SceneManager.scene,
                color: 0x00ff00,
                radius: 0.06,
                innerRadius: 0.05,
                segments: 4,
            });

            // // Init Reticle
            // Reticle.set({
            //     renderer: SceneManager.renderer,
            //     scene: SceneManager.scene,
            //     fileName: 'models/gridPlane.glb'
            // });
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
                    handleLoadMarkerData();
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
    // const onTapOnScreen = () => {
    //     if (!Reticle.isHitting()) return;

    //     console.log("--- TAP")
    //     setHitMatrix(() => Reticle.getHitMatrix());


    //     if (!AssetManager.initialized()) {
    //         AssetManager.init(SceneManager.scene, hitMatrix());
    //         console.log("AssetManager initialized")


    //         SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix(), "referenceGizmo");

    //         //
    //         // FINALLY GO TO GAME!!
    //         //
    //         goToGame();
    //     }
    // }

    const onTapOnScreen = () => {
        if (Reticle.isHitting()) {

            console.log("--- TAP")
            setHitMatrix(() => Reticle.getHitMatrix());

            if (!calibrationCompleted()) {

                console.log("adesso devo mettere il gizmo, e lanciare GAME...")

                SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix(), "referenceGizmo");
                
                //
                // FINALLY GO TO GAME!!
                //
                goToGame();

                setCalibrationCompleted(() => true);
            }
        }
    }










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
                    saveData={handleSaveMarkerData}
                    scene={SceneManager.scene}
                    data={jsonData()}
                    hitMatrix={hitMatrix()}
                />;

            case VIEWS.MARKER_NOT_EXIST:
                return <Unavailable
                />;

            case VIEWS.PLAYGROUND:
                return <Playground
                    jsonData={jsonData()}
                    setJsonData={(data) => setJsonData(() => data)}
                    save={handleSaveMarkerData}
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
