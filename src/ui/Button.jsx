import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import Fa from 'solid-fa';

const StyledButton = styled(Motion.button)`
  position: relative;
  display: ${props => props.visible ? 'block' : 'none'};
  width: 100%;
  flex-shrink: 0;
  padding: ${props => props.small ? "0" : "0.7rem"};
  font-size: ${props => props.small ? "small" : "1rem"};
  font-weight: 500;
  font-family: inherit;
  border-radius: 90px;
  background: var(--color-background);
  border: ${props => props.border ? (props.small ? "1px solid" : "2px solid") : "none"};
  border-color: ${props => props.grey ? 'var(--color-grey)' : 'var(--color-primary)'};
  pointer-events: ${props => props.active ? 'auto' : 'none'};
  color: ${props => props.grey ? 'var(--color-grey)' : 'var(--color-primary)'};
  box-shadow: none;
  outline: none;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.05s, color 0.05s;
  &:focus {
    outline: none;
    border-color: ${props => props.grey ? 'var(--color-grey)' : 'var(--color-primary)'};
    background: transparent;
  }
  &:active {
    background: ${props => props.grey ? 'var(--color-grey-dark)' : 'var(--color-primary-dark)'};
    color: var(--color-background);
    border-color: ${props => props.grey ? 'var(--color-grey)' : 'var(--color-primary)'};
  }
  `;


const Button = (props) => {
  const Icon = () => (
    <Fa icon={props.icon} size="1x" translateX={1} class="icon" />
  );
  return (
    <StyledButton
      onClick={props.onClick}
      active={props.active ?? true}
      visible={props.visible ?? true}
      grey={props.grey}
      border={props.border ?? true}
      small={props.small ?? false}
      class={props.class}
      style={props.style}
      animate={{ opacity: props.active ? 1 : 0.4 }}
      transition={{ duration: 0.25 }}
    >
      {props.children}
      {props.icon && <Icon />}
    </StyledButton>
  );
};

export default Button