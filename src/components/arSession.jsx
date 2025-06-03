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
    const [jsonData, setJsonData] = createSignal(null);
    const [loading, setLoading] = createSignal(false);

    //
    // On mount switch from Welcome / EditMarker
    //
    onMount(async () => {
        if (props.currentMode === AppMode.SAVE) {
            goEditMarker();
        }
        else if (props.currentMode === AppMode.LOAD) {
            await loadJsonData();
            if (jsonData()) {

                // All good, we've loaded the JSON data and we can
                // go to Welcome screen
                goToWelcome();
            }
            else {
                console.error("You are loading a marker as anonymous, but marker has no data or does not exist!")
                goToMarkerNotExist();
            }
        }
        else console.error("AppMode not specified")
    })



    const loadJsonData = async () => {
        setLoading(() => true)
        try {
            // Load JSON from Realtime DB
            const path = `${props.userId}/${props.marker.id}/data`;
            const data = await firebase.realtimeDb.loadData(path);

            setJsonData(() => data);
            setLoading(() => false)

        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }


    //
    // Start AR
    //
    const startAr = () => {

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
            goToGame();
        } catch (error) {
            console.error("Errore aggiunta marker:", error);
            throw error;
        }
    };


    //
    // Modify an existing marker that have a JSON associated,
    // loading its JSON
    //
    const handleModifyMarker = async () => {
        await loadJsonData();
        goToGame();
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


    //
    // Navigation
    //
    const goToWelcome = () => setCurrentView(VIEWS.WELCOME);
    const goEditMarker = () => setCurrentView(VIEWS.EDIT_MARKER);
    const goToCalibration = () => setCurrentView(VIEWS.CALIBRATION);
    const goToGame = () => setCurrentView(VIEWS.GAME);
    const goToMarkerNotExist = () => setCurrentView(VIEWS.MARKER_NOT_EXIST);


    //
    // Render
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
                    onCreate={handleCreateMarker}
                    onModify={handleModifyMarker}
                    onDelete={handleDeleteMarker}
                    onCancel={handleBackToHome}
                />;

            case VIEWS.CALIBRATION:
                return <Calibration

                />;

            case VIEWS.GAME:
                return <Game
                    marker={props.marker}
                    jsonData={jsonData()}
                />;

            case VIEWS.MARKER_NOT_EXIST:
                return <MarkerNotExist/>;
        }
    };


    return (
        <div class="full-screen">
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
