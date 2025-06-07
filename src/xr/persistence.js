import * as THREE from "three";
import { LocalStorage } from "../utils/localStorage.js";
import { getOffsetMatrix, getGlobalMatrixFromOffsetMatrix } from "../utils/three/maths.js";


let _initMatrix = new THREE.Matrix4();
let _initialized = false;
let _modelsMatrix = [];


const Persistence = {
    init(referenceMatrix) {
        _initMatrix.copy(referenceMatrix);
        _initialized = true;
    },

    load() {
        if (!_initialized) {
            console.error("Persistence not initialized");
            return null;
        };

        const _modelsMatrix = LocalStorage.load("modelsMatrix");
        let allMatrix = [];
        if (_modelsMatrix.length > 0) {

            _modelsMatrix.forEach((el) => {
                const offsetMatrix = new THREE.Matrix4();
                offsetMatrix.fromArray(el);
                const matrix = getGlobalMatrixFromOffsetMatrix(_initMatrix, offsetMatrix);
                allMatrix.push(matrix);
            })
            return allMatrix;
        }
        else {
            console.error("No models matrix found");
            return null;
        }
    },

    /**
     * Save the given object state.
     * @param {Object} obj - The object to save.
     */
    save(matrix) {
        if (!_initialized) {
            console.error("Persistence not initialized");
            return;
        };
        const offset = getOffsetMatrix(_initMatrix, matrix);
        _modelsMatrix.push(offset.elements);
        LocalStorage.save("modelsMatrix", _modelsMatrix);
    },

    isInitialized() {
        return _initialized;
    }

}
export default Persistence;