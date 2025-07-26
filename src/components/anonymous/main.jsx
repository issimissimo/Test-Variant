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
  const [markerValid, setMarkerValid] = createSignal(false)

  
  //#region [lifeCycle]
  onMount(() => {
    loadMarkerFromFirestore();
  })


  //#region [functions]
  const loadMarkerFromFirestore = async () => {
    const marker = await firebase.firestore.fetchMarker(props.userId, props.markerId);

    if (marker !== undefined && marker !== null) {
      setMarkerValid(() => marker.withData);
      
      // Initialize SceneManager
      if (markerValid()) {
        SceneManager.init();
      }
    }

    props.onCheckFinished(marker);
    // setLoading(() => false);
    // props.onCheckFinished(marker);
  }



  //#region [return]
  return (
    <div>
      {!props.loading && (
        markerValid() ? <Welcome /> : <Error />
      )}
    </div>
  );
}