import {
    Scene,
    PerspectiveCamera,
    HemisphereLight,
    WebGLRenderer,
    Matrix4,
    
} from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export const useThree = () => {

    const scene = Scene;
    const camera = PerspectiveCamera;
    const ambientLight = HemisphereLight;
    const renderer = WebGLRenderer;
    const matrix = Matrix4;

    return {
        scene,
        camera,
        ambientLight,
        renderer,
        matrix
    }
}