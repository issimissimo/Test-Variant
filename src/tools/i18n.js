// 1) Oggetto con le traduzioni iniziali per ogni lingua
const translations = {
  en: { welcome: "Welcome!" },
  it: { welcome: "Benvenuto!" },
  es: { welcome: "¡Bienvenido!" }
};

// 2) Lingua corrente, determinata all’avvio
let currentLang = detectBrowserLanguage();

/**
 *  Rileva la lingua del browser e normalizza a 2 lettere.
 *  Usa 'en' come fallback se la lingua non è definita.
 */
function detectBrowserLanguage() {
  const navLang = navigator.language || (navigator.languages && navigator.languages[0]) || "en";
  const shortLang = navLang.slice(0, 2).toLowerCase();
  return translations[shortLang] ? shortLang : "en";
}

/**
 *  Restituisce la traduzione per la chiave specificata.
 *  Se mancante, ritorna la stessa chiave (fallback).
 *  @param {string} key - Es. "welcome" o "home.title"
 */
export function translate(key) {
  const keys = key.split(".");
  let result = translations[currentLang];
  for (const k of keys) {
    if (result && result[k] !== undefined) {
      result = result[k];
    } else {
      console.warn(`Missing translation for "${key}" in "${currentLang}"`);     
      return key;
    }
  }
  return result;
}