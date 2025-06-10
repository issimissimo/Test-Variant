import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';
import { AppMode } from '../../app';
import AssetManager from '../../xr/assetManager';
import Reticle from '../../xr/reticle';

// ICONS
import leftArrow from '../../assets/images/leftArrow.svg';
import rightArrow from '../../assets/images/rightArrow.svg';
import undoIcon from '../../assets/images/undo.svg';
import uploadIcon from '../../assets/images/upload.svg';
import planeIcon from '../../assets/images/plane.svg';
import pointIcon from '../../assets/images/point.svg';
import closeIcon from '../../assets/images/close.svg';



function Game(props) {
    const [canEdit, setCanEdit] = createSignal(props.currentMode === AppMode.SAVE ? true : false)
    const [usePlaneDetection, setUsePlaneDetection] = createSignal(true);
    // const [newAssetsId, setNewAssetsId] = createSignal([])

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
        console.log("--------------")
        console.log("interactive elements:", interactiveElements)
        console.log("--------------")
        interactiveElements.forEach(element => {
            element.addEventListener('pointerdown', handleDisableTap);
            element.addEventListener('touchstart', handleDisableTap);
            console.log(element)
        });

        // // Hide reticle if anonymous
        // if (props.currentMode === AppMode.LOAD) {
        //     Reticle.setVisible(false);
        // }
        // else {
        if (canEdit()) {
            Reticle.set({
                radius: 0.15,
                innerRadius: 0.12,
                segments: 48,
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

        Reticle.setVisible(canEdit());

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
            if (canEdit()) {
                console.log('adesso devo creare un asset...')
                // const asset = AssetManager.addAsset('baloon', 'baloons.glb', { matrix: props.hitMatrix });
                const asset = AssetManager.addAsset('gizmo', 'gizmo.glb', { matrix: props.hitMatrix });
                AssetManager.loadAsset(asset.id);
                newAssetsId.push(asset.id);
                console.log(asset)
            }
        }
    })


    const createAssetOnTap = () => {

    }

    ///
    // BUTTONS HANDLERS
    const handleSaveData = async () => {
        const data = AssetManager.exportToJSON();
        await props.saveData(data)
        console.log("DATA SAVED!")
    }

    const handleUndo = () => {
        console.log('UNDO!')
        if (newAssetsId.length) {
            console.log('adesso cancello ultimo asset...')
            const id = newAssetsId.pop();
            AssetManager.removeAsset(id);
        }
    }

    const handleToggleEdit = () => {
        setCanEdit(!canEdit());
        console.log(canEdit())
    };

    const handleClose = () => {
    };


    const handleUsePlaneDetection = () => {
        setUsePlaneDetection(() => !usePlaneDetection());
    }


    ///
    // STYLES
    const Container = styled('div')`
    position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    `

    const ContainerSideButtons = styled('div')`
        position: absolute;
        left:0;
        top:30%;
        height: 50vh;
        display: flex;
        flex-direction: column-reverse;
    `

    const ContainerTopButtons = styled('div')`
        position: absolute;
        top: 0;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: end;
    `

    const Bttn = styled('button')`
        width: 53px;
        height: 53px;
        border-radius: 50%;
        border: none;
        outline: none;
        margin: 20px;
        visibility: ${props => props.visible ? 'visible' : 'hidden'};
        opacity: ${props => props.active ? 1 : 0.7};
        background: rgba(68, 68, 68, 0.5);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(7.1px);
    `


    const ToggleBttn = styled(Bttn)`
        opacity: ${props => props.active ? 1 : 0.7};
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    `




    return (
        <Container id="game-container">

            <ContainerTopButtons>
                <Bttn data-interactive
                    onClick={handleClose}>
                    <img src={closeIcon} style="width: 10px" />
                </Bttn>
            </ContainerTopButtons>

            {props.currentMode === AppMode.SAVE &&

                <ContainerSideButtons data-interactive>

                    <Bttn data-interactive
                        active={true}
                        visible={true}
                        onClick={handleToggleEdit}>
                        <img src={canEdit() ? leftArrow : rightArrow} style="width: 25px" />
                    </Bttn>

                    <Bttn data-interactive
                        active={true}
                        visible={canEdit()}
                        onClick={handleUsePlaneDetection}>
                        <img src={usePlaneDetection() ? planeIcon : pointIcon} style="width: 27px" />
                    </Bttn>

                    <Bttn data-interactive
                        active={true}
                        visible={canEdit()}
                        onClick={handleSaveData}>
                        <img src={uploadIcon} style="width: 20px" />
                    </Bttn>

                    <Bttn data-interactive
                        active={true}
                        visible={canEdit()}
                        onClick={handleUndo}>
                        <img src={undoIcon} style="width: 20px" />
                    </Bttn>

                </ContainerSideButtons>
            }
        </Container>
    );


    // return (
    //     <div>
    //         <div class={containerStyle}>

    //             {props.currentMode === AppMode.SAVE &&

    //                 <div>

    //                     <button onClick={() => {
    //                         const data = AssetManager.exportToJSON();
    //                         props.saveData(data)
    //                     }} >SAVE DATA</button>

    //                     <button onClick={undo}>UNDO</button>


    //                 </div>
    //             }

    //             <button onClick={console.log('close')} >CLOSE</button>

    //         </div>

    //         <p>
    //             {props.marker.name}
    //         </p>
    //         <p>
    //             {JSON.stringify(props.data)}
    //         </p>
    //     </div>
    // )

}
export default Game