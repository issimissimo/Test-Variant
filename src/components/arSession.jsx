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
    const [currentView, setCurrentView] = createSignal(VIEWS.WELCOME);
    const [jsonData, setJsonData] = createSignal(null);
    const [loading, setLoading] = createSignal(false);

    onMount(async () => {

        setLoading(() => true)

        // If we are in "SAVE" mode (so, we are coming from HOME)
        // go to EditMarker screen
        if (props.currentMode === AppMode.SAVE) setCurrentView(() => VIEWS.EDIT_MARKER);

        console.log('userId: ', props.userId)
        console.log('markerId: ', props.markerId)

        if (props.userId && props.markerId) {
            try {
                const path = `${props.userId}/${props.markerId}/data`;
                const data = await firebase.realtimeDb.loadData(path);
                // setJsonExists(!!data);
                setJsonData(() => data);
                console.log(data)

                setLoading(() => false)

            } catch (error) {
                console.error("Errore nel controllo JSON:", error);
            }
        }
    })

    //
    // Start AR
    //
    const startAr = () => {

    }


    // Renderizza la vista corrente
    const renderView = () => {

        switch (currentView()) {

            case VIEWS.WELCOME:
                return <Welcome

                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker

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
