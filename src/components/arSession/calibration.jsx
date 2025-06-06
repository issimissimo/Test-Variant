import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { css } from 'goober'



const containerStyle = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    text-align: center;
`

const containerTextBottomStyle = css`
    position: fixed;
    top: 50%;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    z-index: 99;
    text-align: center;
    padding-top: 70px;
`

const startButtonStyle = css`
    width: 100px;
    height: 100px;
    border-radius: 99px;
    background-color: rgba(0,0,0,0.8) !important;
    border: 1px solid;
    border-color: rgb(187, 187, 187);
    margin-top: 30px;
`





const targetBackgroundStyle = css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 200px;
    border-radius: 20px;
    box-shadow: 0 0 0 50vw rgba(0, 0, 0, 0.8);
    pointer-events: none;
`



export default function Calibration(props) {
    const [difficult, setDifficult] = createSignal(false)
    const [planeLost, setPlaneLost] = createSignal(false)

    let timeout = null;

    createEffect(() => {
        if (!props.planeFound) {
            console.log('start timeout')
            timeout = setTimeout(() => {
                setDifficult(() => true);
            }, 10000);
        }
        else {
            if (timeout) {
                console.log('stop timeout')
                clearInterval(timeout)
                timeout = null;
            }
        }
    })

    // onMount(() => {
    //     timeout = setTimeout(() => {
    //         setDifficult(() => true);
    //     }, 15000);
    // })

    onCleanup(() => {
        if (timeout) {
            clearInterval(timeout)
        }
    })

    return (
        <div>
            {props.planeFound ?
                <div class={containerStyle}>
                    FOUND!
                    
                </div>
                :
                <div class={containerStyle}>
                    LOOK...
                </div>
            }
        </div>
    );
}
