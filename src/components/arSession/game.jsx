import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
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

    const [canModify, setCanModify] = createSignal(props.currentMode === AppMode.SAVE ? true : false)

    const newAssetsId = [];
    let interactiveElements = null;

    const handleDisableTap = (e) => {
        props.disableTap;
        e.stopPropagation();
    };


    onMount(() => {
        // Disable TAP event
        // when a DOM interactive element is selected
        interactiveElements = document.querySelectorAll('#overlay button, #overlay a, #overlay [data-interactive]');
        interactiveElements.forEach(element => {
            element.addEventListener('pointerdown', handleDisableTap);
            element.addEventListener('touchstart', handleDisableTap);
        });

        // // Hide reticle if anonymous
        // if (props.currentMode === AppMode.LOAD) {
        //     Reticle.setVisible(false);
        // }
        // else {
        if (canModify()) {
            Reticle.set({
                color: 0xcccccc,
                radius: 0.15,
                innerRadius: 0.1,
                segments: 32,
            });
        }

        // }
    })

    // createEffect(() => {
    //     Reticle.setVisible(canModify());
    // })


    onCleanup(() => {
        interactiveElements.forEach(element => {
            element.removeEventListener('pointerdown', handleDisableTap);
            element.removeEventListener('touchstart', handleDisableTap);
        });
    })


    createEffect(() => {

        Reticle.setVisible(canModify());

        // When we receive the hitMatrix from TAP,
        // we must initialize AssetManager, if not yet initialized
        if (!AssetManager.initialized()) {
            AssetManager.init(props.scene, props.hitMatrix);
            console.log("AssetManager initialized!")

            // Next, if we have data,
            // we use them to spawn saved assets
            if (props.data) {
                AssetManager.importFromJSON(props.data);
                AssetManager.loadAllAssets();
            }
        }

        // If AssetManager alreay initialized,
        // we create an asset
        else {
            if (canModify()) {
                console.log('adesso devo creare un asset...')
                const asset = AssetManager.addAsset('baloon', 'baloons.glb', { matrix: props.hitMatrix });
                AssetManager.loadAsset(asset.id);
                newAssetsId.push(asset.id);
                console.log(asset)
            }
        }
    })


    const createAssetOnTap = () => {

    }

    const undo = () => {
        console.log('UNDO!')
        if (newAssetsId.length) {
            console.log('adesso cancello ultimo asset...')
            const id = newAssetsId.pop();
            AssetManager.removeAsset(id);
        }
    }


    return (
        <div>
            <div class={containerStyle}>

                {props.currentMode === AppMode.SAVE &&

                    <div>

                        <button onClick={() => {
                            const data = AssetManager.exportToJSON();
                            props.saveData(data)
                        }} >SAVE DATA</button>

                        <button onClick={undo}>UNDO</button>


                    </div>
                }

                <button onClick={console.log('close')} >CLOSE</button>

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