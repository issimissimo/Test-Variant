import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';
import { AppMode } from '../app';

// UI
import Welcome from './arSession/welcome';
import EditMarker from './arSession/editMarker';
import Calibration from './arSession/calibration';
import Game from './arSession/game';
import MarkerNotExist from './arSession/markerNotExist';

// XR
import SceneManager from '../xr/sceneManager';
import Reticle from '../xr/reticle';
import Persistence from '../xr/persistence';
import { Scene } from 'three';


const VIEWS = {
    WELCOME: 'welcome',
    EDIT_MARKER: 'editMarker',
    CALIBRATION: 'calibration',
    GAME: 'game',
    MARKER_NOT_EXIST: 'markerNotExist'
};


export default function ArSession(props) {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    const [newMarkerName, setNewMarkerName] = createSignal('');
    const [jsonData, setJsonData] = createSignal(null);
    const [planeFound, setPlaneFound] = createSignal(false);


    //
    // switch from Welcome / EditMarker
    //
    onMount(async () => {

        if (props.currentMode === AppMode.SAVE) {
            goToEditMarker();
            initialize();
        }
        else if (props.currentMode === AppMode.LOAD) {
            await loadJsonData();
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



    const loadJsonData = async () => {
        // setLoading(() => true)
        try {
            // Load JSON from Realtime DB
            const path = `${props.userId}/${props.marker.id}/data`;
            const data = await firebase.realtimeDb.loadData(path);

            setJsonData(() => data);
            console.log(data);
            // setLoading(() => false)

        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }


    //
    // Initialize
    //
    const initialize = () => {
        if (!SceneManager.initialized) {

            SceneManager.init();
            SceneManager.renderer.setAnimationLoop(render);
            SceneManager.renderer.xr.addEventListener("sessionstart", onSessionStarted);

            // Init Reticle
            Reticle.set({
                renderer: SceneManager.renderer,
                scene: SceneManager.scene,
                color: 0x00ff00,
                radius: 0.06,
                innerRadius: 0.05,
                segments: 4,
            });
        }
    }


    //
    // Events after the AR button is clicked
    //
    const onSessionStarted = () => {

        if (props.currentMode === AppMode.SAVE) {
            // Check if is a new marker
            console.log('current marker:', props.marker)

            if (props.marker.id) {
                console.log('current marker is saved, with id:', props.marker.id)

                if (props.marker.withData) {
                    console.log('...and it seem to have a JSON saved too...')
                    loadJsonData();
                }
            }

            else {
                console.log('current marker is not saved, we need to save it on Firestore...')
                handleCreateMarker(newMarkerName());
            }
        }

        goToCalibration();
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


    //
    // Modify an existing marker that have a JSON associated,
    // loading its JSON
    //
    const handleModifyMarker = async () => {
        await loadJsonData();
        // goToGame();
    }


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


    //
    // Navigation
    //
    const goToWelcome = () => setCurrentView(VIEWS.WELCOME);
    const goToEditMarker = () => setCurrentView(VIEWS.EDIT_MARKER);
    const goToCalibration = () => setCurrentView(VIEWS.CALIBRATION);
    const goToGame = () => setCurrentView(VIEWS.GAME);
    const goToMarkerNotExist = () => setCurrentView(VIEWS.MARKER_NOT_EXIST);


    //
    // RenderView
    //
    const renderView = () => {

        switch (currentView()) {

            case VIEWS.WELCOME:
                return <Welcome
                    jsonData={jsonData()}
                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    marker={props.marker}
                    markerName={newMarkerName()}
                    setMarkerName={(name) => setNewMarkerName(() => name)}
                    onCreate={handleCreateMarker}
                    onModify={handleModifyMarker}
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
                return <MarkerNotExist />;
        }
    };


    return (
        <div id="overlay" class="full-screen">
            {renderView()}
        </div>
    );


    // return (
    //     <div class="full-screen-div">
    //         AR Session
    //         <p>
    //             {JSON.stringify(jsonData())}
    //         </p>
    //     </div>
    // )
}
