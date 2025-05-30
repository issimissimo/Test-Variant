import { onMount } from 'solid-js';
import {
    useAuthState,
    registerUser,
    loginUser,
    logoutUser
} from '../lib/firebase/auth';
import { saveUserData, fetchUserData } from '../lib/firebase/firestore';
import { saveData, loadData, useRealtimeData } from '../lib/firebase/realtimeDb';

export const useFirebase = () => {
    const { user, loading: authLoading } = useAuthState();

    // Aggiorna lastLogin su Firestore dopo il login
    onMount(async () => {
        if (user()) {
            try {
                await saveUserData(user());
            } catch (error) {
                console.error("Errore nel salvataggio dati utente:", error);
            }
        }
    });

    return {
        auth: {
            user,          // Stato dell'utente (null se non autenticato)
            authLoading,   // Stato di caricamento dell'autenticazione (true/false)
            register: registerUser,
            login: loginUser,
            logout: logoutUser
        },

        firestore: {
            fetchUserData: () => user() ? fetchUserData(user().uid) : Promise.resolve(null),
            saveUserData: () => user() ? saveUserData(user()) : Promise.resolve()
        },

        realtimeDb: {
            saveData,
            loadData,
            useRealtimeData
        }
    };
};