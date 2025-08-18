import { onMount, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import Button from '@ui/Button';
import Fa from 'solid-fa';
import { faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import Header from '@components/Header';

import { Container, FitHeight, FitHeightScrollable, Title } from '@ui/smallElements'
import AnimatedBackground from "@ui/AnimatedBackground";


const UserProfile = (props) => {

    onMount(() => {
        console.log(props.user)
    })

    return (
        <AnimatedBackground>
            <Container>

                {/* HEADER */}
                <Header
                    showUser={false}
                    showBack={true}
                    onClickBack={props.onBack}
                />

                {/* TITLE */}
                <Title
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
                >
                    <span style={{ color: 'var(--color-secondary)' }}>Il tuo </span>
                    <span style={{ color: 'var(--color-white)' }}>account</span>
                </Title>

                <FitHeight>
                    <FitHeight style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}>
                        <Fa icon={faUser} size="2x" class="icon" />
                    </FitHeight>

                    <Button
                        active={true}
                        icon={faArrowRightFromBracket}
                    >Logout</Button>
                </FitHeight>



            </Container>
        </AnimatedBackground>
    )
}

export default UserProfile