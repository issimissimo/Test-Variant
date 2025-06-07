import { PerspectiveCamera } from "three"

export const camera = () => {
    const perspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    return perspectiveCamera;
}