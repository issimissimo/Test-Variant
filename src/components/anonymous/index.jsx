import { createSignal, onMount } from 'solid-js';
import { useFirebase } from '../../hooks/useFirebase';

//Components
import Welcome from './welcome';
import Error from './error';

//UI
import { ArButtonContainer } from '../ui/ui';


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
    }

    props.onCheckFinished(marker);
  }



  //#region [return]
  return (
    <div>
      {!props.loading && (
        markerValid() ?
          <div>
            <Welcome />
            <ArButtonContainer id="ArButtonContainer"/>
          </div>
          :
          <Error />
      )}
    </div>
  );
}