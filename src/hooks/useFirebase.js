import {
    useAuthState,
    registerUser,
    loginUser,
    logoutUser
} from '../lib/firebase/auth';
import { updateLastLogin, fetchUserData } from '../lib/firebase/firestore';
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
        },

        realtimeDb: {
            saveData,
            loadData,
            useRealtimeData
        }
    };
};