import {
    Scene,
    PerspectiveCamera,
    HemisphereLight,
    WebGLRenderer,
    Matrix4
} from "three";

export const useThree = (options = {}) => {
    // Configurazione con valori di default
    const config = {
        container: document.body,
        background: 0x000000,
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
        lightColor: 0xffffff,
        groundColor: 0xbbbbff,
        intensity: 1,
        alpha: true,
        antialias: true,
    };

    // Inizializzazione degli elementi Three.js
    const scene = new Scene();
    scene.background = new Color(config.background);

    const camera = new PerspectiveCamera(
        config.fov,
        window.innerWidth / window.innerHeight,
        config.near,
        config.far
    );
    camera.position.set(...config.position);

    const hemisphereLight = new HemisphereLight(
        config.lightColor,
        config.groundColor,
        config.intensity
    );
    scene.add(hemisphereLight);

    const renderer = new WebGLRenderer({
        alpha: config.alpha,
        antialias: config.antialias
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    config.container.appendChild(renderer.domElement);

    // Funzione per gestire il resize
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Funzione di cleanup
    const cleanup = () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        config.container.removeChild(renderer.domElement);
    };

    return {
        scene,
        camera,
        hemisphereLight,
        renderer,
        matrix: new Matrix4(),
        cleanup
    };
};