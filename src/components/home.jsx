import { createEffect, createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { css } from 'goober';
// import EditMarker from './arSession/editMarker';


// Stili con Goober
const containerStyle = css`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: grey;
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

const markersListStyle = css`
  margin-bottom: 1.5rem;
`;

const markerItemStyle = css`
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: black;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const addButtonStyle = css`
  ${buttonStyle}
  background-color: #10b981;
  color: white;
  margin-bottom: 1.5rem;
  &:hover {
    background-color: #059669;
  }
`;

export default function Home(props) {
  const firebase = useFirebase();
  const [userData, setUserData] = createSignal(null);
  const [dataLoading, setDataLoading] = createSignal(true);
  const [markers, setMarkers] = createSignal([]);
  const [markersLoading, setMarkersLoading] = createSignal(true);
  const [editingMarker, setEditingMarker] = createSignal(null);


  // Effetto per caricare i dati utente quando lo stato di autenticazione cambia
  createEffect(() => {
    if (firebase.auth.authLoading()) return;

    if (!firebase.auth.user()) {
      setDataLoading(false);
      return;
    }

    loadUserData();
    loadMarkers();

    // 3. Se c'è un utente autenticato, carica i dati
    console.log("Utente autenticato:", firebase.auth.user().email);
  });


  // Funzione per caricare i markers
  const loadMarkers = async () => {
    setMarkersLoading(true);
    try {
      const data = await firebase.firestore.fetchMarkers(firebase.auth.user().uid);
      setMarkers(data);
    } catch (error) {
      console.error("Errore caricamento markers:", error);
    } finally {
      setMarkersLoading(false);
    }
  };

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


  // Gestione markers
  const handleAddMarker = async (name) => {
    try {
      const newMarkerId = await firebase.firestore.addMarker(firebase.auth.user().uid, name);
      loadMarkers(); // Ricarica la lista markers
      return newMarkerId; // Restituisci l'ID per EditMarker
    } catch (error) {
      console.error("Errore aggiunta marker:", error);
      throw error;
    }
  };

  const handleUpdateMarker = async (markerId, name) => {
    try {
      await firebase.firestore.updateMarker(firebase.auth.user().uid, markerId, name);
      loadMarkers();
    } catch (error) {
      console.error("Errore aggiornamento marker:", error);
    }
  };

  const handleDeleteMarker = async (markerId) => {
    try {
      const userId = firebase.auth.user().uid;
      console.log(`Eliminazione marker Firestore: ${userId}/${markerId}`);
      await firebase.firestore.deleteMarker(userId, markerId);

      const path = `${userId}/${markerId}`;
      console.log(`Tentativo di eliminazione Real Time DB: ${path}`);

      await firebase.realtimeDb.deleteData(path);
      console.log(`Dati Real Time DB eliminati per: ${path}`);

      loadMarkers();
    } catch (error) {
      console.error("Errore completo cancellazione marker:", error);
    }
  };

  return (
    <div class={containerStyle}>
      {/* {editingMarker() !== null ? (
        <EditMarker
          marker={editingMarker()}
          onCreate={handleAddMarker}
          onUpdate={handleUpdateMarker}
          onDelete={handleDeleteMarker}
          onCancel={() => setEditingMarker(null)}
          onEditMarker={props.onEditMarker}
        />
      ) : (
        <> */}
      <h2 class={headingStyle}>Home</h2>

      {firebase.auth.authLoading() ? (
        <div class={loadingStyle}>
          <p>Verifica autenticazione in corso...</p>
        </div>
      ) : !firebase.auth.user() ? (
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
      ) : dataLoading() || markersLoading() ? (
        <div class={loadingStyle}>
          <p>Caricamento dati...</p>
        </div>
      ) : (
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
              onClick={() => setEditingMarker({})}
              class={addButtonStyle}
            >
              + Crea nuovo elemento
            </button>

            <div class={markersListStyle}>
              <h3>I tuoi elementi</h3>
              {markers().length === 0 ? (
                <p>Nessun elemento presente</p>
              ) : (
                markers().map(marker => (
                  <div
                    class={markerItemStyle}
                    onClick={() => setEditingMarker(marker)}
                  >
                    {marker.name}
                  </div>
                ))
              )}
            </div>
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
      {/* </>
      )} */}
    </div>
  );
}