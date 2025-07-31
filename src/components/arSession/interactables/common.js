import { onMount, createContext, useContext } from 'solid-js';


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