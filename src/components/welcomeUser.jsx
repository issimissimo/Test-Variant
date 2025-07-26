import { createSignal, createEffect, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';
import { useFirebase } from '../hooks/useFirebase';

// XR
import SceneManager from '../xr/sceneManager';


export default function WelcomeUser(props) {


  const firebase = useFirebase();
  const [loading, setLoading] = createSignal(true);
  const [markerValid, setMarkerValid] = createSignal(false)

  onMount(() => {
    loadMarkerFromFirestore();
  })

  const loadMarkerFromFirestore = async () => {
    const marker = await firebase.firestore.fetchMarker(props.userId, props.markerId);
    console.log(marker)

    if (marker !== undefined && marker !== null) {
      setMarkerValid(() => marker.withData);
    }

    setLoading(() => false);
    props.onMarkerLoaded;
  }

  // // Effetto per gestire il login anonimo e la reattività
  // createEffect(() => {

  //     // Se non autenticato E non in stato di loading, fai login anonimo
  //     if (!firebase.auth.user() && !firebase.auth.authLoading()) {
  //         console.log("Inizio login anonimo...");
  //         firebase.auth.loginAnonymous()
  //             .then(user => {
  //                 console.log("Login anonimo completato:", user);
  //             })
  //             .catch(err => {
  //                 console.error("Errore login anonimo:", err);
  //                 setError(`Accesso fallito: ${err.message}`);
  //                 setLoading(false);
  //             });
  //     }
  // });

  // // Effetto per reagire ai cambiamenti dello stato di autenticazione
  // createEffect(() => {
  //     console.log("Stato autenticazione cambiato:", {
  //         user: firebase.auth.user(),
  //         loading: firebase.auth.authLoading()
  //     });

  //     // Se l'autenticazione è completata e abbiamo i parametri
  //     if (!firebase.auth.authLoading() && params()) {
  //         console.log("Autenticazione pronta");
  //         setLoading(() => false);
  //     }
  // });

  // const handleStart = () => {
  //     // props.onEnter(params().userId, params().elementId);
  //     props.onStart();
  // };

  // if (loading()) {
  //     return (
  //         <div class={containerStyle}>
  //             <div class={loadingStyle}>
  //                 <p>Accesso in corso...</p>
  //             </div>
  //         </div>
  //     );
  // }

  // if (error()) {
  //     return (
  //         <div class={containerStyle}>
  //             <div class={errorStyle}>
  //                 <p>{error()}</p>
  //             </div>
  //         </div>
  //     );
  // }


  const WelcomeScreen = () => {
    return (
      <div>
        <h2>Benvenuto</h2>
        <p>
          {JSON.stringify(props.jsonData)}
        </p>
      </div>
    );
  }

  const UnavailableScreen = () => {
    return (
      <div>
        NON ESISTE!
      </div>
    )
  }

  //#region [return]
  return (
    <div>
      {!loading() && (
        markerValid() ? <WelcomeScreen /> : <UnavailableScreen />
      )}
    </div>
  );
}