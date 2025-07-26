import { createSignal, onMount } from 'solid-js';
import { useFirebase } from '../../hooks/useFirebase';

//UI
import Welcome from './welcome';
import Error from './error';

// XR
import SceneManager from '../../xr/sceneManager';


export default function Main(props) {

  //#region [constants]
  const firebase = useFirebase();
  const [loading, setLoading] = createSignal(true);
  const [markerValid, setMarkerValid] = createSignal(false)

  
  //#region [lifeCycle]
  onMount(() => {
    loadMarkerFromFirestore();
  })


  //#region [functions]
  const loadMarkerFromFirestore = async () => {
    const marker = await firebase.firestore.fetchMarker(props.userId, props.markerId);
    console.log(marker)

    if (marker !== undefined && marker !== null) {
      setMarkerValid(() => marker.withData);
      
      // Initialize SceneManager
      if (markerValid()) {
        SceneManager.init();
      }
    }

    setLoading(() => false);
    props.onMarkerLoaded;
  }



  //#region [return]
  return (
    <div>
      {!loading() && (
        markerValid() ? <Welcome /> : <Error />
      )}
    </div>
  );
}