export const LocalStorage = {
    /**
     * Verifica se localStorage è disponibile
     * @returns {boolean}
     */
    isAvailable() {
        try {
            const testKey = "__storage_test__";
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn("localStorage non disponibile:", e);
            return false;
        }
    },

    /**
     * Salva un valore (oggetto o primitivo)
     * @param {string} key 
     * @param {any} value 
     */
    save(key, value) {
        if (!this.isAvailable()) return;
        const serialized = JSON.stringify(value);
        console.log(serialized);
        window.localStorage.setItem(key, serialized);
    },

    /**
     * Legge un valore e lo deserializza
     * @param {string} key 
     * @returns {any|null}
     */
    load(key) {
        if (!this.isAvailable()) return null;
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    },

    /**
     * Rimuove un singolo elemento
     * @param {string} key 
     */
    remove(key) {
        if (!this.isAvailable()) return;
        window.localStorage.removeItem(key);
    },

    /**
     * Pulisce tutto lo storage
     */
    clear() {
        if (!this.isAvailable()) return;
        window.localStorage.clear();
    }
};
