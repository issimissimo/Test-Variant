import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { AppMode } from '../main';
import { config } from '../js/config';
import { Matrix4 } from 'three';
import { styled } from 'solid-styled-components';

// UI
// import WelcomeUser from './welcomeUser';
// import EditMarker from './editMarker';
import Calibration from './arSession/calibration';
import Game from './arSession/game';
// import Unavailable from './arSession/unavailable';
import Playground from './arSession/playground'; // for DEBUG!

// XR
import SceneManager from '../js/sceneManager';
// import AssetManager from '../xr/assetManager';
import Reticle from '../xr/reticle';


export const BlurBackground = styled('div')`
    background: rgba(68, 68, 68, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(7.1px);
    `


const VIEWS = {
    WELCOME: 'welcome',
    EDIT_MARKER: 'editMarker',
    CALIBRATION: 'calibration',
    GAME: 'game',
    MARKER_NOT_EXIST: 'markerNotExist',
    PLAYGROUND: 'playground'
};



export default function ArSession(props) {

    //#region [constants]

    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    const [markerName, setMarkerName] = createSignal(props.marker?.name || '');
    const [jsonData, setJsonData] = createSignal(null);
    const [planeFound, setPlaneFound] = createSignal(false);
    const [hitMatrix, setHitMatrix] = createSignal(new Matrix4());
    const [tapEnabled, setTapEnabled] = createSignal(true);
    const [canEdit, setCanEdit] = createSignal(props.currentMode === AppMode.SAVE ? true : false);

    let calibrationCompleted = false;




    //#region [lifeCycle]

    createEffect(() => {
        // console.log('> tap enabled:', tapEnabled())
        // console.log('> iOS:', iOS())
    })


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


    //#region [handlers]


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
     */
    const handleBackToHome = () => {
        SceneManager.destroy();
        props.backToHome();
    }


    //#region [functions]

    /**
     * Initialize the XR scene just when a marker is loaded,
     * both as admin (SAVE mode) or user (LOAD mode)
     * (with Three.js, xr, Reticle)
     */
    const initialize = () => {
        if (!SceneManager._initialized) {

            SceneManager.init();
            SceneManager.renderer.setAnimationLoop(render);
            SceneManager.renderer.xr.addEventListener("sessionstart", onARSessionStarted);
            SceneManager.controller.addEventListener("select", onTapOnScreen);
            SceneManager.loadGizmo();


            // // Init Reticle
            // Reticle.set({
            //     renderer: SceneManager.renderer,
            //     scene: SceneManager.scene,
            //     camera: SceneManager.camera,
            //     color: 0x00ff00,
            //     radius: 0.06,
            //     innerRadius: 0.05,
            //     segments: 4,
            // });

            // Init Reticle
            Reticle.set({
                renderer: SceneManager.renderer,
                scene: SceneManager.scene,
                camera: SceneManager.camera,
                fileName: 'models/gizmo.glb'
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
     * When user TAP on screen,
     * we need to finish calibration and go to Game,
     * or send the hitMatrix to Game
     * to create an asset on hitMatrix
     */
    const onTapOnScreen = () => {

        if (!canEdit()) return;

        console.log('>> onTapOnScreen:', tapEnabled())

        // Stop here if it's a DOM event
        if (!tapEnabled()) {
            setTapEnabled(() => true);
            return;
        }

        if (Reticle.isHitting() || !Reticle.usePlaneDetection()) {
            const reticleMatrix = new Matrix4().copy(Reticle.getHitMatrix());

            // Set the hitMatrix signal
            setHitMatrix(() => reticleMatrix);
            console.log("MATRICE CAMBIATA!")

            // First time...
            if (!calibrationCompleted) {

                if (config.isDebug) {
                    SceneManager.addGltfToScene(SceneManager.gizmo, hitMatrix(), "referenceGizmo");
                }

                calibrationCompleted = true;
                goToGame();
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
        if (SceneManager._initialized) {
            if (frame) {
                Reticle.update(frame, (surfType) => {
                });
                setPlaneFound(Reticle.isHitting())
            }
            SceneManager.update();
        }
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
                return <WelcomeUser
                    jsonData={jsonData()}
                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    userId={props.userId}
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
                    currentMode={props.currentMode}
                    disableTap={setTapEnabled(() => false)}
                    canEdit={canEdit()}
                    setCanEdit={(value) => setCanEdit(() => value)}
                    userId={props.userId}
                    marker={props.marker}
                    saveData={(data) => handleSaveMarkerData(data)}
                    scene={SceneManager.scene}
                    data={jsonData()}
                    hitMatrix={hitMatrix()}
                    onClose={handleBackToHome}
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




    //#region [style]






    //#region [return]

    return (
        <div id="arSession">
            {renderView()}
        </div>
    );
}
