import { onMount, createEffect, useContext } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import GAMES_LIST from '@plugin';
import { Context } from '@views/ar-overlay/arSession';
import SceneManager from '@js/sceneManager';



// ===== HOOK BASE =====
export function useGame(gameName, config = {}) {

    const context = useContext(Context);
    const firebase = useFirebase();

    const gameDetails = GAMES_LIST.find(g => g.fileName === gameName);
    const gameAssets = [];


    onMount(() => {
        context.onLoaded(game);
    });

    createEffect(()=>{
        console.log("@@@@@ loc completed:", context.localizationCompleted)
    })

    const initialized = () => {
        context.onInitialized();
    }

    const localizationCompleted = () => {
        context.localizationCompleted;
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


    const addToScene = (asset) => {
        // add new property
        asset.hidden = !asset.visible;
        gameAssets.push(asset);
        // add to scene
        SceneManager.scene.add(asset);
        console.log("gameAssets:", gameAssets)
    }


    const setVisible = (value) => {
        gameAssets.forEach(asset => {
            if (asset.isMesh && !asset.hidden) asset.visible = value;
        });
    }



    // Define base functions
    // const _onLocalizationCompletedBase = () => {
    //     console.log(`${gameName} onLocalizationCompletedBase`);
    // };
    const _onTapBase = () => {
        console.log(`${gameName} onTapBase`);
    };
    const _renderLoopBase = () => {
        console.log(`${gameName} renderLoopBase`);
    };


    // Define overridable / super functions
    // const onLocalizationCompleted = config.onLocalizationCompleted || _onLocalizationCompletedBase;
    const onTap = config.onTap || _onTapBase;
    const renderLoop = config.renderLoop || _renderLoopBase;

    // This
    const game = {
        name: gameName,
        appMode: context.appMode,
        initialized,
        localizationCompleted,
        onTap,
        super: { onTap: _onTapBase },
        renderLoop,
        loadGameData,
        saveGame,
        addToScene,
        setVisible,
        gameDetails
    }

    return {
        game: game
    };
}