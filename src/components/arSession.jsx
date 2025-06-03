import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';

import { AppMode } from '../app';
import Welcome from './arSession/welcome';
import EditMarker from './arSession/editMarker';
import Calibration from './arSession/calibration';
import Game from './arSession/game';


const VIEWS = {
    WELCOME: 'welcome',
    EDIT_MARKER: 'editMarker',
    CALIBRATION: 'calibration',
    GAME: 'game'
};


export default function ArSession(props) {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(null);
    const [jsonData, setJsonData] = createSignal(null);
    const [loading, setLoading] = createSignal(false);

    onMount(async () => {
        setLoading(() => true)

        if (props.userId && props.marker.id) {
            console.log("ci provo....")
            try {
                // Load JSON from Realtime DB
                const path = `${props.userId}/${props.marker.id}/data`;
                const data = await firebase.realtimeDb.loadData(path);

                setJsonData(() => data);
                setLoading(() => false)

            } catch (error) {
                console.error("Errore nel controllo JSON:", error);
            }
        }

        if (props.currentMode === AppMode.SAVE) setCurrentView(() => VIEWS.EDIT_MARKER);
        else if (props.currentMode === AppMode.LOAD && jsonData() !== null) setCurrentView(() => VIEWS.WELCOME);
        else {
            console.error("NON C'E' JSON!!!")
        }
    })

    //
    // Start AR
    //
    const startAr = () => {

    }

    const handleBackToHome = () => {
        props.backToHome();
    }

    const handleCreateMarker = async (name) => {
        try {
            const newMarkerId = await firebase.firestore.addMarker(firebase.auth.user().uid, name);
            console.log('marker creato:', newMarkerId)
            return newMarkerId; // Restituisci l'ID per EditMarker
        } catch (error) {
            console.error("Errore aggiunta marker:", error);
            throw error;
        }
    };

    const handleDeleteMarker = async () => {
        try {
            await firebase.firestore.deleteMarker(props.userId, props.marker.id);

            const path = `${props.userId}/${props.marker.id}`;
            await firebase.realtimeDb.deleteData(path);

            props.backToHome;
        } catch (error) {
            console.error("Errore completo cancellazione marker:", error);
        }
    };


    // Renderizza la vista corrente
    const renderView = () => {

        switch (currentView()) {

            case VIEWS.WELCOME:
                return <Welcome

                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    marker={props.marker}
                    onCreate={handleCreateMarker}
                    onDelete={handleDeleteMarker}
                    onCancel={handleBackToHome}
                    jsonData={jsonData()}
                />;

            case VIEWS.CALIBRATION:
                return <Calibration

                />;

            case VIEWS.GAME:
                return <Game

                />;
        }
    };

    return (
        <div class="full-screen-div">
            {renderView()}
            {!loading() && JSON.stringify(jsonData())}
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
