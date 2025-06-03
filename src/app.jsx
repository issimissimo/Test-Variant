import { createEffect, createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';


import Register from './components/register';
import LoginForm from './components/login';
import Home from './components/home';
import ArSession from './components/arSession';
import ArNotSupported from './components/arNotSupported';

export const AppMode = {
    SAVE: "save",
    LOAD: "load",
}

const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    HOME: 'home',
    AR_SESSION: 'arSession',
    AR_NOT_SUPPORTED: 'arNotSupported',
};

export default function App() {
    const firebase = useFirebase();
    const [currentMode, setCurrentMode] = createSignal(null);
    const [currentView, setCurrentView] = createSignal(VIEWS.LOGIN);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [currentMarker, setCurrentMarker] = createSignal(null);


    createEffect(() => {
        // Hide preloader
        if (!loading()) document.getElementById("loading").style.display = "none";


    })


    onMount(() => {
        const checkSupported = false; //# use this flag for debug on desktop

        if ("xr" in navigator) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

                if (!supported && checkSupported) {
                    goToArNotSupported();
                    setLoading(false);
                }
                else {
                    // Search for query string
                    const urlParams = new URLSearchParams(window.location.search);
                    const hasQueryParams = urlParams.has('userId') && urlParams.has('markerId');

                    // Access as anonymous
                    if (hasQueryParams) {
                        setCurrentMode(() => AppMode.LOAD);
                        accessAnonymous(urlParams);
                        setLoading(false);

                    // Login or register
                    } else {
                        setCurrentMode(() => AppMode.SAVE);
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
            setLoading(false);
        }
    });


    //
    // Anonimous access
    //
    const accessAnonymous = async (params) => {



        setUserId(() => params.get('userId'));
        // setMarkerId(() => params.get('elementId'));

        

        addMarker(params.get('markerId'));

        // const marker = {
        //     id: params.get('elementId'),
        //     name: 'undefined'
        // }
        // setCurrentMarker(() => marker);



        // goToArSession();

    }

    const checkAuthStatus = () => {
        if (firebase.auth.user()) {
            goToHome();
        }
        setLoading(false);
    };



    const addMarker = (markerId) => {
        

        const marker = {
            id: markerId ? markerId : null,
            name: null
        }

        setCurrentMarker(() => marker);

        
        goToArSession();
    }


    //
    // Gestori di navigazione
    //
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => setCurrentView(VIEWS.LOGIN);
    const goToHome = () => setCurrentView(VIEWS.HOME);
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);
    const goToArNotSupported = () => setCurrentView(VIEWS.AR_NOT_SUPPORTED);

    //
    // Renderizza la vista corrente
    //
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
                    onCreateMarker={() => addMarker()}
                    onMarkerClicked={(marker) => {
                        setUserId(() => firebase.auth.user().uid);
                        setCurrentMarker(() => marker);
                        // setCurrentMode(() => AppMode.SAVE);
                        goToArSession();
                    }}
                />;

            case VIEWS.AR_SESSION:
                return <ArSession
                    currentMode={currentMode()}
                    userId={userId()}
                    marker={currentMarker()}
                    backToHome={() => goToHome()}
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