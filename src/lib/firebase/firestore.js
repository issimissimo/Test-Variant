import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "firebase/firestore";
import { firestore } from "./init";

/**
 * Aggiorna il timestamp dell'ultimo accesso per un utente
 * @param {string} userId - ID dell'utente
 */
export const updateLastLogin = async (userId) => {
    try {
        const userRef = doc(firestore, "users", userId);
        await setDoc(userRef, {
            lastLogin: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Errore nell'aggiornamento ultimo accesso:", error);
        throw error;
    }
};

/**
 * Carica i dati utente da Firestore
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Object|null>} Dati utente o null se non trovato
 */
export const fetchUserData = async (userId) => {
    try {
        const userRef = doc(firestore, "users", userId);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            return {
                id: data.id,
                email: data.email,
                lastLogin: data.lastLogin?.toDate(), // Converti Firestore Timestamp a Date
                created: data.created?.toDate()      // Converti Firestore Timestamp a Date
            };
        }
        return null;
    } catch (error) {
        console.error("Errore nel caricamento dati utente:", error);
        throw error;
    }
};

/**
 * Salva i dati per un nuovo utente
 * @param {Object} user - Oggetto utente di Firebase
 */
export const saveNewUserData = async (user) => {
    try {
        const userRef = doc(firestore, "users", user.uid);

        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            created: serverTimestamp(),
            lastLogin: serverTimestamp()
        }, { merge: true });

        console.log("Dati nuovo utente salvati per:", user.email);
    } catch (error) {
        console.error("Errore nel salvataggio nuovo utente:", error);
        throw error;
    }
};