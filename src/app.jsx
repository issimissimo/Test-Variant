import { createEffect, createSignal, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useFirebase } from './hooks/useFirebase';
import { config } from './config';
import { styled } from 'solid-styled-components';

// UI
import Register from './components/register';
import Login from './components/login';
import MarkerList from './components/markerList';
import EditMarker from './components/editMarker';
import Anonymous from './components/anonymous';
import ArSession from './components/arSession';
import ArNotSupported from './components/arNotSupported';

// XR
import SceneManager from './xr/sceneManager';






export const AppMode = {
    SAVE: "save",
    LOAD: "load",
}

const VIEWS = {
    REGISTER: 'register',
    LOGIN: 'login',
    MARKER_LIST: 'markerList',
    EDIT_MARKER: "editMarker",
    ANONYMOUS: "anonymous",
    AR_SESSION: 'arSession',
    AR_NOT_SUPPORTED: 'arNotSupported',
};


export default function App() {

    //#region [constants]
    const firebase = useFirebase();
    const [currentMode, setCurrentMode] = createSignal(null);
    const [currentView, setCurrentView] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [currentMarker, setCurrentMarker] = createSignal(null);
    const [jsonData, setJsonData] = createSignal(null);





    //#region [lifeCycle]
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



    //#region [functions]


    //
    // Anonymous access
    //
    const accessAnonymous = async (params) => {
        if (!firebase.auth.user()) {
            await firebase.auth.loginAnonymous();
        }
        setUserId(() => params.get('userId'));
        const markerId = params.get('markerId');
        setupMarker(markerId);
        goToAnonymous();
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
                goToMarkerList();
            }
        }
        else {
            goToLogin();
        }
    };




    //
    // Add a new marker on the fly to the App 
    // and set it as currentMarker
    //
    const setupMarker = (markerId = null, markerName = null, withData = false) => {
        const marker = {
            id: markerId ? markerId : null,
            name: markerName ? markerName : null,
            withData: withData
        }
        setCurrentMarker(() => marker);
        console.log("current marker:", currentMarker())
    }



    // /**
    // * Save a new marker, only in firebase
    // * and with the property withData = false 
    // * (JSON should be created later on)
    //  */
    // const saveMarkerInFirebase = async (name) => {
    //     try {
    //         const newMarkerId = await firebase.firestore.addMarker(firebase.auth.user().uid, name);
    //         props.onSaveMarker(newMarkerId, name);
    //         console.log('Creato in Firestore il marker con ID:', newMarkerId)
    //     } catch (error) {
    //         console.error('Errore aggiunta marker:', error);
    //         throw error;
    //     }
    // };



    //#region [handlers]


    // /**
    // * Delete a marker,
    // * both from firebase and its JSON from RealTime DB,
    // * and go back to Home
    //  */
    // const handleDeleteMarker = async () => {
    //     try {
    //         await firebase.firestore.deleteMarker(props.userId, props.marker.id);
    //         const path = `${props.userId}/${props.marker.id}`;
    //         await firebase.realtimeDb.deleteData(path);
    //         handleBackToHome();
    //     } catch (error) {
    //         console.error("Errore completo cancellazione marker:", error);
    //     }
    // };



    // /**
    //  * Load JSON from Firebase Realtime DB
    //  * and set jsonData()
    //  */
    // const handleLoadMarkerData = async () => {
    //     try {
    //         const path = `${props.userId}/${props.marker.id}/data`;
    //         const data = await firebase.realtimeDb.loadData(path);
    //         setJsonData(() => data);
    //     } catch (error) {
    //         console.error("Errore nel caricamento JSON:", error);
    //     }
    // }



    // /**
    //  * Save jsonData() to Firebase Realtime DB
    //  * and, if necessary, update Firestore marker data:
    //  * withData = true
    //  */
    // const handleSaveMarkerData = async (data) => {
    //     try {
    //         const path = `${props.userId}/${props.marker.id}/data`;
    //         await firebase.realtimeDb.saveData(path, data);
    //         setJsonData(() => data);

    //         if (!props.marker.withData) {
    //             firebase.firestore.updateMarker(props.userId, props.marker.id,
    //                 props.marker.name, true);
    //         }
    //     } catch (error) {
    //         console.log({ type: 'error', text: `Errore: ${error.message}` });
    //     }
    // }


    /**
     * Initialize Three Scene, with AR Button
     * and go to ARSession
     */
    const handleInitScene = () => {
        SceneManager.init();
        SceneManager.renderer.xr.addEventListener("sessionstart", () => {
            goToArSession();
        });
    }


    /**
     * Clear all and
     * go back to 1st screen
     */
    const handleReset = () => {
        setupMarker();
        SceneManager.destroy();
        if (currentMode() === AppMode.SAVE) goToMarkerList();
        else if (currentMode() === AppMode.LOAD) goToAnonymous();
        else console.error("AppMode not defined!")
    }


    //
    // Navigation
    //
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => {
        setLoading(() => false);
        setCurrentView(VIEWS.LOGIN);
    }
    const goToMarkerList = () => {
        setUserId(() => firebase.auth.user().uid);
        setCurrentView(VIEWS.MARKER_LIST);
    }
    const goToEditMarker = () => setCurrentView(VIEWS.EDIT_MARKER);
    const goToAnonymous = () => setCurrentView(VIEWS.ANONYMOUS);
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);
    const goToArNotSupported = () => setCurrentView(VIEWS.AR_NOT_SUPPORTED);




    //#region [style]

    const Container = styled('div')`
        width: 100%;
        height: 100%;
    `




    //#region [return]

    const renderView = () => {

        switch (currentView()) {
            case VIEWS.REGISTER:
                return <Register
                    onSuccess={goToMarkerList}
                    onGoToLogin={goToLogin}
                />;

            case VIEWS.LOGIN:
                return <Login
                    onSuccess={goToMarkerList}
                    onGoToRegister={goToRegister}
                />;

            case VIEWS.MARKER_LIST:
                return <MarkerList
                    setLoading={(value) => setLoading(() => value)}
                    onLogout={goToLogin}
                    onCreateNewMarker={() => {
                        setupMarker();
                        goToEditMarker();
                    }}
                    onMarkerClicked={(marker) => {
                        // setUserId(() => firebase.auth.user().uid);
                        setupMarker(marker.id, marker.name, marker.withData)
                        goToEditMarker();
                    }}
                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    userId={userId()}
                    marker={currentMarker()}
                    onNewMarkerCreated={(id, name) => setupMarker(id, name)}
                    initScene={handleInitScene}
                    onBack={handleReset}
                />;

            case VIEWS.ANONYMOUS:
                return <Anonymous
                    userId={userId()}
                    markerId={currentMarker().id}
                    loading={loading()}
                    onCheckFinished={(marker) => {
                        setLoading(() => false);
                        if (marker !== undefined && marker.withData) {
                            setupMarker(currentMarker().id, marker.name, marker.withData);
                            handleInitScene();
                        }
                    }}
                />;

            case VIEWS.AR_SESSION:
                return (
                    <Portal mount={document.getElementById('overlay')}>
                        <ArSession
                            loading={(value) => setLoading(() => value)}
                            currentMode={currentMode()}
                            userId={userId()}
                            marker={currentMarker()}
                            // backToHome={() => goToMarkerList()}
                            onBack={handleReset}
                            onSaveMarker={(id, name) => setupMarker(id, name)}
                        />
                    </Portal>
                );

            case VIEWS.AR_NOT_SUPPORTED:
                return <ArNotSupported />;

            default:
                return <div />;

        }
    };



    return (
        <Container>
            {renderView()}
        </Container>
    );
}