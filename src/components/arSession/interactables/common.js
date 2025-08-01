import { onMount, createContext, useContext } from 'solid-js';


// ===== INTERACTABLES LIST (calibration excluded!) =====
// This list must be modified
// to add (or delete) every new interactable game
export const Interactables = [
    {
        name: 'test1',
        description: 'aaaa',
        image: '/images/backgroundImages/vetro.jpg'
    },
    {
        name: 'test2',
        description: 'bbbb',
        image: '/images/backgroundImages/vetro.jpg'
    },
];



// ===== CONTEXT =====
export const Context = createContext();


// ===== HOOK BASE =====
export function useInteractable(type, config = {}) {

    const context = useContext(Context);

    onMount(() => {
        context.onReady(interactable);
    })


    // Define base functions
    const _onTapBase = () => {
        console.log(`${type} onTapBase`);
    };


    // Define overridable / super functions
    const onTap = config.onTap || _onTapBase;


    // This
    const interactable = {
        type,
        onTap,
        super: { onTap: _onTapBase }
    }

    return {
        interactable
    };
}