import { createSignal, createEffect, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';

import leftArrow from '../../assets/images/leftArrow.svg';
import rightArrow from '../../assets/images/rightArrow.svg';
import undoIcon from '../../assets/images/undo.svg';
import uploadIcon from '../../assets/images/upload.svg';
import planeIcon from '../../assets/images/plane.svg';
import pointIcon from '../../assets/images/point.svg';
import closeIcon from '../../assets/images/close.svg';




export default function Playground(props) {

    const [buttonActive, setButtonActive] = createSignal(true);

    const [usePlaneDetection, setUsePlaneDetection] = createSignal(true);

    const handleDisableTap = () => {
        console.log("YEEEEEEEEEEEE")
    }
    const toggle = () => {
        setButtonActive(!buttonActive());
        console.log(buttonActive())
        console.log("--------------")
        console.log("interactive elements:", interactiveElements)
        console.log("--------------")
    };

    let interactiveElements = null;
    interactiveElements = document.querySelectorAll('#overlay button, #overlay a, #playground-container [data-interactive]');
    console.log("--------------")
    console.log("interactive elements:", interactiveElements)
    console.log("--------------")
    interactiveElements.forEach(element => {
        element.addEventListener('pointerdown', ((handleDisableTap)));
        // element.addEventListener('touchstart', handleDisableTap);
        console.log(element)
    });




    const Container = styled('div')`
    position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: url('foto.jpg');
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




    const handelButtonClick = () => {

    }


    return (
        <Container id="playground-container">
            <ContainerTopButtons>
                <Bttn active={true}
                    visible={true}>
                    <img src={closeIcon} style="width: 10px" />
                </Bttn>
            </ContainerTopButtons>

            <ContainerSideButtons>

                <Bttn data-interactive
                    onClick={toggle}
                    active={true}
                    visible={true}
                >
                    <img src={buttonActive()? leftArrow : rightArrow} style="width: 25px"/>
                </Bttn>


                <Bttn data-interactive
                    onClick={() => { setUsePlaneDetection(() => !usePlaneDetection()) }}
                    active={true}
                    visible={buttonActive()}>
                    <img src={usePlaneDetection() ? planeIcon : pointIcon} style="width: 27px" />
                </Bttn>


                <Bttn data-interactive visible={buttonActive()}
                    active={true}>

                    <img src={uploadIcon} style="width: 20px" />
                </Bttn>

                <Bttn data-interactive visible={buttonActive()}
                    active={true}>
                    <img src={undoIcon} style="width: 20px" />
                </Bttn>


            </ContainerSideButtons>
        </Container>
    );

}