import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';
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
            console.log('adesso dovrei creare un asset...')
            const asset = AssetManager.addAsset('Gizmo', 'gizmo.glb', { matrix: props.hitMatrix });
            AssetManager.loadAsset(asset.id);
        }
    })

    return (
        <div>
            <div class={containerStyle}>
                <button onClick={() => {
                    const data = AssetManager.exportToJSON();
                    props.saveData(data)
                }} >SAVE DATA</button>
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