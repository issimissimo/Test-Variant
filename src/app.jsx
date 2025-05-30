import { createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';
import Register from './components/register';
import LoginForm from './components/login';
import Home from './components/home';
import { collapseStyles } from '@hope-ui/solid';

// Definiamo le viste disponibili
const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    HOME: 'home'
};

export default function App() {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(VIEWS.REGISTER);
    const [loading, setLoading] = createSignal(true);

    // Controlla se l'utente è già autenticato all'avvio
    onMount(() => {
        const unsubscribe = firebase.auth.authLoading();
        if (!firebase.auth.authLoading()) {
            checkAuthStatus();
        } else {
            const timer = setInterval(() => {
                if (!firebase.auth.authLoading()) {
                    clearInterval(timer);
                    checkAuthStatus();
                }
            }, 100);
        }
    });

    const checkAuthStatus = () => {
        if (firebase.auth.user()) {
            setCurrentView(VIEWS.HOME);
        }
        else {
            console.log("NOOOOO")
        }
        setLoading(false);
    };

    // Gestori di navigazione
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => setCurrentView(VIEWS.LOGIN);
    const goToHome = () => setCurrentView(VIEWS.HOME);

    // Renderizza la vista corrente
    const renderView = () => {
        if (loading()) {
            return <div>Caricamento...</div>;
        }

        switch (currentView()) {
            case VIEWS.REGISTER:
                return <Register
                    onSuccess={goToHome}
                    onGoToLogin={goToLogin}
                />;

            case VIEWS.LOGIN:
                return <LoginForm
                    onSuccess={goToHome}
                    onGoToRegister={goToRegister}
                />;

            case VIEWS.HOME:
                return <Home
                    onLogout={goToLogin}
                    onGoToRegister={goToRegister}
                    onGoToLogin={goToLogin}
                />;

            default:
                return <Login onSuccess={goToHome} onGoToRegister={goToRegister} />;
        }
    };

    return (
        <div>



            {renderView()}
           



        </div>
    );
}