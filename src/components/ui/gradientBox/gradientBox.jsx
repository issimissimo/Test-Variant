import { createEffect } from 'solid-js';
import './gradientBox.css';


const className = {
    ANIMATE_IN: 'animateIn',
    ANIMATE_OUT: 'animateOut',
}

export default function GradientBox(props) {
    let gradientBoxRef;
    let initialized = false;
    let currentClassName = className.ANIMATE_IN;

    createEffect(() => {
        const newClassName = props.planeFound ? className.ANIMATE_IN : className.ANIMATE_OUT;

        if (initialized) {
            // console.log('adesso devo togliere: ' + currentClassName + " , e mettere: " + newClassName)

            // Resetta l'animazione prima di riavviarla
            gradientBoxRef.classList.remove(currentClassName);
            void gradientBoxRef.offsetWidth; // Forza il reflow
            gradientBoxRef.classList.add(newClassName);

            currentClassName = newClassName;
        }
        else {
            initialized = true;
        }
    })

    return (
        <div id="gradient"
            ref={gradientBoxRef}
            class="gradient-box"
        />
    );
}