import { styled } from 'solid-styled-components';
import { Puff } from 'solid-spinner';
import { Motion } from 'solid-motionone';

const SpinnerContainer = styled(Motion.div)`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: small;
    gap: 1rem;
  `;


const Spinner = (props) => {
    return (
        <SpinnerContainer
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
        >
            <Puff />
            {props.children}
        </SpinnerContainer>
    )
}

export default Spinner