import { createSignal, createEffect, onMount } from 'solid-js';

function Game(props) {

    onMount(()=>{
        console.log(props.marker)
    })

    return (
        <div>
            <h2>
                {props.marker.name}
            </h2>
            <p>
                {JSON.stringify(props.jsonData)}
            </p>
        </div>
    )
}
export default Game