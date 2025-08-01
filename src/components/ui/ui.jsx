import { styled, keyframes } from 'solid-styled-components';
import Fa from 'solid-fa';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Animazioni riutilizzabili
export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Container principale con gradiente
export const Container = styled('div')`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

// Pattern di sfondo animato
export const BackgroundPattern = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 2px, transparent 2px);
  background-size: 40px 40px;
  animation: ${float} 15s ease-in-out infinite;
`;

// Card principale con effetto glassmorphism
export const Card = styled('div')`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  width: 85%;
  max-width: 400px;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.2);
  animation: ${fadeInUp} 0.8s ease-out;
  color: white;
  z-index: 999;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

// Header della card
export const Header = styled('div')`
  text-align: center;
  margin-bottom: 2rem;
`;

// Logo container
export const Logo = styled('div')`
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
`;

// Icona del logo
export const LogoIcon = styled('svg')`
  width: 30px;
  height: 30px;
  fill: white;
`;

// Titolo principale
export const Title = styled('h1')`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

// Sottotitolo
export const Subtitle = styled('p')`
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

// Container del form
export const Form = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Gruppo di input
export const InputGroup = styled('div')`
  position: relative;
`;

// Label dell'input
export const InputLabel = styled('label')`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

// Wrapper per l'input con icona
export const InputWrapper = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
`;

// Input principale
export const Input = styled('input')`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
  color: black;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
  
  &[type="password"] {
    padding-right: 3rem;
  }
`;

// Icona dell'input
export const InputIcon = styled('svg')`
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  fill: #6c757d;
  z-index: 2;
  pointer-events: none;
`;

// Toggle per la password
export const PasswordToggle = styled('button')`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
`;

// Icona del toggle password
export const PasswordToggleIcon = styled('svg')`
  width: 18px;
  height: 18px;
  fill: #6c757d;
`;

// Messaggi di errore
export const ErrorMessage = styled('div')`
  background: #fee;
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #dc3545;
`;

// Messaggi di successo
export const SuccessMessage = styled('div')`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #28a745;
`;

// Divisore con testo
export const Divider = styled('div')`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }
  
  span {
    background: rgba(255, 255, 255, 0);
    padding: 0 1rem;
    color: #ffffff;
    font-size: 0.9rem;
  }
`;

// Sezione aggiuntiva (es. registrazione)
export const Section = styled('div')`
  margin-top: 2rem;
  text-align: center;
`;

// Testo della sezione
export const SectionText = styled('p')`
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
`;

// Funzione helper per renderizzare icone FontAwesome
export const renderIcon = (iconDefinition, StyledComponent = InputIcon) => {
  const { icon } = iconDefinition;
  const [width, height, , , svgPathData] = icon;

  return (
    <StyledComponent viewBox={`0 0 ${width} ${height}`}>
      {Array.isArray(svgPathData) ? (
        svgPathData.map((path, index) => (
          <path key={index} d={path} />
        ))
      ) : (
        <path d={svgPathData} />
      )}
    </StyledComponent>
  );
};

// Bottoni esistenti
export const BUTTON_MODE = {
  DEFAULT: 'default',
  DANGER: 'danger',
  HIGHLIGHT: 'highlight',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
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
        return 'rgba(220, 53, 69, 0.8)';
      case BUTTON_MODE.HIGHLIGHT:
        return 'rgba(0, 123, 255, 0.8)';
      case BUTTON_MODE.PRIMARY:
        return 'linear-gradient(45deg, #667eea, #764ba2)';
      case BUTTON_MODE.SECONDARY:
        return 'transparent';
      case BUTTON_MODE.DEFAULT:
      default:
        return 'rgba(68, 68, 68, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.mode) {
      case BUTTON_MODE.SECONDARY:
        return '#ffffff';
      default:
        return 'white';
    }
  }};
  border: ${props => {
    switch (props.mode) {
      case BUTTON_MODE.SECONDARY:
        return '2px solid #ffffff83';
      default:
        return 'none';
    }
  }};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.875rem;
  border-radius: 12px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }
  
  &:hover:not(:disabled) {
    ${props => props.mode === BUTTON_MODE.SECONDARY && `
      background: #667eea;
      color: white;
    `}
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

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
      disabled={props.disabled}
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
  opacity: ${props => props.active ? 1 : 0.2};
  pointer-events: ${props => props.active ? 'auto' : 'none'};
  background: rgba(68, 68, 68, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(7.1px);
`;

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
    </StyledCircleButton>
  );
};

export const ArButtonContainer = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 50px;
`;

const BackButtonStyled = styled(CircleButton)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid;
`;

export const BackButton = (props) => {
  return (
    <BackButtonStyled
      icon={faArrowLeft}
      onClick={props.onClick}
    >
    </BackButtonStyled>
  );
};