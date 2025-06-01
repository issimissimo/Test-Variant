import { createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';
import Register from './components/register';
import LoginForm from './components/login';
import Home from './components/home';
import Welcome from './components/welcome';
import Game from './components/game';


const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    HOME: 'home',
    WELCOME: 'welcome',
    GAME: 'game'
};

export default function App() {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(VIEWS.LOGIN);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [markerId, setMarkerId] = createSignal(null);


    const startAnonymous = () => {
        // Accesso anonimo
        setUserId(() => urlParams.get('userId'));
        setMarkerId(() => urlParams.get('elementId'));
        setCurrentView(VIEWS.WELCOME);
        setLoading(false);
    }


    onMount(() => {

        document.getElementById("loading").style.display = "none";


        const urlParams = new URLSearchParams(window.location.search);
        const hasQueryParams = urlParams.has('userId') && urlParams.has('elementId');

        if (hasQueryParams) {

            // // Accesso anonimo
            // setUserId(() => urlParams.get('userId'));
            // setMarkerId(() => urlParams.get('elementId'));
            // setCurrentView(VIEWS.WELCOME);
            // setLoading(false);
            startAnonymous();

        } else {

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
        }
    });

    const checkAuthStatus = () => {
        if (firebase.auth.user()) {
            setCurrentView(VIEWS.HOME);
        }
        setLoading(false);
    };

    // Gestori di navigazione
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => setCurrentView(VIEWS.LOGIN);
    const goToHome = () => setCurrentView(VIEWS.HOME);
    const goToGame = () => setCurrentView(VIEWS.GAME);

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
                    onStart={goToGame}
                />;

            case VIEWS.WELCOME:
                return <Welcome
                    onStart={goToGame}
                />;

            case VIEWS.GAME:
                return <Game
                    userId={userId()}
                    markerId={markerId()}
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