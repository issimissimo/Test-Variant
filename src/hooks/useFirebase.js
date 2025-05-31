import {
    useAuthState,
    registerUser,
    loginUser,
    logoutUser
} from '../lib/firebase/auth';

import {
    updateLastLogin,
    fetchUserData,
    fetchMarkers,
    addMarker,
    updateMarker,
    deleteMarker
} from '../lib/firebase/firestore';

import { saveData, loadData, useRealtimeData } from '../lib/firebase/realtimeDb';

export const useFirebase = () => {
    const { user, loading: authLoading } = useAuthState();

    return {
        auth: {
            user,
            authLoading,
            register: async (credentials) => {
                const newUser = await registerUser(credentials);
                return newUser;
            },
            login: async (credentials) => {
                const loggedInUser = await loginUser(credentials);
                await updateLastLogin(loggedInUser.uid);
                return loggedInUser;
            },
            logout: logoutUser
        },

        firestore: {
            fetchUserData: () => user() ? fetchUserData(user().uid) : Promise.resolve(null),
            fetchMarkers: (userId) => fetchMarkers(userId),
            addMarker: (userId, name) => addMarker(userId, name),
            updateMarker: (userId, markerId, name) => updateMarker(userId, markerId, name),
            deleteMarker: (userId, markerId) => deleteMarker(userId, markerId)
        },

        realtimeDb: {
            saveData,
            loadData,
            useRealtimeData
        }
    };
};