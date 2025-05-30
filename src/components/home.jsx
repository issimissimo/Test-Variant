import { createEffect, createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';

// Stili con Goober
const containerStyle = css`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const headingStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

const buttonStyle = css`
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
`;

const primaryButton = css`
  ${buttonStyle}
  background-color: #3b82f6;
  color: white;
  border: none;
  &:hover {
    background-color: #2563eb;
  }
`;

const secondaryButton = css`
  ${buttonStyle}
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const userInfoStyle = css`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  
  p {
    margin-bottom: 0.5rem;
  }
  
  strong {
    display: inline-block;
    width: 120px;
  }
`;

const loadingStyle = css`
  text-align: center;
  padding: 1rem;
  color: #6b7280;
`;

export default function Home(props) {
  const firebase = useFirebase();
  const [userData, setUserData] = createSignal(null);
  const [dataLoading, setDataLoading] = createSignal(true);

  // Effetto per caricare i dati utente quando lo stato di autenticazione cambia
  createEffect(() => {
    // 1. Se l'autenticazione è ancora in corso, non fare nulla
    if (firebase.auth.authLoading()) {
      console.log("Autenticazione in corso...");
      return;
    }

    // 2. Se non c'è utente autenticato
    if (!firebase.auth.user()) {
      console.log("Nessun utente autenticato");
      setDataLoading(false);
      return;
    }

    // 3. Se c'è un utente autenticato, carica i dati
    console.log("Utente autenticato:", firebase.auth.user().email);
    loadUserData();
  });

  // Funzione per caricare i dati utente da Firestore
  const loadUserData = async () => {
    setDataLoading(true);
    try {
      const data = await firebase.firestore.fetchUserData(firebase.auth.user().uid);
      setUserData(data);
      console.log("Dati utente:", data);
    } catch (error) {
      console.error("Errore caricamento dati utente:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Gestione logout
  const handleLogout = async () => {
    try {
      await firebase.auth.logout();
      if (props.onLogout) props.onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div class={containerStyle}>
      <h2 class={headingStyle}>Benvenuto</h2>

      {/* Stato di caricamento autenticazione */}
      {firebase.auth.authLoading() ? (
        <div class={loadingStyle}>
          <p>Verifica autenticazione in corso...</p>
        </div>
      ) :

        /* Nessun utente autenticato */
        !firebase.auth.user() ? (
          <div>
            <p>Non sei autenticato.</p>
            <div>
              <button
                onClick={props.onGoToLogin}
                class={primaryButton}
              >
                Accedi
              </button>
              <button
                onClick={props.onGoToRegister}
                class={secondaryButton}
              >
                Registrati
              </button>
            </div>
          </div>
        ) :

          /* Caricamento dati utente */
          dataLoading() ? (
            <div class={loadingStyle}>
              <p>Caricamento dati utente...</p>
            </div>
          ) :

            /* Dati utente disponibili */
            (
              <div>
                <div class={userInfoStyle}>
                  <p><strong>Email:</strong> {firebase.auth.user().email}</p>
                  {userData() && userData().lastLogin && (
                    <p>
                      <strong>Ultimo accesso:</strong> {userData().lastLogin.toLocaleString()}
                    </p>
                  )}
                  {userData() && userData().created && (
                    <p>
                      <strong>Account creato:</strong> {userData().created.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    onClick={handleLogout}
                    class={primaryButton}
                  >
                    Logout
                  </button>

                  <button
                    onClick={props.onGoToRegister}
                    class={secondaryButton}
                  >
                    Vai alla registrazione
                  </button>

                  <button
                    onClick={props.onGoToLogin}
                    class={secondaryButton}
                  >
                    Vai al login
                  </button>
                </div>
              </div>
            )}
    </div>
  );
}