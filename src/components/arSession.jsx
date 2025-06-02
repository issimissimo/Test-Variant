import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';


import Calibration from './arSession/calibration';
import Game from './arSession/game';


const VIEWS = {
    CALIBRATION: 'calibration',
    GAME: 'game'
};


export default function ArSession(props) {

    const [currentView, setCurrentView] = createSignal(VIEWS.CALIBRATION);


    //
    // Start AR
    //
    const startAr = () => {

    }


    // Renderizza la vista corrente
    const renderView = () => {

        switch (currentView()) {

            case VIEWS.CALIBRATION:
                return <Calibration

                />;

            case VIEWS.GAME:
                return <Game

                />;
        }
    };

    // return (
    //     <div>
    //         {renderView()}
    //     </div>
    // );


    return (
        <div class="full-screen-div">
            AR
            <p>
                {JSON.stringify(props.jsonData)}
            </p>
        </div>
    )
}
