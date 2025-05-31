import { createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';

export default function Login(props) {
  const { auth } = useFirebase();
  const [form, setForm] = createSignal({
    email: '',
    password: ''
  });

  const [message, setMessage] = createSignal({ type: '', text: '' });
  const [loading, setLoading] = createSignal(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      // Login (ora aggiorna automaticamente lastLogin)
      await auth.login(form());

      // Notifica l'App di navigare verso la home
      if (props.onSuccess) props.onSuccess();
    } catch (error) {
      let errorMessage = error.message;

      if (errorMessage.includes('user-not-found')) {
        errorMessage = 'Utente non trovato';
      } else if (errorMessage.includes('wrong-password')) {
        errorMessage = 'Password errata';
      } else if (errorMessage.includes('too-many-requests')) {
        errorMessage = 'Troppi tentativi falliti. Riprova più tardi';
      }

      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Accedi</h2>

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
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading()}
        >
          {loading() ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      <div>
        <p>
          Non hai un account?{' '}
          <button
            type="button"
            onClick={props.onGoToRegister}
          >
            Registrati
          </button>
        </p>
      </div>
    </div>
  );
}