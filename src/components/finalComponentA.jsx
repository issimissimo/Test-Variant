import { createSignal, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
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

const headingStyle = css`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

const infoStyle = css`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
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

const secondaryButton = css`
  ${buttonStyle}
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  &:hover {
    background-color: #e5e7eb;
  }
`;

export default function FinalComponentA(props) {
    const firebase = useFirebase();
    const [saving, setSaving] = createSignal(false);
    const [loading, setLoading] = createSignal(true);
    const [message, setMessage] = createSignal({ type: '', text: '' });
    const [jsonData, setJsonData] = createSignal(null);

    // Esempio di dati JSON
    const exampleData = {
        name: "Esempio",
        value: 42,
        timestamp: new Date().toISOString()
    };

    // Carica i dati esistenti al mount
    onMount(async () => {
        try {
            const path = `${props.userId}/${props.elementId}/data`;
            const data = await firebase.realtimeDb.loadData(path);

            if (data) {
                console.log("JSON esistente:", data);
                setJsonData(data);
            }
        } catch (error) {
            console.error("Errore caricamento JSON:", error);
        } finally {
            setLoading(false);
        }
    });

    const handleSaveData = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Salva nel Real Time Database
            const path = `${props.userId}/${props.elementId}/data`;
            await firebase.realtimeDb.saveData(path, exampleData);

            // Aggiorna lo stato locale
            setJsonData(exampleData);
            setMessage({ type: 'success', text: 'Dati salvati con successo!' });
        } catch (error) {
            setMessage({ type: 'error', text: `Errore: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div class={containerStyle}>
            <h2 class={headingStyle}>Final Component A</h2>

            <div class={infoStyle}>
                <p><strong>User ID:</strong> {props.userId}</p>
                <p><strong>Element ID:</strong> {props.elementId}</p>
            </div>

            {loading() ? (
                <div>Caricamento dati...</div>
            ) : jsonData() ? (
                <div style={{ margin: '1rem 0' }}>
                    <h3>Dati JSON esistenti:</h3>
                    <pre>{JSON.stringify(jsonData(), null, 2)}</pre>
                </div>
            ) : (
                <div>Nessun JSON presente</div>
            )}

            {message().text && (
                <div style={{ color: message().type === 'error' ? 'red' : 'green' }}>
                    {message().text}
                </div>
            )}

            <div>
                <button
                    class={primaryButton}
                    onClick={handleSaveData}
                    disabled={saving()}
                >
                    {saving() ? 'Salvataggio...' : 'Salva JSON di esempio'}
                </button>

                <button
                    class={secondaryButton}
                    onClick={props.onBack}
                    disabled={saving()}
                >
                    Indietro
                </button>
            </div>
        </div>
    );
}