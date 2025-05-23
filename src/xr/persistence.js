import * as THREE from "three";
import { LocalStorage } from "../utils/localStorage.js";
import { getOffsetMatrix, getGlobalMatrixFromOffsetMatrix } from "../utils/three/maths.js";
import { initializer } from "../utils/common/initializer.js";

let _initMatrix = new THREE.Matrix4();
let _initialized = false;
let _modelsMatrix = [];


const Persistence = {
    init(referenceMatrix) {
        _initMatrix.copy(referenceMatrix);
        _initialized = true;
        console.log(referenceMatrix);
        console.log("Persistence is initialized");

        // let pos = new THREE.Vector3();
        // let quat = new THREE.Quaternion();
        // let scale = new THREE.Vector3();
        // referenceMatrix.decompose(pos, quat, scale);
        // console.log("Reference position", pos);
        // console.log("Reference quaternion", quat);
    },

    load() {
        if (!_initialized) {
            console.error("Persistence not initialized");
            return null;
        };

        /// TEST CON UNA SOLA MATRICE
        const savedOffset = LocalStorage.load("modelsMatrix");
        const offsetMatrix = new THREE.Matrix4();
        offsetMatrix.fromArray(savedOffset); 
        const globalMatrix = getGlobalMatrixFromOffsetMatrix(_initMatrix, offsetMatrix);
        return globalMatrix;


        const _modelsMatrix = LocalStorage.load("modelsMatrix");
        console.log("--- LOADED OFFSET ----");
        console.log(_modelsMatrix);


        // const offsetMatrix = new THREE.Matrix4();
        // offsetMatrix.fromArray(_modelsMatrix);
        // console.log("-------MATRIX----------");
        // console.log(offsetMatrix);
        // return;

        let globalsMatrix = [];
        if (_modelsMatrix.length > 0) {

            _modelsMatrix.forEach((el) => {

                console.log("---------");
                console.log(el);
                console.log("---------");

                const offsetMatrix = new THREE.Matrix4();
                offsetMatrix.fromArray(el);

                console.log("----------------------------");
                console.log(offsetMatrix);
                console.log("----------------------------");

                const globalMatrix = getGlobalMatrixFromOffsetMatrix(_initMatrix, offsetMatrix);
                globalsMatrix.push(globalMatrix);

                
                let pos = new THREE.Vector3();
                let quat = new THREE.Quaternion();
                let scale = new THREE.Vector3();
                offsetMatrix.decompose(pos, quat, scale);
                console.log("Loaded Diff position", pos);
                console.log("Loaded Diff quaternion", quat);
            })

            return globalsMatrix;
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


        // LocalStorage.save("modelsMatrix", _modelsMatrix);
        LocalStorage.save("modelsMatrix", offset.elements); /// TEST CON UNA SOLA MATRICE






        // console.log("---- SAVED OFFSET ----");
        // console.log(offset);

        // let pos = new THREE.Vector3();
        // let quat = new THREE.Quaternion();
        // let scale = new THREE.Vector3();
        // offset.decompose(pos, quat, scale);
        // console.log("Diff position", pos);
        // console.log("Diff quaternion", quat);
    },

    isInitialized() {
        return _initialized;
    }

}
export default Persistence;