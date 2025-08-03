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
        fileName: "laser",
        name: 'Evita i laser',
        description: 'Non farti beccare dai laser nella stanza',
        image: '/images/games/backgrounds/vetro.jpg',
        allowed: 4
    },
];



// ===== CONTEXT =====
export const Context = createContext();


// ===== HOOK BASE =====
export function useGame(gameName, config = {}) {

    const context = useContext(Context);
    const firebase = useFirebase();

    onMount(() => {
        context.onReady(game);
    });


    // Define functions for Realtime Database
    const loadData = async (gameId) => {
        try {
            const path = `${context.userId}/markers/${context.markerId}/games/${gameId}`;
            const data = await firebase.realtimeDb.loadData(path);
            return data;

        } catch (error) {
            console.error("Errore nel caricamento JSON:", error);
        }
    }

    const saveData = async (data) => {

        const gameId = await firebase.firestore.addGame(context.userId, context.markerId, gameName);
        console.log('Creato in Firestore il game con ID:', gameId)

        try {
            const path = `${context.userId}/markers/${context.markerId}/games/${gameId}`;
            await firebase.realtimeDb.saveData(path, data);
            console.log('Creato in RealtimeDB il JSON con ID:', gameId)

        } catch (error) {
            console.log("Errore nel salvataggio JSON:", error);
        }
    }

    
    const gameDetails = GAMES_LISTING.find(g => g.fileName === gameName);


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
        onTap,
        super: { onTap: _onTapBase },
        renderLoop,
        loadData,
        saveData,
        gameDetails
    }

    return {
        game: game
    };
}