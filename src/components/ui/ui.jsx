import { styled } from 'solid-styled-components';
import Fa from 'solid-fa';


export const BUTTON_MODE = {
  DEFAULT: 'default',
  DANGER: 'danger',
  HIGHLIGHT: 'highlight',
};

const StyledButton = styled('button')`
        width: 100%;
        height: 40px;
        border-radius: 90px;
        border: none;
        outline: none;
        margin-top: 15px;
        opacity: ${props => props.active ? 1 : 0.2};
        pointer-events: ${props => props.active ? 'auto' : 'none'};
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: ${props => {
    switch (props.mode) {
      case BUTTON_MODE.DANGER:
        return 'rgba(220, 53, 69, 0.8)'; // Rosso
      case BUTTON_MODE.HIGHLIGHT:
        return 'rgba(0, 123, 255, 0.8)'; // Blu
      case BUTTON_MODE.DEFAULT:
      default:
        return 'rgba(68, 68, 68, 0.2)'; // Grigio
    }
  }};
        
    `



export const Button = (props) => {
  const Icon = () => (
    <Fa icon={props.icon} size="1x" class="icon" />
  );
  return (
    <StyledButton
      type={props.type || "button"}
      onClick={props.onClick}
      active={props.active ?? true}
      mode={props.mode || BUTTON_MODE.DEFAULT}
      class={props.class}
    >
      {props.icon && <Icon />}
      {props.children}
    </StyledButton>
  );
};


const StyledCircleButton = styled('button')`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        outline: none;
        /* margin: 20px; */
        opacity: ${props => props.active ? 1 : 0.2};
        pointer-events: ${props => props.active ? 'auto' : 'none'};
        /* visibility: ${props => props.visible ? 'visible' : 'hidden'}; */
        background: rgba(68, 68, 68, 0.2);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(7.1px);
    `


export const CircleButton = (props) => {
  const Icon = () => (
    <Fa icon={props.icon} size="1x" class="icon" />
  );
  return (
    <StyledCircleButton
      type={props.type || "button"}
      onClick={props.onClick}
      active={props.active ?? true}
      class={props.class}
    >
      {props.icon && <Icon />}
      {/* {props.children} */}
    </StyledCircleButton>
  );
};


export const ArButtonContainer = styled('div')`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        /* width: 100%; */
        height: 150px;
        z-index: 1000;
        /* background-color: red; */
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 50px;
    `
