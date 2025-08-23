import { createEffect, createSignal, onMount } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { config } from '@js/config';
import { styled } from 'solid-styled-components';

import GAMES_LIST from '@plugin';


export default function UI(props) {


    const getGamesAvailableByName = (gameName) => {
        const gameSpecs = GAMES_LIST.find(g => g.fileName === gameName);
        const totalAllowed = gameSpecs.allowed;
        let nGames = 0;
        props.marker.games.map(game => {
            if (game.name === gameName) nGames++;
        });
        return totalAllowed - nGames;
    }




    const Container = styled('div')`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        /* align-items: center;
        justify-content: center; */
    `;


    const Button = styled('button')`
        opacity: ${props => props.enabled ? 1 : 0.2};
        pointer-events: ${props => props.enabled ? 'auto' : 'none'};
        height: 40px;
    `;



    return (
        <Container id="Inventory">
            <p>INVENTORY</p>

            {
                GAMES_LIST.map(gameSpecs => (
                    <Button
                        onClick={() => props.loadGame(gameSpecs.fileName)}
                        enabled={getGamesAvailableByName(gameSpecs.fileName) > 0 ? true : false}
                    >{gameSpecs.title}</Button>
                ))
            }

        </Container>
    )
}