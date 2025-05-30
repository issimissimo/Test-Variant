import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth } from "./init";

export const registerUser = async (credentials) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );
        return userCredential.user;
    } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
    }
};

export const loginUser = async (credentials) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );
        return userCredential.user;
    } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(`Logout failed: ${error.message}`);
    }
};

import { createSignal, onCleanup } from "solid-js";

export const useAuthState = () => {
    const [user, setUser] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
        setLoading(false);
    });

    onCleanup(() => unsubscribe());

    return { user, loading };
};