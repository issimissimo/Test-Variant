import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { generateQRCodeForForMarker } from '../hooks/useQRCode';
import { styled } from 'solid-styled-components';

//UI
import { Button, BUTTON_MODE, ArButtonContainer } from './ui/ui';
import { faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';




export default function EditMarker(props) {


  //#region [constants]
  const firebase = useFirebase();
  const [name, setName] = createSignal(props.marker?.name || '');
  const [oldName, setOldName] = createSignal(props.marker?.name || '');
  const [canSave, setCanSave] = createSignal(false);
  const [markerId, setMarkerId] = createSignal(props.marker.id)


  //#region [lifeCycle]
  onMount(() => {
    if (props.marker.withData) {
      generateQRCodeForForMarker(props.userId, props.marker.id);
    }
  })

  createEffect(() => {
    // Enable save button
    // only if something changed
    setCanSave(() => props.marker.name && name() !== "" && name() !== oldName() ?
      true : false)
  })


  createEffect(() => {
    // Create AR Button
    // only if it's not a new marker
    if (markerId() !== null) props.initScene();
  })

  //#region [functions]

  /**
    * Create a new marker, only in firebase
    * and with the property withData = false 
    * (JSON should be created later on)
     */
  const createMarker = async () => {
    try {
      const newMarkerId = await firebase.firestore.addMarker(props.userId, name());
      setMarkerId(() => newMarkerId);
      props.onNewMarkerCreated(newMarkerId, name);
      console.log('Creato in Firestore il marker con ID:', newMarkerId)
    } catch (error) {
      console.log({ type: 'error', text: `Errore: ${error.message}` });
    }
  };


  const updateMarker = async () => {
    try {
      await firebase.firestore.updateMarker(props.userId, props.marker.id,
        name(), props.marker.withData);
      setOldName(() => name());
    } catch (error) {
      console.log({ type: 'error', text: `Errore: ${error.message}` });
    }
  }



  /**
    * Delete a marker,
    * both from firebase and its JSON from RealTime DB,
    * and go back to Home
     */
  const deleteMarker = async () => {
    try {
      await firebase.firestore.deleteMarker(props.userId, props.marker.id);
      if (props.marker.withData) {
        const path = `${props.userId}/${props.marker.id}`;
        await firebase.realtimeDb.deleteData(path);
        goBack();
      }
      else goBack();
    } catch (error) {
      console.log({ type: 'error', text: `Errore: ${error.message}` });
    }
  };


  const goBack = () => {
    setMarkerId(() => null);
    props.onBack();
  }


  //#region [style]
  const Container = styled('div')`
        max-width: 28rem;
        margin: 0 auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        /* max-width: 28rem; */
        margin: 0 auto;
        /* padding: 1.5rem; */
        
        border-radius: 0.5rem;
        
        min-height: 500px;
    `

  const Form = styled('form')`
        display: flex;
        flex-direction: column;
    `

  const Title = styled('input')`
        width: 90%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border-radius: 12px;
        font-size: 1rem;
        text-align: center;
    `




  //#region [return]
  return (
    <Container id="editMarker">

      <Form>
        <Title id="title"
          type="text"
          value={name()}
          onInput={(e) => setName(() => e.target.value)}
          placeholder="Nome"
          required
        />

        {props.marker.withData ?
          <img id="qr-code" />
          :
          <p>No data here!</p>
        }

        <Button
          type="button"
          onClick={() => { goBack() }}
          active={true}
          mode={BUTTON_MODE.DEFAULT}
        >
          Indietro
        </Button>

        <Button
          type="button"
          onClick={props.marker.id ? updateMarker : createMarker}
          active={canSave()}
          mode={BUTTON_MODE.HIGHLIGHT}
          icon={faSave}
        >
          Salva
        </Button>

        {markerId() && (
          <Button
            onClick={() => { deleteMarker() }}
            active={true}
            mode={BUTTON_MODE.DANGER}
            icon={faTrashAlt}
          >
            Elimina
          </Button>
        )}
      </Form>

      <ArButtonContainer id="ArButtonContainer"/>
    </Container>
  );
}