import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { generateQRCodeForForMarker } from '../hooks/useQRCode';
import { styled } from 'solid-styled-components';

//UI
import { Button, BUTTON_MODE, ArButtonContainer, BackButton } from './ui/ui';
import { faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';

// Interactables
import { Interactables } from './arSession/interactables/common';


export default function EditMarker(props) {


  //#region [constants]
  const firebase = useFirebase();
  const [markerId, setMarkerId] = createSignal(props.marker.id)
  const [markerName, setMarkerName] = createSignal(props.marker?.name || '');
  const [oldMarkerName, setOldMarkerName] = createSignal(props.marker?.name || '');
  const [canSave, setCanSave] = createSignal(false);
  const [empty, setEmpty] = createSignal(false);



  //#region [lifeCycle]
  onMount(() => {
    if (props.marker.id) {
      if (props.marker.games.length > 0) {
        generateQRCodeForForMarker(props.userId, props.marker.id);
        return;
      }
    }
    setEmpty(() => true);
  })

  createEffect(() => {
    // Enable save button
    // only if something changed
    setCanSave(() => props.marker.name && markerName() !== "" && markerName() !== oldMarkerName() ?
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
    const newMarkerId = await firebase.firestore.addMarker(props.userId, markerName());
    setMarkerId(() => newMarkerId);
    props.onNewMarkerCreated(newMarkerId, markerName);
    console.log('Creato in Firestore il marker con ID:', newMarkerId)
  };

  /**
    * Update marker name
     */
  const updateMarkerName = async () => {
    await firebase.firestore.updateMarker(props.userId, props.marker.id,
      markerName());
    setOldMarkerName(() => markerName());
  }

  /**
    * Delete a marker,
    * both from firebase and its JSON from RealTime DB,
    * and go back to Home
     */
  const deleteMarker = async () => {
    await firebase.firestore.deleteMarker(props.userId, props.marker.id);
    if (props.marker.withData) {
      const path = `${props.userId}/${props.marker.id}`;
      await firebase.realtimeDb.deleteData(path);
      goBack();
    }
    else goBack();
  };


  const createGame = async () => {
    const newGameId = await firebase.firestore.addGame(props.userId, props.marker.id, "testGame");
    // setMarkerId(() => newMarkerId);
    // props.onNewMarkerCreated(newMarkerId, markerName);
    console.log('Creato in Firestore il game con ID:', newGameId)
  }


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
        /* flex-direction: column; */
        /* max-width: 28rem; */
        margin: 0 auto;
        /* padding: 1.5rem; */
        
        border-radius: 0.5rem;
        
        min-height: 500px;
        margin-top: 50px;
        justify-content: center;
    `

  const Form = styled('form')`
        display: flex;
        flex-direction: column;
        width: 100%;
    `

  const Title = styled('input')`
        width: 90%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border-radius: 12px;
        font-size: 1rem;
        text-align: center;
    `

  const QrCodeContainer = styled('div')`
        width: 100%;
        align-items: center;
    `

  const QrCodeImg = styled('img')`
        text-align: center;
    `


  //#region [return]
  return (
    <Container id="editMarker">

      <BackButton onClick={() => goBack()} />

      <Form>
        <Title id="title"
          type="text"
          value={markerName()}
          onInput={(e) => setMarkerName(() => e.target.value)}
          placeholder="Nome"
          required
        />

        <div>
          {Interactables.map(el => (
            <button
            // onClick={() => setSelectedMaterial(material.name)}
            // style={{
            //   margin: '5px',
            //   padding: '20px',
            //   width: '150px',
            //   height: '100px',
            //   border: selectedMaterial() === material.name ? '3px solid #007acc' : '2px solid #ddd',
            //   borderRadius: '8px',
            //   backgroundImage: `url(${material.image})`,
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            //   color: 'white',
            //   fontSize: '16px',
            //   fontWeight: 'bold',
            //   textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            //   cursor: 'pointer'
            // }}
            >
              {el.name.charAt(0).toUpperCase() + el.name.slice(1)}
            </button>
          ))}
        </div>


        {/* <QrCodeContainer>
          {props.marker.games.length > 0 ?
            <QrCodeImg id="qr-code" />
            :
            <p>No data here!</p>
          }
        </QrCodeContainer> */}
        <QrCodeContainer>
          {empty() ?
            <p>No data here!</p>
            :
            <QrCodeImg id="qr-code" />
          }
        </QrCodeContainer>

        <Button
          type="button"
          onClick={props.marker.id ? updateMarkerName : createMarker}
          active={canSave()}
          mode={BUTTON_MODE.HIGHLIGHT}
          icon={faSave}
        >
          Salva
        </Button>

        {markerId() && (
          <Button
            onClick={deleteMarker}
            active={true}
            mode={BUTTON_MODE.DANGER}
            icon={faTrashAlt}
          >
            Elimina
          </Button>
        )}

        <Button
          type="button"
          onClick={createGame}
          active={true}
          mode={BUTTON_MODE.DEFAULT}
          icon={faSave}
        >
          CREA GAME TEST
        </Button>
      </Form>

      <ArButtonContainer id="ArButtonContainer" />
    </Container>
  );
}