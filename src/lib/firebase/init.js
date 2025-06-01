import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "../../env";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const anonymousLogin = async () => {
    try {
        console.log("init - anonymousLogin")
        const userCredential = await signInAnonymously(auth);
        console.log("init - LOGGED!")
        return userCredential.user;
    } catch (error) {
        throw new Error(`Anonymous login failed: ${error.message}`);
    }
};