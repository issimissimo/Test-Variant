import { onMount, createContext, useContext } from 'solid-js';


// ===== GAMES LIST (calibration excluded!) =====
// This list must be modified
// to add (or delete) every new game
export const GAMES_LISTING = [
    {
        name: 'Piazza un oggetto',
        description: 'Inserisci un oggetto 3D in AR',
        image: '/images/games/backgrounds/vetro.jpg'
    },
    {
        name: 'Evita i laser',
        description: 'Non farti beccare dai laser nella stanza',
        image: '/images/games/backgrounds/vetro.jpg'
    },
];



// ===== CONTEXT =====
export const Context = createContext();


// ===== HOOK BASE =====
export function useGame(gameName, config = {}) {

    const context = useContext(Context);

    onMount(() => {
        context.onReady(game);
    })


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
    }

    return {
        game: game
    };
}