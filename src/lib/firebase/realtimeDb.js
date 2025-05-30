import {
    ref,
    set,
    get,
    onValue,
    off
} from "firebase/database";
import { realtimeDb } from "./init";

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

import { createSignal, onCleanup } from "solid-js";

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