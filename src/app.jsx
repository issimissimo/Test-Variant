import { createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';


import Register from './components/register';
import LoginForm from './components/login';
import Home from './components/home';
import Welcome from './components/welcome';
import ArSession from './components/arSession';
import ArNotSupported from './components/arNotSupported';

export const AppMode = {
    SAVE: "save",
    LOAD: "load"
}

const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    HOME: 'home',
    WELCOME: 'welcome',
    AR_SESSION: 'arSession',
    AR_NOT_SUPPORTED: 'arNotSupported',
};

export default function App() {
    const firebase = useFirebase();
    const [currentMode, setCurrentMode] = createSignal(AppMode.LOAD);
    const [currentView, setCurrentView] = createSignal(VIEWS.LOGIN);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [markerId, setMarkerId] = createSignal(null);
    const [jsonData, setJsonData] = createSignal(null);


    onMount(() => {

        // Hide preloader
        document.getElementById("loading").style.display = "none";

        const checkSupported = false; //# use this flag for debug on desktop
        if ("xr" in navigator) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

                if (!supported && checkSupported) {
                    setLoading(false);
                    goToArNotSupported();
                }
                else {
                    // Search for query string
                    const urlParams = new URLSearchParams(window.location.search);
                    const hasQueryParams = urlParams.has('userId') && urlParams.has('elementId');

                    if (hasQueryParams) {
                        accessAnonymous(urlParams);

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
                }
            });
        }
        else {
            goToArNotSupported();
        }

        // // Search for query string
        // const urlParams = new URLSearchParams(window.location.search);
        // const hasQueryParams = urlParams.has('userId') && urlParams.has('elementId');

        // if (hasQueryParams) {
        //     accessAnonymous(urlParams);

        // } else {
        //     if (!firebase.auth.authLoading()) {
        //         checkAuthStatus();
        //     } else {
        //         const timer = setInterval(() => {
        //             if (!firebase.auth.authLoading()) {
        //                 clearInterval(timer);
        //                 checkAuthStatus();
        //             }
        //         }, 100);
        //     }
        // }
    });


    //
    // Anonimous access
    //
    const accessAnonymous = async (params) => {
        setUserId(() => params.get('userId'));
        setMarkerId(() => params.get('elementId'));

        // Load JSON
        try {
            const path = `${userId()}/${markerId()}/data`;
            const data = await firebase.realtimeDb.loadData(path);

            if (data) {
                console.log("JSON esistente:", data);
                setJsonData(() => data);
            }
        } catch (error) {
            console.error("Errore caricamento JSON:", error);
        }

        // Go to Welcome screen
        setLoading(false);
        goToWelcome();
    }

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
    const goToWelcome = () => setCurrentView(VIEWS.WELCOME);
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);
    const goToArNotSupported = () => setCurrentView(VIEWS.AR_NOT_SUPPORTED);

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
                    onEditMarker={(_markerId, _jsonData = null) => {
                        setUserId(() => firebase.auth.user().uid);
                        setMarkerId(() => _markerId);
                        setJsonData(() => _jsonData);
                        setCurrentMode(() => AppMode.SAVE);
                        goToArSession();
                    }}
                />;

            case VIEWS.WELCOME:
                return <Welcome
                    onStart={goToArSession}
                />;

            case VIEWS.AR_SESSION:
                return <ArSession
                    currentMode={currentMode()}
                    jsonData={jsonData()}
                    setJsonData={(json) => setJsonData(() => json)}
                />;

            case VIEWS.AR_NOT_SUPPORTED:
                return <ArNotSupported

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