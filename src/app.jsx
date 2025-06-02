import { createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';
import Register from './components/register';
import LoginForm from './components/login';
import Home from './components/home';
import Welcome from './components/welcome';
import ArSession from './components/arSession';


const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    HOME: 'home',
    WELCOME: 'welcome',
    AR_SESSION: 'arSession'
};

export default function App() {
    const firebase = useFirebase();
    const [currentView, setCurrentView] = createSignal(VIEWS.LOGIN);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [markerId, setMarkerId] = createSignal(null);


    onMount(() => {

        document.getElementById("loading").style.display = "none";


        const urlParams = new URLSearchParams(window.location.search);
        const hasQueryParams = urlParams.has('userId') && urlParams.has('elementId');

        if (hasQueryParams) {

            // Accesso anonimo
            setUserId(() => urlParams.get('userId'));
            setMarkerId(() => urlParams.get('elementId'));
            setCurrentView(VIEWS.WELCOME);
            setLoading(false);

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
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);

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
                    onEditMarker={(_markerId) => {
                        setUserId(() => firebase.auth.user().uid)
                        setMarkerId(() => _markerId)
                        goToArSession()
                    }}
                />;

            case VIEWS.WELCOME:
                return <Welcome
                    onStart={goToArSession}
                />;

            case VIEWS.AR_SESSION:
                return <ArSession
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