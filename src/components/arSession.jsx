import { createSignal, createEffect, onMount } from 'solid-js';
import { css } from 'goober';

function ArSession(props) {

    return (
        <div class="full-screen-div">
            AR
            <p>
                {JSON.stringify(props.jsonData)}
            </p>
        </div>
    )
}
export default ArSession