import {
    useAuthState,
    registerUser,
    loginUser,
    logoutUser,
    loginAnonymousUser
} from '../lib/firebase/auth';

import {
    updateLastLogin,
    fetchUserData,
    fetchMarkers,
    addMarker,
    updateMarker,
    deleteMarker,
    fetchMarker,
    addGame,
    deleteGame,
    fetchGames
} from '../lib/firebase/firestore';

import { saveData, loadData, useRealtimeData, deleteData } from '../lib/firebase/realtimeDb';

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
            logout: logoutUser,
            loginAnonymous: loginAnonymousUser,
            updateLoginTimestamp: updateLastLogin
        },

        firestore: {
            fetchUserData: () => user() ? fetchUserData(user().uid) : Promise.resolve(null),
            fetchMarkers: (userId) => fetchMarkers(userId),
            fetchMarker: (userId, markerId) => fetchMarker(userId, markerId),
            addMarker: (userId, name) => addMarker(userId, name),
            updateMarker: (userId, markerId, name, withData) => updateMarker(userId, markerId, name, withData),
            deleteMarker: (userId, markerId) => deleteMarker(userId, markerId),
            addGame: (userId, markerId, name) => addGame(userId, markerId, name),
            deleteGame: (userId, markerId, gameId) => deleteGame(userId, markerId, gameId),
            fetchGames: (userId, markerId) => fetchGames (userId, markerId)
        },

        realtimeDb: {
            saveData,
            loadData,
            useRealtimeData,
            deleteData
        }
    };
};