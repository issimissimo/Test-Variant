import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';
import { AppMode } from '../../app';
import AssetManager from '../../xr/assetManager';
import Reticle from '../../xr/reticle';
import { generateQRCodeForForMarker } from '../../hooks/useQRCode';

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

    //#region [constants]

    const [usePlaneDetection, setUsePlaneDetection] = createSignal(true);
    const [newAssetsId, setNewAssetsId] = createSignal([]);
    const [qrCodeOpen, setQrCodeOpen] = createSignal(false);
    const [message, setMessage] = createSignal(null)

    let _interactiveElements = [];
    let _isUndo = false;






    //#region [lifeCycle]

    onMount(() => {
        // Disable TAP event
        // when a DOM interactive element is clicked
        _interactiveElements = document.querySelectorAll('#overlay button, #overlay a, #overlay [data-interactive]');
        _interactiveElements.forEach(element => {
            element.addEventListener('pointerdown', disableTap);
            element.addEventListener('touchstart', disableTap);
        });

        // Set Reticle
        if (props.canEdit) {
            Reticle.set({
                color: 0xcccccc,
                radius: 0.15,
                innerRadius: 0.12,
                segments: 48,
            });
        }

        // Generate QR Code
        if (props.data)
            generateQRCodeForForMarker(props.userId, props.marker.id);
    })


    onCleanup(() => {
        _interactiveElements.forEach(element => {
            element.removeEventListener('pointerdown', disableTap);
            element.removeEventListener('touchstart', disableTap);
        });
    })



    createEffect(async () => {
        // When we receive the hitMatrix from TAP,
        // we must initialize AssetManager, if not yet initialized
        if (!AssetManager.initialized()) {
            AssetManager.init(props.scene, props.hitMatrix);
            console.log("AssetManager initialized!")

            // Next, if we have data,
            // we use them to spawn saved assets
            if (props.data) {
                AssetManager.importFromJSON(props.data);
                await AssetManager.loadAllAssets();
                setupMessage('Dati caricati! Guardati intorno')
            }
        }
        else {
            createAssetOnTap(props.hitMatrix)
        }
    })





    //#region [handlers]

    const handleSaveData = async () => {
        if (newAssetsId().length !== 0) {
            const data = AssetManager.exportToJSON();
            await props.saveData(data)
            console.log("DATA SAVED!")
            generateQRCodeForForMarker(props.userId, props.marker.id);
            setupMessage('Dati salvati')
            setNewAssetsId(() => [])
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

    const handleToggleQrCode = () => {
        setQrCodeOpen(() => !qrCodeOpen());
    }

    const handleTogglePlaneDetection = () => {
        setUsePlaneDetection(() => !usePlaneDetection());
        Reticle.setUsePlaneDetection(usePlaneDetection());
    }




    //#region [functions]

    const disableTap = (e) => {
        props.disableTap;
        e.stopPropagation();
    };

    const createAssetOnTap = (matrix) => {
        if (!_isUndo) {
            console.log('adesso devo creare un asset...')
            // const asset = AssetManager.addAsset('baloon', 'baloons.glb', { matrix: props.hitMatrix });
            const asset = AssetManager.addAsset('gizmo', 'gizmo.glb', { matrix: matrix });
            AssetManager.loadAsset(asset.id);
            setNewAssetsId(prev => [...prev, asset.id]);
            console.log('adesso i nuovi asset sono:', newAssetsId())
        }
    }

    const setupMessage = (msg, autoClose = true, closeTime = 5000) => {
        setMessage(() => msg);
        if (autoClose) {
            setTimeout(() => {
                setMessage(() => null)
            }, closeTime)
        }
    }




    //#region [style]

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

    const ContainerCenter = styled('div')`
        position: absolute;
        top: 0;
        left:0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        display: ${props => props.visible ? 'flex' : 'none'};
    `

    const ContainerInfo = styled('div')`
        background-color: #222222;
        width: 200px;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        display: ${props => props.visible ? 'flex' : 'none'};
    `

    const MessageText = styled('p')`
        margin: 10px;
        padding: 0px;
        text-align: center;
        display: ${props => props.visible ? 'block' : 'none'};
    `

    const ContainerQrCode = styled('div')`
        border-radius: 1rem;
        background-color: #222222;
        padding:10px;
        padding-bottom: 5px;
        display: ${props => props.visible ? 'block' : 'none'};
    `

    // const QrCode = styled('img')`
    //     display: ${props => props.visible ? 'block' : 'none'};
    // `

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
        border: 2px solid;
        border-color: rgb(179, 179, 179);
    `





    //#region [return]

    return (
        <ContainerMain id="game-container">

            {/* <ContainerCenter
                visible={messageOpen()}>
                <ContainerMessage
                    visible={message()}>
                    message
                </ContainerMessage>
            </ContainerCenter> */}

            <ContainerCenter
                visible={true}>

                <ContainerInfo
                    visible={message() || qrCodeOpen() ? true : false}>

                    <ContainerQrCode
                     visible={qrCodeOpen() ? true : false}>
                        <img id='qr-code'/>
                    </ContainerQrCode>

                    <MessageText
                        visible={message() ? true : false}>
                        {message()}
                    </MessageText>

                </ContainerInfo>
            </ContainerCenter>

            <ContainerTop>
                <Bttn data-interactive
                    active={props.data ? true : false}
                    visible={props.canEdit}
                    onClick={handleToggleQrCode}>
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
                        onClick={handleTogglePlaneDetection}>
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
}
export default Game