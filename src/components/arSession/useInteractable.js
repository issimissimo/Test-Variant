import { createSignal, onMount } from 'solid-js';


// ===== HOOK BASE =====
export default function useInteractable(type, config = {}) {

    onMount(() => {
        console.log("useInteractable mounted")
    })

    // Funzione base
    const _onTapBase = () => {
        console.log(`${type} onTapBase`);
    };


    // Sistema override/super
    const onTap = config.onTap || _onTapBase;

    return {
        type,
        onTap,
        super: { onTap: _onTapBase }  // Accesso al "super"
    };
}