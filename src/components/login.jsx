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
        <div class={`mb-4 p-3 rounded ${message().type === 'error'
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700'
          }`}>
          {message().text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form().email}
            onInput={handleInput}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div class="mb-6">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form().password}
            onInput={handleInput}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading()}
          class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading() ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm">
          Non hai un account?{' '}
          <button
            type="button"
            class="text-blue-500 hover:underline focus:outline-none"
            onClick={props.onGoToRegister}
          >
            Registrati
          </button>
        </p>
      </div>
    </div>
  );
}