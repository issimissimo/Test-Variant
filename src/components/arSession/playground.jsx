import { createSignal, createEffect, onMount } from 'solid-js';
import { styled } from 'solid-styled-components';






export default function Playground(props) {

    const [buttonActive, setButtonActive] = createSignal(true);

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
        width: 55px;
        height: 55px;
        border-radius: 50%;
        border: none;
        outline: none;
        background-color: rgba(0,0,0,0.7);
        margin: 20px;
        visibility: ${props => props.visible ? 'visible' : 'hidden'};
    `


    const ToggleBttn = styled(Bttn)`
        opacity: ${props => props.active ? 1 : 0.7};
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        user-select: none;
        
    `


    const handelButtonClick = () => {

    }


    return (
        <Container id="playground-container">
            <ContainerTopButtons>
                <Bttn>
                    <img src={'images/close.png'} />
                </Bttn>
            </ContainerTopButtons>

            <ContainerSideButtons>

                <ToggleBttn data-interactive
                    onClick={toggle}
                    active={buttonActive()}
                    visible={true}
                >
                    <img src={'images/edit.png'} />
                </ToggleBttn>


                <Bttn data-interactive
                    onClick={() => { console.log("yeeeeeeeeeee") }}
                    visible={buttonActive()}>
                    <img src={'images/point.png'} />
                </Bttn>


                <Bttn data-interactive visible={buttonActive()}>
                    <img src={'images/save.png'} />
                </Bttn>

                <Bttn data-interactive visible={buttonActive()}>
                    <img src={'images/undo.png'} />
                </Bttn>


            </ContainerSideButtons>
        </Container>
    );

}