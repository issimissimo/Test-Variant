import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';
// import { css } from 'goober';
import { AppMode } from '../../app';
import AssetManager from '../../xr/assetManager';
import Reticle from '../../xr/reticle';


// const containerStyle = css`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
// `


function Game(props) {

    const [canEdit, setCanEdit] = createSignal(props.currentMode === AppMode.SAVE ? true : false)

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
                color: 0xcccccc,
                radius: 0.15,
                innerRadius: 0.12,
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
        width: 55px;
        height: 55px;
        border-radius: 50%;
        border: none;
        outline: none;
        background-color: rgba(0,0,0,0.3);
        margin: 20px;
        visibility: ${props => props.visible ? 'visible' : 'hidden'};
    `


    const ToggleBttn = styled(Bttn)`
        opacity: ${props => props.active ? 1 : 0.7};
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
    `




    return (
        <Container id="playground-container">

            <ContainerTopButtons>
                <Bttn data-interactive onClick={handleClose}>
                    <img src={'images/close.png'} />
                </Bttn>
            </ContainerTopButtons>

            {props.currentMode === AppMode.SAVE &&

                <ContainerSideButtons>
                    <ToggleBttn data-interactive visible={true} active={canEdit()}
                        onClick={handleToggleEdit}>
                        <img src={'images/edit.png'} />
                    </ToggleBttn>
                    <Bttn data-interactive visible={canEdit()}
                        onClick={console.log('')}>
                        <img src={'images/point.png'} />
                    </Bttn>

                    <Bttn data-interactive visible={canEdit()}
                        onClick={handleSaveData}>
                        <img src={'images/save.png'} />
                    </Bttn>

                    <Bttn data-interactive visible={canEdit()}
                        onClick={handleUndo}>
                        <img src={'images/undo.png'} />
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