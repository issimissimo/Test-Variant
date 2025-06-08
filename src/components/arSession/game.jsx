import { createSignal, createEffect, onMount } from 'solid-js';
import AssetManager from '../../xr/assetManager';
import Reticle from '../../xr/reticle';

function Game(props) {

    onMount(() => {
        console.log(props.scene)
    })

    createEffect(() => {

        console.log('----> game, hitMatrix is changed:', props.hitMatrix)

        // if (!AssetManager.initialized()) {
        //     AssetManager.init(props.scene, props.hitMatrix);
        //     console.log("AssetManager initialized! referenceMatrix:", props.hitMatrix)
        // }
        // else {
        //     console.log('adesso dovrei creare un asset...')
        // }



    })

    return (
        <div>
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