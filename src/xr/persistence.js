import * as THREE from "three";
import { LocalStorage } from "../utils/localStorage.js";
import { getOffsetMatrix } from "../utils/three/maths.js";

let _initMatrix = new THREE.Matrix4();
let _initialized = false;
let _modelsMatrix = [];

// function _offsetMatrix(matrix) {
//     const m = matrix.clone().invert().multiply(_initMatrix);
//     return m;
// }



const Persistence = {

    setReference(referenceMatrix) {
        _initMatrix.copy(referenceMatrix);
        _initialized = true;
        console.log("Reference is set");
        console.log(_initMatrix);
        console.log("------------------------------------------------");
        const serialized = JSON.stringify(_initMatrix);
        console.log(serialized);
        
    },

    load() {
        if (!_initialized) {
            console.error("Reference not set");
            return null;
        }
    },

    /**
     * Save the given object state.
     * @param {Object} obj - The object to save.
     */
    save(matrix) {
        if (!_initialized) {
            console.error("Reference not set");
            return null;
        }

        // const newOffset = _offsetMatrix(matrix);
        const newOffset = getOffsetMatrix(_initMatrix, matrix);
        _modelsMatrix.push(newOffset);


        console.log("-------------------");
        console.log(matrix);
        console.log("---");
        console.log(newOffset);
        console.log("---");
        console.log(_modelsMatrix);
        console.log("-------------------");
        // LocalStorage.save("referenceMatrix", _initMatrix);

    },

    isInitialized() {
        return _initialized;
    }

}
export default Persistence;