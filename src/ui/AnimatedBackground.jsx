import { styled } from "solid-styled-components";

const BackgroundContainer = styled.div`
  position: relative;
  min-height: 100dvh;
  background-color: var(--color-background);
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  border: 2px solid;
  background: transparent;
  animation: expand 12s ease-in-out infinite;

  @keyframes expand {
    0% {
      transform: scale(0.2);
      opacity: 0;
    }
    20% {
      opacity: 0.4;
    }
    50% {
      transform: scale(1);
      opacity: 0.6;
    }
    80% {
      opacity: 0.3;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    &.circle-1 { width: 60vw; height: 60vw; }
    &.circle-2 { width: 70vw; height: 70vw; }
    &.circle-3 { width: 80vw; height: 80vw; }
    &.circle-4 { width: 50vw; height: 50vw; }
    &.circle-5 { width: 65vw; height: 65vw; }
    &.circle-6 { width: 55vw; height: 55vw; }
  }

  @media (max-width: 320px) {
    border-width: 1px;
    &.circle-1 { width: 85vw; height: 85vw; }
    &.circle-2 { width: 95vw; height: 95vw; }
    &.circle-3 { width: 105vw; height: 105vw; }
  }
`;

const Circle1 = styled(Circle)`
  border-color: var(--color-primary-dark);
  color: var(--color-primary-dark);
  width: 80vw;
  height: 80vw;
  top: 5%;
  left: -20%;
  animation-delay: 0s;
`;

const Circle2 = styled(Circle)`
  border-color: var(--color-secondary-dark);
   color: var(--color-secondary-dark);
  width: 90vw;
  height: 90vw;
  top: 25%;
  right: -25%;
  animation-delay: -4s;
`;

const Circle3 = styled(Circle)`
  border-color: var(--color-grey-dark);
  color: var(--color-grey-dark);
  width: 100vw;
  height: 100vw;
  bottom: 15%;
  left: -10%;
  animation-delay: -8s;
`;

const Circle4 = styled(Circle)`
  border-color: var(--color-primary-dark);
  color: var(--color-primary-dark);
  width: 70vw;
  height: 70vw;
  top: 45%;
  right: -15%;
  animation-delay: -2s;
`;

const Circle5 = styled(Circle)`
  border-color: var(--color-secondary-dark);
  color: var(--color-secondary-dark);
  width: 85vw;
  height: 85vw;
  bottom: 35%;
  left: -30%;
  animation-delay: -6s;
`;

const Circle6 = styled(Circle)`
  border-color: var(--color-grey-dark);
  color:var(--color-grey-dark);
  width: 75vw;
  height: 75vw;
  top: 60%;
  right: -20%;
  animation-delay: -10s;
`;

const AnimatedBackground = (props) => {
  return (
    <BackgroundContainer>
      <Circle1 class="circle-1" />
      <Circle2 class="circle-2" />
      <Circle3 class="circle-3" />
      <Circle4 class="circle-4" />
      <Circle5 class="circle-5" />
      <Circle6 class="circle-6" />
      {props.children}
    </BackgroundContainer>
  )
}

export default AnimatedBackground