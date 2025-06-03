// **************************************
// ** Schermata di benvenuto per utente anonimo
// **
// **************************************

import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';


const containerStyle = css`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  color: black;
`;

const loadingStyle = css`
  text-align: center;
  padding: 2rem;
`;

const errorStyle = css`
  color: red;
  text-align: center;
  padding: 1rem;
`;

export default function Welcome(props) {
  // const firebase = useFirebase();
  // const [loading, setLoading] = createSignal(true);
  // const [error, setError] = createSignal('');
  // const [params, setParams] = createSignal(null);

  onMount(() => {
    // console.log('user', firebase.auth.user().uid)
  })

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

  return (
    <div>
      <h2>Benvenuto anonimo!</h2>
      <p>
        {JSON.stringify(props.jsonData)}
      </p>
    </div>
  );
}