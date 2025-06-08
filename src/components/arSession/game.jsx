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

    // onMount(() => {
    //     console.log(props.scene)
    // })

    createEffect(() => {

        // console.log('----> game, hitMatrix is changed:', props.hitMatrix)
        if (!AssetManager.initialized()) {
            AssetManager.init(props.scene, props.hitMatrix);
            console.log("AssetManager initialized! referenceMatrix:", props.hitMatrix)
        }
        else {
            console.log('adesso dovrei creare un asset...')
            const asset = AssetManager.addAsset('Gizmo', 'gizmo.glb', { matrix: props.hitMatrix });
            AssetManager.loadAllAssets();
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