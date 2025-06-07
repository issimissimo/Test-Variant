import { HemisphereLight } from "three";

export const light = () => {
    const hemisphereLight = new HemisphereLight(0xffffff, 0xbbbbff, 1);
    return hemisphereLight;
}