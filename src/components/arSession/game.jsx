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
import qrCodeIcon from '../../assets/images/qrCode.svg';
import plusIcon from '../../assets/images/plus.svg';
import minusIcon from '../../assets/images/minus.svg';



function Game(props) {
    // const [canEdit, setCanEdit] = createSignal(props.currentMode === AppMode.SAVE ? true : false)
    const [usePlaneDetection, setUsePlaneDetection] = createSignal(true);
    const [newAssetsId, setNewAssetsId] = createSignal([])

    let _interactiveElements = null;
    let _isUndo = false;

    const handleDisableTap = (e) => {
        props.disableTap;
        e.stopPropagation();
    };

    onMount(() => {
        // Disable TAP event
        // when a DOM interactive element is selected
        _interactiveElements = document.querySelectorAll('#overlay button, #overlay a, #overlay [data-interactive]');
        _interactiveElements.forEach(element => {
            element.addEventListener('pointerdown', handleDisableTap);
            element.addEventListener('touchstart', handleDisableTap);
        });

        if (props.canEdit) {
            Reticle.set({
                color: 0xcccccc,
                radius: 0.15,
                innerRadius: 0.12,
                segments: 48,
            });
        }
    })


    onCleanup(() => {
        _interactiveElements.forEach(element => {
            element.removeEventListener('pointerdown', handleDisableTap);
            element.removeEventListener('touchstart', handleDisableTap);
        });
    })



    createEffect(() => {
        console.log("--- createEffect ---")
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
        else {
            createAssetOnTap(props.hitMatrix)
        }
    })


    const createAssetOnTap = (matrix) => {
        // // What the fuck!!!!
        // if (_isUndo) {
        //     _isUndo = false;
        //     return;
        // }
        if (!_isUndo) {
            console.log('adesso devo creare un asset...')
            // const asset = AssetManager.addAsset('baloon', 'baloons.glb', { matrix: props.hitMatrix });
            const asset = AssetManager.addAsset('gizmo', 'gizmo.glb', { matrix: matrix });
            AssetManager.loadAsset(asset.id);
            setNewAssetsId(prev => [...prev, asset.id]);
            console.log('adesso i nuovi asset sono:', newAssetsId())
        }
    }


    ///
    // BUTTONS HANDLERS
    const handleSaveData = async () => {
        if (newAssetsId().length !== 0) {
            const data = AssetManager.exportToJSON();
            await props.saveData(data)
            console.log("DATA SAVED!")
        }
    }

    const handleUndo = () => {
        if (newAssetsId().length !== 0) {
            _isUndo = true;
            console.log('adesso cancello ultimo asset...')
            console.log('prima:', newAssetsId())
            const array = [...newAssetsId()];
            const id = array.pop();
            AssetManager.removeAsset(id);
            setNewAssetsId(array)
            console.log('dopo:', newAssetsId())
            setTimeout(() => { _isUndo = false }, 100)
        }
    }

    const handleToggleEdit = () => {
        props.setCanEdit(!props.canEdit);
        Reticle.setHidden(!props.canEdit);
    }

    const handleClose = () => {
    }

    const handleShowQrCode = () => {

    }

    const handleUsePlaneDetection = () => {
        setUsePlaneDetection(() => !usePlaneDetection());
    }


    ///
    // STYLES
    const ContainerMain = styled('div')`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    `

    const ContainerSide = styled('div')`
        position: absolute;
        left:0;
        top:20%;
        height: 50vh;
        display: flex;
        flex-direction: column-reverse;
    `

    const ContainerTop = styled('div')`
        position: absolute;
        top: 0;
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: end;
    `

    const Bttn = styled('button')`
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        outline: none;
        margin: 20px;
        visibility: ${props => props.visible ? 'visible' : 'hidden'};
        opacity: ${props => props.active ? 1 : 0.3};
        background: rgba(68, 68, 68, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(7.1px);
    `

    const BorderBttn = styled(Bttn)`
        border: 1px solid;
        border-color: rgb(179, 179, 179);
    `





    return (
        <ContainerMain id="game-container">

            <ContainerTop>
                <Bttn data-interactive
                    active={true}
                    visible={props.canEdit}
                    onClick={handleShowQrCode}>
                    <img src={qrCodeIcon} style="width: 25px" />
                </Bttn>
                <BorderBttn data-interactive
                    active={true}
                    visible={true}
                    onClick={handleClose}>
                    <img src={closeIcon} style="width: 12px" />
                </BorderBttn>
            </ContainerTop>

            {props.currentMode === AppMode.SAVE &&
                <ContainerSide data-interactive>
                    <BorderBttn data-interactive
                        active={true}
                        visible={true}
                        onClick={handleToggleEdit}>
                        <img src={props.canEdit ? minusIcon : plusIcon} style="width: 20px" />
                    </BorderBttn>

                    <Bttn data-interactive
                        active={true}
                        visible={props.canEdit}
                        onClick={handleUsePlaneDetection}>
                        <img src={usePlaneDetection() ? planeIcon : pointIcon} style="width: 25px" />
                    </Bttn>

                    <Bttn data-interactive
                        active={newAssetsId().length !== 0}
                        visible={props.canEdit}
                        onClick={handleSaveData}>
                        <img src={uploadIcon} style="width: 20px" />
                    </Bttn>

                    <Bttn data-interactive
                        active={newAssetsId().length !== 0}
                        visible={props.canEdit}
                        onClick={handleUndo}>
                        <img src={undoIcon} style="width: 20px" />
                    </Bttn>
                </ContainerSide>
            }

        </ContainerMain>
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