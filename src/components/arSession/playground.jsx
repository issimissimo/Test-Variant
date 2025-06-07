import { createSignal, createEffect, onMount } from 'solid-js';
import * as THREE from 'three';
import AssetManager from '../../xr/assetManager';
import { useFirebase } from '../../hooks/useFirebase';

export default function Playground(props) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    camera.position.z = 5;

    function animate() {
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    /// END OF BOILERPLATE
    ///
    ///
    ///

    let asset;
    const referenceMatrix = new THREE.Matrix4().setPosition(0, 0, 0);
    AssetManager.init(scene, referenceMatrix);
    asset = AssetManager.addAsset('Fiori', 'flowers.glb');
    asset.setPosition(0.5, 1, 2)
    asset.setRotation(1, 1, 1)
    asset = AssetManager.addAsset('Griglia', 'gridPlane.glb');
    asset.setPosition(0, 1, 3);
    asset.setRotation(1, 0.5, 1)
    asset = AssetManager.addAsset('Gizmo', 'temp.glb');
    asset.setRotation(0.5, -0.5, 1)

    const jsonData = AssetManager.exportToJSON();

    AssetManager.importFromJSON(jsonData)
    AssetManager.loadAllAssets()



    // Esempio di dati JSON
    const exampleData = {
        name: "Esempio",
        value: 42,
        timestamp: new Date().toISOString()
    };




    return (
        <div>
            PLAYGROUND MODE
            <div>
                <button onClick={() => {
                    props.setJsonData(jsonData);
                    
                    props.save()
                }} >SAVE DB</button>
            </div>
        </div>
    )
}