import { onMount, createContext, useContext } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';


// ===== GAMES LIST (calibration excluded!) =====
// This list must be modified
// to add (or delete) every new game
export const GAMES_LISTING = [
    {
        fileName: "envLight",
        title: "Environment light",
        description: "Inserisci un'immagine HDRI 360 come luce ambientale",
        image: '/images/games/backgrounds/vetro.jpg',
        allowed: 1
    },
    {
        fileName: "basicRotCube",
        title: 'Test basico con un cubo che ruota',
        description: 'Da eliminare, solo di test',
        image: '/images/games/backgrounds/vetro.jpg',
        allowed: 1
    },
];



// ===== CONTEXT =====
export const Context = createContext();


// ===== HOOK BASE =====
export function useGame(gameName, config = {}) {

    const context = useContext(Context);
    const firebase = useFirebase();

    const gameDetails = GAMES_LISTING.find(g => g.fileName === gameName);

    onMount(() => {
        context.onReady(game);
    });


    const initialized = () => {
        context.onInitialized();
    }

    // Define functions for Realtime Database
    const loadGameData = async (gameId, callback) => {
        try {
            const path = `${context.userId}/markers/${context.markerId}/games/${gameId}`;
            const gameData = await firebase.realtimeDb.loadData(path);
            callback(gameData);
        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }

    const saveGame = async (gameData = null) => {
        // const jsonData = JSON.stringify(data);
        // console.log(jsonData)

        const gameId = await firebase.firestore.addGame(context.userId, context.markerId, gameName);
        console.log('Creato in Firestore il game con ID:', gameId)

        if (gameData) {
            try {
                const path = `${context.userId}/markers/${context.markerId}/games/${gameId}`;
                await firebase.realtimeDb.saveData(path, gameData);
                console.log('Creato in RealtimeDB il JSON con ID:', gameId)

            } catch (error) {
                console.log("Errore nel salvataggio JSON:", error);
            }
        }
    }





    // Define base functions
    const _onTapBase = () => {
        console.log(`${gameName} onTapBase`);
    };
    const _renderLoopBase = () => {
        console.log(`${gameName} renderLoopBase`);
    };


    // Define overridable / super functions
    const onTap = config.onTap || _onTapBase;
    const renderLoop = config.renderLoop || _renderLoopBase;

    // This
    const game = {
        name: gameName,
        appMode: context.appMode,
        initialized,
        onTap,
        super: { onTap: _onTapBase },
        renderLoop,
        loadGameData: loadGameData,
        saveGame: saveGame,
        gameDetails
    }

    return {
        game: game
    };
}