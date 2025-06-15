import { createSignal, createEffect, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';




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




export default function Playground(props) {

    const [buttonActive, setButtonActive] = createSignal(true);

    const [usePlaneDetection, setUsePlaneDetection] = createSignal(true);
    const [newAssetsId, setNewAssetsId] = createSignal([]);

    const addElementToArray = (element) => {
        setNewAssetsId(prev => [...prev, element]);
    };

    const removeLastElementFromArray = () => {
        const array = newAssetsId();
        const lastElement = array[array.length - 1]
        console.log('last element:', lastElement)
        setNewAssetsId(prev => {
            if (prev.length === 0) return prev;
            return prev.slice(0, -1);
        });
        console.log(newAssetsId())
    };

    addElementToArray('pippo')
    addElementToArray('pluto')
    removeLastElementFromArray();
    removeLastElementFromArray();


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
        top:20%;
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
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        outline: none;
        margin: 20px;
        visibility: ${props => props.visible ? 'visible' : 'hidden'};
        opacity: ${props => props.active ? 1 : 0.3};

        background: rgba(68, 68, 68, 0.4);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(7.1px);
    `

    const BorderBttn = styled(Bttn)`
        border: 1px solid;
        border-color: rgb(179, 179, 179);
    `



    const handelButtonClick = () => {

    }


    return (
        <MaskedBackground>
            <h1>Il Mio Titolo</h1>
            <p>Il mio contenuto</p>
        </MaskedBackground>
    );

}