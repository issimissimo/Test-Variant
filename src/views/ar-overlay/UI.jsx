import { createEffect, createSignal, onMount } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { config } from '@js/config';
import { styled } from 'solid-styled-components';


export default function UI() {

    const Container = styled('div')`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `;


    return (
        <Container id="Inventory">
            <p>INVENTORY</p>
        </Container>
    )
}