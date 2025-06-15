import { createEffect, createSignal, onMount } from 'solid-js';
import { useFirebase } from './hooks/useFirebase';
import { config } from './config';

// UI
import Register from './components/register';
import Login from './components/login';
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
    const [currentView, setCurrentView] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [currentMarker, setCurrentMarker] = createSignal(null);


    createEffect(() => {
        // Hide preloader
        if (!loading()) document.getElementById("loading").style.display = "none";
    })


    onMount(() => {
        if ("xr" in navigator) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {

                if (!supported && !config.debugOnDesktop) {
                    goToArNotSupported();
                    setLoading(false);
                }
                else {
                    // Search for URL query string
                    const urlParams = new URLSearchParams(window.location.search);
                    const hasQueryParams = urlParams.has('userId') && urlParams.has('markerId');

                    // Access as anonymous
                    if (hasQueryParams) {
                        setCurrentMode(() => AppMode.LOAD);
                        accessAnonymous(urlParams);

                    } else {

                        // Login or register
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
    // Anonymous access
    //
    const accessAnonymous = async (params) => {
        if (!firebase.auth.user()) {
            await firebase.auth.loginAnonymous();
        }
        console.log('---> logged as anonymous')
        setUserId(() => params.get('userId'));
        const markerId = params.get('markerId');
        const markerName = null;
        const withData = true;
        addMarker(markerId, markerName, withData);
        goToArSession();
    }


    //
    // Check auth status
    //
    const checkAuthStatus = async () => {
        if (firebase.auth.user()) {
            if (firebase.auth.user().isAnonymous) {
                console.log("You previously logged as anonymous, so you need to login again")
                goToLogin();
            }
            else {
                if (!config.isDebug) {
                    const userId = firebase.auth.user().uid;
                    await firebase.auth.updateLoginTimestamp(userId)
                }
                goToHome();
            }
        }
        else {
            goToLogin();
        }
    };


    //
    // Add a new marker on the fly to the App 
    // and set it as currentMarker
    // Just used for App purpose, NOT for database
    //
    const addMarker = (markerId = null, markerName = null, withData = false) => {
        const marker = {
            id: markerId ? markerId : null,
            name: markerName ? markerName : null,
            withData: withData
        }
        setCurrentMarker(() => marker);
    }


    //
    // Navigation
    //
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => {
        setLoading(() => false);
        setCurrentView(VIEWS.LOGIN);
    }
    const goToHome = () => setCurrentView(VIEWS.HOME);
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);
    const goToArNotSupported = () => setCurrentView(VIEWS.AR_NOT_SUPPORTED);


    //
    // Renderizza la vista corrente
    //
    const renderView = () => {

        switch (currentView()) {
            case VIEWS.REGISTER:
                return <Register
                    onSuccess={goToHome}
                    onGoToLogin={goToLogin}
                />;

            case VIEWS.LOGIN:
                return <Login
                    onSuccess={goToHome}
                    onGoToRegister={goToRegister}
                />;

            case VIEWS.HOME:
                return <Home
                    setLoading={(value) => setLoading(() => value)}
                    onLogout={goToLogin}
                    onGoToRegister={goToRegister}
                    onGoToLogin={goToLogin}
                    onCreateMarker={() => {
                        setUserId(() => firebase.auth.user().uid);
                        addMarker();
                        goToArSession();
                    }}
                    onMarkerClicked={(marker) => {
                        setUserId(() => firebase.auth.user().uid);
                        setCurrentMarker(() => marker);
                        goToArSession();
                    }}
                />;

            case VIEWS.AR_SESSION:
                return <ArSession
                    loading={(value) => setLoading(() => value)}
                    currentMode={currentMode()}
                    userId={userId()}
                    marker={currentMarker()}
                    backToHome={() => goToHome()}
                    onSaveMarker={(id, name) => addMarker(id, name)}
                />;

            case VIEWS.AR_NOT_SUPPORTED:
                return <ArNotSupported />;

            default:
                return <div />;

        }
    };

    return (
        <div>
            {renderView()}
        </div>
    );
}