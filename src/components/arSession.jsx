import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';

function ArSession(props) {
    const firebase = useFirebase();
    const [data, setData] = createSignal(null);

    // Carica i dati esistenti al mount
    onMount(async () => {
        console.log(props.userId)
        console.log(props.markerId)

        try {
            const path = `${props.userId}/${props.markerId}/data`;
            const data = await firebase.realtimeDb.loadData(path);

            if (data) {
                console.log("JSON esistente:", data);
                setData(data);
            }
        } catch (error) {
            console.error("Errore caricamento JSON:", error);
        }
    });

    return (
        <div class="full-screen-div">
            AR
            <p>
                {JSON.stringify(data())}
            </p>
        </div>
    )
}
export default ArSession