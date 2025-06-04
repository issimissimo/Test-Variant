import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import { Motion } from 'solid-motionone'
import { css } from 'goober'
import GradientBox from '../ui/gradientBox/GradientBox';


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


function Scanning(props) {
    const [difficult, setDifficult] = createSignal(false)
    const [planeLost, setPlaneLost] = createSignal(false)

    let timeout;

    onMount(() => {
        timeout = setTimeout(() => {
            setDifficult(() => true);
        }, 15000);
    })

    onCleanup(() => {
        if (timeout) {
            clearInterval(timeout)
        }
    })

    createEffect(() => {
        // impostiamo la UI in modo che se !props.planeFound
        // è già pronta
        if (props.planeFound) {
            setTimeout(() => {
                setPlaneLost(() => true);
            }, 1000)
        }
    })


    return (
        <div class={containerStyle}>
            <div class={containerTextBottomStyle}>
                <Motion.div
                    animate={{ opacity: props.planeFound ? 0 : 1 }}
                    transition={{ duration: 1, easing: "ease-in-out" }}
                    style={{ "opacity": 1 }}
                >
                    {/* TEXT */}
                    <p>
                        {!difficult() ? (
                            <>
                                Inquadra con il telefono il QR Code
                                <br />
                                e mettiti a 2 metri di distanza
                            </>
                        ) : (
                            <>
                                Ok, segui queste indicazioni:
                                <br />
                                <br />
                                Muovi lentamente il telefono descrivendo un arco,
                                <br />
                                sempre rivolgendolo verso il QR Code
                                <br />
                                <br />
                                Assicurati di essere a circa 2 metri
                                <br />
                                di distanza dal QR Code
                            </>
                        )}
                    </p>

                    {/* IMAGE    */}
                    <div class={containerStyle}>
                        <Motion.img
                            animate={{ opacity: props.planeFound ? 0 : 1 }}
                            transition={{ duration: 0.7, easing: "ease-in-out" }}
                            style={{ "opacity": 1, "width": "110px" }}
                            src={difficult() ? "images/mobile-arrows.png" : "images/mobile-no-arrows.png"}
                        />
                    </div>

                </Motion.div>
            </div>

            <div class={containerStyle}>
                <Motion.div
                    animate={{ opacity: props.planeFound ? 0 : 1 }}
                    transition={{ duration: 1, easing: "ease-in-out" }}
                    style={{ "opacity": 0 }}
                >
                    <p style={"padding-bottom: 220px"}>
                        {planeLost() && (
                            <>
                                Oops... non trovo più la superficie
                                <br />
                                con il QR Code
                            </>
                        )}
                    </p>
                </Motion.div>
            </div>

        </div>
    );
}





function Targeting(props) {
    return (
        <div class={containerStyle}>

            {/* IMAGE */}
            <div class={containerStyle}>
                <Motion.img
                    animate={{ opacity: props.planeFound ? 1 : 0, scale: props.planeFound ? 0.2 : 1 }}
                    transition={{ duration: 1, easing: "ease-in-out" }}
                    style={{ "opacity": 0 }}
                    src="images/target.svg"
                />
            </div>

            {/* TEXT */}
            <div class={containerTextBottomStyle}>
                <Motion.div
                    animate={{ opacity: props.planeFound ? 1 : 0 }}
                    transition={{ duration: 1, easing: "ease-in-out" }}
                    style={{ "opacity": 0 }}
                >
                    <p>
                        Ottimo!
                        <br />
                        <br />
                        Adesso centra il QR Code nel mirino,
                        <br></br>
                        poi clicca sul tasto qui sotto
                        {/* <br></br>
                        per completare la calibrazione */}
                    </p>
                    <button class={startButtonStyle} onClick={props.startGame}>
                        <img src="images/checkmark.png"
                        // width={32}
                        // height={32}
                        />
                    </button>
                </Motion.div>
            </div>
        </div>
    );
}


function Calibration(props) {
    return (
        <div>
            <GradientBox planeFound={props.planeFound} />
            <Scanning planeFound={props.planeFound} />
            <Targeting planeFound={props.planeFound} startGame={props.startGame} />
        </div>
    );
}
export default Calibration