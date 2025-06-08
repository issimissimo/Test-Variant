import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';
import { AppMode } from '../../app';
import AssetManager from '../../xr/assetManager';
import Reticle from '../../xr/reticle';


const containerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`


function Game(props) {

    onMount(() => {
        const interactiveElements = document.querySelectorAll('#overlay button, #overlay a, #overlay [data-interactive]');
        console.log('-----', interactiveElements)
        interactiveElements.forEach(element => {
            console.log('el:', element)
            element.addEventListener('pointerdown', (e) => {
                // Impedisce al tap di attivare l'evento WebXR
                props.disableTap;

                // Impedisce la propagazione per sicurezza
                e.stopPropagation();
            });

            // Aggiungi anche per gli eventi touch per dispositivi mobili
            element.addEventListener('touchstart', (e) => {
                props.disableTap;
                e.stopPropagation();
            });
        });
    })

    createEffect(() => {

        // When we receive the hitMatrix from TAP,
        // we must initialize AssetManager, if not yet initialized
        if (!AssetManager.initialized()) {
            AssetManager.init(props.scene, props.hitMatrix);
            console.log("AssetManager initialized! referenceMatrix:", props.hitMatrix)

            // Next, if we have data,
            // we use them to spawn saved assets
            if (props.data) {
                console.log("Let's import JSON...")
                AssetManager.importFromJSON(props.data);
                AssetManager.loadAllAssets();
            }
        }

        // If AssetManager alreay initialized,
        // we create an asset
        else {
            if (props.currentMode === AppMode.SAVE) {
                console.log('adesso dovrei creare un asset...')
                const asset = AssetManager.addAsset('Gizmo', 'gizmo.glb', { matrix: props.hitMatrix });
                AssetManager.loadAsset(asset.id);
            }
        }
    })


    const createAssetOnTap = () => {

    }


    return (
        <div>
            <div class={containerStyle}>
                {props.currentMode === AppMode.SAVE &&
                    <button onClick={() => {
                        const data = AssetManager.exportToJSON();
                        props.saveData(data)
                    }} >SAVE DATA</button>}
            </div>

            <p>
                {props.marker.name}
            </p>
            <p>
                {JSON.stringify(props.data)}
            </p>
        </div>
    )
}
export default Game