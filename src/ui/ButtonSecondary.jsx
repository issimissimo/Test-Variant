import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import Fa from 'solid-fa';

const StyledButton = styled(Motion.button)`
    position: relative;
    /* width: 100%; */
    padding: 0.4rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: small;
    font-weight: 500;
    font-family: inherit;
    border-radius: 20px;
    background: none;
    color: var(--color-secondary);
    border: none;
    box-shadow: none;
    outline: none;
    z-index: 1;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.05s, color 0.05s;
    &:focus {
      outline: none;
      background: transparent;
    }
    &:active {
      background: var(--color-secondary);
      color: var(--color-background);
    }
  `;


const ButtonSecondary = (props) => {
  const Icon = () => (
    <Fa icon={props.icon} size="1x" translateX={1} class="icon" />
  );
  return (
    <StyledButton
      onClick={props.onClick}
      class={props.class}
      style={props.style}
    >
      {props.children}
      {props.icon && <Icon />}
    </StyledButton>
  );
};

export default ButtonSecondary