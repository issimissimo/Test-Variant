import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { generateQRCodeForForMarker } from '../hooks/useQRCode';
import { css } from 'goober';
import { styled } from 'solid-styled-components';

const containerStyle = css`
  max-width: 28rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const headingStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
`;

const buttonStyle = css`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-right: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
`;


const dangerButton = css`
  ${buttonStyle}
  background-color: #ef4444;
  color: white;
  &:hover {
    background-color: #dc2626;
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





export default function EditMarker(props) {

  //#region [constants]

  const firebase = useFirebase();
  const [name, setName] = createSignal(props.marker?.name || '');


  //#region [lifeCycle]

  onMount(() => {
    if (props.marker.withData) {
      generateQRCodeForForMarker(props.userId, props.marker.id);
    }
  })

  createEffect(() => {
    if (name() !== props.marker.name) {
      updateName()
    }
  })


  //#region [functions]

  const save = async () => {

  }

  const updateName = async () => {
    try {
      await firebase.firestore.updateMarker(props.userId, props.marker.id,
        name(), props.marker.withData);
    } catch (error) {
      console.log({ type: 'error', text: `Errore: ${error.message}` });
    }
  }


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


  const Button = styled('button')`
        width: 100%;
        height: 40px;
        border-radius: 90px;
        border: none;
        outline: none;
        margin-top: 15px;
        opacity: ${props => props.active ? 1 : 0.3};
        pointer-events: ${props => props.active ? 'auto' : 'none'};
        background: rgba(68, 68, 68, 0.2);
        
    `


  //#region [return]

  return (
    <Container id="editMarker">
      {/* <h2 class={headingStyle}>
        {props.marker?.id ? 'Modifica Elemento' : 'Nuovo Elemento'}
      </h2> */}

      <Form>
        <Title id="title"
          type="text"
          value={name()}
          // onInput={(e) => setName(() => e.target.value)}
          onChange={(e) => setName(() => e.target.value)}
          placeholder="Nome"
          required
        />


        {/* <button 
            type="submit"
            class={props.marker?.id ? editButton : createButton}
            disabled={loading()}
          >
            {loading()
              ? 'Salvataggio...'
              : props.marker?.id
                ? (props.jsonData? 'Modifica' : 'Crea')
                : 'Crea'}
          </button> */}

        {/* {
            props.marker.withData ?
              <button
                type="button"
              // onClick={() => { props.onModify() }}
              // disabled={loading()}
              >
                MODIFICA
              </button>
              :
              <button
                type="button"
                // onClick={() => { props.onCreate(name()) }}
                disabled={!props.markerName}
              >
                CREA
              </button>
          } */}
        {props.marker.withData ?
          <img id="qr-code" />
          :
          <p>No data here!</p>


        }


        <Button
          type="button"
          onClick={() => { props.onCancel() }}
          active={true}
        // disabled={loading()}
        >
          Annulla
        </Button>

        <Button
          type="button"
          onClick={() => { props.onCancel() }}
        // disabled={loading()}
        >
          Salva
        </Button>

        {props.marker?.id && (
          <Button
            type="button"
            onClick={props.onDelete}
          // disabled={loading()}
          >
            Elimina
          </Button>
        )}

      </Form>
    </Container>
  );
}