import { createEffect, createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { styled } from 'solid-styled-components';
import { Button, BUTTON_MODE } from '@/ui';
import { faPlus } from "@fortawesome/free-solid-svg-icons";



export default function MarkerList(props) {


  //#region [constants]
  const firebase = useFirebase();
  const [markers, setMarkers] = createSignal([]);


  //#region [lifeCycle]
  createEffect(() => {
    if (firebase.auth.authLoading() || !firebase.auth.user()) return;
    loadMarkers();
  });


  //#region [functions]
  const loadMarkers = async () => {
      const data = await firebase.firestore.fetchMarkers(firebase.auth.user().uid);
      setMarkers(data);
      
      // Hide the preloader
      props.setLoading(false);
  };


  const handleLogout = async () => {
    try {
      await firebase.auth.logout();
      if (props.onLogout) props.onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  //#region [style]
  const Container = styled('div')`
        max-width: 28rem;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        border-radius: 0.5rem;
        height: 100%;
    `

  const Item = styled('div')`
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
    `

  const AddNewContainer = styled('div')`
        position: absolute;
        bottom: 50px;
        left: 40px;
        right: 40px;
        /* width: 100%; */
    `




  //#region [return]
  return (
    <Container id="markerList">

      {firebase.auth.authLoading() ? (
        <div>
          <p>Verifica autenticazione in corso...</p>
        </div>
      ) : !firebase.auth.user() ? (
        <div>
          <p>Non sei autenticato.</p>
          <div>
            <button
              onClick={props.onGoToLogin}

            >
              Accedi
            </button>
            <button
              onClick={props.onGoToRegister}

            >
              Registrati
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <p><strong>Email:</strong> {firebase.auth.user().email}</p>
            {/* {userData() && userData().lastLogin && (
              <p>
                <strong>Ultimo accesso:</strong> {userData().lastLogin.toLocaleString()}
              </p>
            )}
            {userData() && userData().created && (
              <p>
                <strong>Account creato:</strong> {userData().created.toLocaleString()}
              </p>
            )} */}
            <button
              onClick={handleLogout}

            >
              Logout
            </button>
          </div>

          <div>


            <div>
              <h3>I tuoi marker</h3>
              {markers().length === 0 ? (
                <p>Nessun elemento presente</p>
              ) : (
                markers().map(marker => (
                  <Item
                    onClick={() => {
                      props.onMarkerClicked(marker)
                    }}
                  >
                    {marker.name}
                  </Item>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <AddNewContainer>
        <Button
          onClick={() => props.onCreateNewMarker()}
          icon={faPlus}
          mode={BUTTON_MODE.HIGHLIGHT}
        >
          Crea nuovo
        </Button>
      </AddNewContainer>
    </Container>
  );
}