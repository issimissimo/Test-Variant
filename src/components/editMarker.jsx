import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { generateQRCodeForForMarker } from '../hooks/useQRCode';
import { styled } from 'solid-styled-components';
import { Button, BUTTON_MODE } from './ui/ui';




export default function EditMarker(props) {


  //#region [constants]
  const firebase = useFirebase();
  const [name, setName] = createSignal(props.marker?.name || '');
  const [oldName, setOldName] = createSignal(props.marker?.name || '');
  const [canSave, setCanSave] = createSignal(false);


  //#region [lifeCycle]
  onMount(() => {
    if (props.marker.withData) {
      generateQRCodeForForMarker(props.userId, props.marker.id);
    }
  })

  createEffect(() => {
    if (name() !== props.marker.name && name() !== "" && name() !== oldName()) {
      console.log("adesso posso salvare")
      // updateName()
      setCanSave(() => true)
    }
    else {
      console.log("adesso NON posso salvare")
      setCanSave(() => false)
    }
  })


  //#region [functions]
  const saveMarker = async () => {
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
      const path = `${props.userId}/${props.marker.id}`;
      await firebase.realtimeDb.deleteData(path);
      props.onCancel();
    } catch (error) {
      console.error("Errore completo cancellazione marker:", error);
    }
  };


  //#region [style]
  const Container = styled('div')`
        max-width: 28rem;
        margin: 0 auto;
        padding: 1.5rem;
        background-color: grey;
 
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
          onClick={() => { props.onCancel() }}
          active={true}
          mode={BUTTON_MODE.DEFAULT}
        >
          Indietro
        </Button>

        <Button
          type="button"
          onClick={saveMarker}
          active={canSave()}
          mode={BUTTON_MODE.HIGHLIGHT}
        >
          Salva
        </Button>

        {props.marker?.id && (
          <Button
            onClick={() => { deleteMarker() }}
            active={true}
            mode={BUTTON_MODE.DANGER}
            icon="fas fa-trash-alt"
          >
            Elimina
          </Button>
        )}
      </Form>
    </Container>
  );
}