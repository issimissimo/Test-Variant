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

    return {
        auth: {
            user,
            authLoading,
            register: async (credentials) => {
                const newUser = await registerUser(credentials);
                // Salva i dati con il flag isNewUser=true
                await saveUserData(newUser, true);
                return newUser;
            },
            login: async (credentials) => {
                const loggedInUser = await loginUser(credentials);
                // Aggiorna solo lastLogin
                await updateLastLogin(loggedInUser.uid);
                return loggedInUser;
            },
            logout: logoutUser
        },

        firestore: {
            fetchUserData: () => user() ? fetchUserData(user().uid) : Promise.resolve(null),
            // Non è più necessario esporre saveUserData
        },

        realtimeDb: {
            saveData,
            loadData,
            useRealtimeData
        }
    };
};