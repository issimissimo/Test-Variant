import { createEffect, createSignal, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useFirebase } from '@hooks/useFirebase';
import { config } from '@/config';
import { styled } from 'solid-styled-components';

// Components
import Register from '@components/register';
import Login from '@components/login';
import MarkerList from '@components/markerList';
import EditMarker from '@components/editMarker';
import Anonymous from '@components/anonymous';
import ArSession from '@components/arSession';
import ArNotSupported from '@components/arNotSupported';

// XR
import SceneManager from '@xr/sceneManager';
import Reticle from '@xr/reticle';


/*
* This function is called by the "Enter AR" button
* only when we have debugOnDesktop=true in the configuration file
* - public/config.json -
*/
let globalGoToArSession;
export const TestGameOnDesktopFallback = () => {
    console.warn("We are DEBUGGING on desktop and AR session is NOT initialized! Just use for debug on desktop purpose! Please check 'appConfig.json' file in PUBLIC folder to modify the settings!")
    globalGoToArSession();
}


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
    const [currentAppMode, setCurrentAppMode] = createSignal(null);
    const [currentView, setCurrentView] = createSignal(null);
    const [loading, setLoading] = createSignal(true);
    const [userId, setUserId] = createSignal(null);
    const [currentMarker, setCurrentMarker] = createSignal(null);
    const [planeFound, setPlaneFound] = createSignal(false);
    const [gamesRunning, setGamesRunning] = createSignal([]);



    //#region [lifeCycle]
    onMount(() => {

        // We need to copy the function outside
        // so to be able to use it for debug on desktop purpose
        globalGoToArSession = goToArSession;

        // Auth
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
                        setCurrentAppMode(() => AppMode.LOAD);
                        accessAnonymous(urlParams);

                    } else {

                        // Login or register
                        setCurrentAppMode(() => AppMode.SAVE);
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


    createEffect(() => {
        // Hide the preloader
        if (!loading()) document.getElementById("loading").style.display = "none";
    })



    //#region [functions]
    /**
    * Anonymous access
    */
    const accessAnonymous = async (params) => {
        if (!firebase.auth.user()) {
            await firebase.auth.loginAnonymous();
        }
        setUserId(() => params.get('userId'));
        const markerId = params.get('markerId');
        setupMarker(markerId, null, null, () => goToAnonymous());
    }


    /**
    * Check auth status
    */
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




    /**
    * Add a new marker to the App 
    * and set it as currentMarker
    */
    const setupMarker = async (markerId = null, markerName = null, markerGames = null, callback = null) => {

        // If no Games are provided, load the all the Games basic properties
        // from firestore for this marker
        if (markerId && !markerGames) {
            console.log("carico games da Firestore...")
            markerGames = await firebase.firestore.fetchGames(userId(), markerId);
        }

        // Setup this marker
        const marker = {
            id: markerId,
            name: markerName,
            games: markerGames
        }
        
        setCurrentMarker(() => marker);
        console.log("current marker:", currentMarker())

        if (loading()) setLoading(() => false);
        if (callback) callback();
    }



    /**
     * Navigation
     */
    const goToRegister = () => setCurrentView(VIEWS.REGISTER);
    const goToLogin = () => {
        setLoading(() => false);
        setCurrentView(VIEWS.LOGIN);
    }
    const goToMarkerList = () => {
        setLoading(() => false); // TODO - better handle the initial spinner of the app, and the loading spinner of the markers from firebase
        setUserId(() => firebase.auth.user().uid);
        setCurrentView(VIEWS.MARKER_LIST);
    }
    const goToEditMarker = () => setCurrentView(VIEWS.EDIT_MARKER);
    const goToAnonymous = () => setCurrentView(VIEWS.ANONYMOUS);
    const goToArSession = () => setCurrentView(VIEWS.AR_SESSION);
    const goToArNotSupported = () => setCurrentView(VIEWS.AR_NOT_SUPPORTED);




    /**
    * Handles the rendering loop for the AR scene.
    * If an XR frame is available, updates the Reticle based on the current frame and surface type.
    * Always updates the SceneManager for each animation frame.
    * 
    * N.B: We NEED to put the render function in the SAME module
    * in which we initialize the scene (unfortunately)!
    */
    function render(timestamp, frame) {
        if (SceneManager.initialized()) {

            // Update Reticle
            if (frame && Reticle.initialized()) {
                Reticle.update(frame, (surfType) => {
                });
                setPlaneFound(Reticle.isHitting())
            }

            // render the animation of the running Games
            if (gamesRunning().length > 0) {
                gamesRunning().forEach((el) => el.renderLoop());
            }

            // Update Scene
            SceneManager.update();
        }
    };


    //#region [handlers]
    /**
     * Initialize Three Scene, with AR Button
     * and go to ARSession
     */
    const handleInitScene = () => {
        SceneManager.init();
        SceneManager.renderer.setAnimationLoop(render);
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
        setGamesRunning(() => []);
        if (currentAppMode() === AppMode.SAVE) goToMarkerList();
        else if (currentAppMode() === AppMode.LOAD) goToAnonymous();
        else console.error("AppMode not defined!")
    }




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
                        setupMarker(marker.id, marker.name, null, () => goToEditMarker())
                    }}
                />;

            case VIEWS.EDIT_MARKER:
                return <EditMarker
                    userId={userId()}
                    marker={currentMarker()}
                    onNewMarkerCreated={(id, name) => setupMarker(id, name)}
                    onMarkerUpdated={(name, games) => setupMarker(currentMarker().id, name, games)}
                    initScene={handleInitScene}
                    onBack={handleReset}
                />;

            case VIEWS.ANONYMOUS:
                return <Anonymous
                    userId={userId()}
                    marker={currentMarker()}
                    markerId={currentMarker().id}
                    loading={loading()}
                    initScene={handleInitScene}
                />;

            case VIEWS.AR_SESSION:
                return (
                    <Portal mount={document.getElementById('overlay')}>
                        <ArSession
                            appMode={currentAppMode()}
                            userId={userId()}
                            marker={currentMarker()}
                            onBack={handleReset}
                            planeFound={planeFound()}
                            games={gamesRunning()}
                            addGame={(el) => setGamesRunning(prev => [...prev, el])}
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