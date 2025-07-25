import { createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';

export default function Register(props) {
  const { auth } = useFirebase();

  // Stato del form
  const [form, setForm] = createSignal({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Stato per messaggi di errore/successo
  const [message, setMessage] = createSignal({ type: '', text: '' });
  const [loading, setLoading] = createSignal(false);

  // Gestione input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Gestione submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validazione
    if (form().password !== form().confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non corrispondono' });
      return;
    }

    if (form().password.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      return;
    }

    setLoading(true);

    try {
      // CORREZIONE: usa form() invece di credentials
      await auth.register(form());  // <--- Questa è la linea corretta

      setMessage({
        type: 'success',
        text: 'Registrazione completata!'
      });

      setTimeout(() => {
        if (props.onSuccess) props.onSuccess();
      }, 2000);
    } catch (error) {
      let errorMessage = error.message;

      if (errorMessage.includes('email-already-in-use')) {
        errorMessage = 'Questo indirizzo email è già registrato';
      } else if (errorMessage.includes('invalid-email')) {
        errorMessage = 'Indirizzo email non valido';
      }

      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crea un account</h2>

      {/* Messaggi di stato */}
      {message().text && (
        <div>
          {message().text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form().email}
            onInput={handleInput}
            autocomplete="username"
            required
          />
        </div>

        <div>
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form().password}
            onInput={handleInput}
            autocomplete="new-password"
            required
          />
          <p>Minimo 6 caratteri</p>
        </div>

        <div>
          <label for="confirmPassword">Conferma Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form().confirmPassword}
            onInput={handleInput}
            autocomplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading()}
        >
          {loading() ? 'Registrazione in corso...' : 'Registrati'}
        </button>
      </form>

      <div>
        <p>
          Hai già un account?{' '}
          <button
            type="button"
            onClick={props.onGoToLogin}
          >
            Accedi
          </button>
        </p>
      </div>
    </div>
  );
}