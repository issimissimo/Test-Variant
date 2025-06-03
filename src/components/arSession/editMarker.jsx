import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';

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

const primaryButton = css`
  ${buttonStyle}
  background-color: #3b82f6;
  color: white;
  &:hover {
    background-color: #2563eb;
  }
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

const infoButton = css`
  ${buttonStyle}
  background-color: #8b5cf6;
  color: white;
  &:hover {
    background-color: #7c3aed;
  }
`;

const createButton = css`
  ${buttonStyle}
  background-color: #10b981;
  color: white;
  &:hover {
    background-color: #059669;
  }
`;

const editButton = css`
  ${buttonStyle}
  background-color: #3b82f6;
  color: white;
  &:hover {
    background-color: #2563eb;
  }
`;

export default function EditMarker(props) {
  const [name, setName] = createSignal(props.marker?.name || '');

  return (
    <div class={containerStyle}>
      <h2 class={headingStyle}>
        {props.marker?.id ? 'Modifica Elemento' : 'Nuovo Elemento'}
      </h2>

      <form>
        <input
          type="text"
          class={inputStyle}
          value={name()}
          onInput={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
        />

        <div>
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

          {
            props.jsonData ?
              <button
                type="button"
                onClick={() => { props.onModify() }}
              // disabled={loading()}
              >
                MODIFICA
              </button>
              :
              <button
                type="button"
                onClick={() => { props.onCreate(name()) }}
              disabled={!name()}
              >
                CREA
              </button>
          }
          {/* <button
            type="button"
            // class={secondaryButton}
            onClick={() => { props.onCreate(name()) }}
          // disabled={loading()}
          >
            {props.jsonData ? 'Modifica' : 'Crea'}
          </button> */}


          <button
            type="button"
            class={secondaryButton}
            onClick={() => {
              props.onCancel()
            }}
          // disabled={loading()}
          >
            Annulla
          </button>

          {props.marker?.id && (
            <button
              type="button"
              class={dangerButton}
              onClick={props.onDelete}
            // disabled={loading()}
            >
              Elimina
            </button>
          )}
        </div>
      </form>
    </div>
  );
}