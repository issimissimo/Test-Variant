import { ref, set, get, onValue, off, remove } from "firebase/database";
import { realtimeDb } from "./init";
import { createSignal, onCleanup } from "solid-js";

export const saveData = async (path, data) => {
    const dbRef = ref(realtimeDb, path);
    try {
        await set(dbRef, data);
    } catch (error) {
        throw new Error(`Save failed: ${error.message}`);
    }
};

export const loadData = async (path) => {
    const dbRef = ref(realtimeDb, path);
    try {
        const snapshot = await get(dbRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        throw new Error(`Load failed: ${error.message}`);
    }
};

export const deleteData = async (path) => {
    const dbRef = ref(realtimeDb, path);
    try {
        console.log(`Tentativo di eliminare il percorso: ${path}`);
        await remove(dbRef);
        console.log(`Percorso ${path} eliminato con successo`);
        return true;
    } catch (error) {
        console.error(`Errore durante l'eliminazione del percorso ${path}:`, error);
        throw new Error(`Delete failed: ${error.message}`);
    }
};

export const useRealtimeData = (path) => {
    const [data, setData] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    const dbRef = ref(realtimeDb, path);

    const listener = (snapshot) => {
        setData(snapshot.exists() ? snapshot.val() : null);
        setLoading(false);
    };

    onValue(dbRef, listener);

    onCleanup(() => off(dbRef, 'value', listener));

    return { data, loading };
};