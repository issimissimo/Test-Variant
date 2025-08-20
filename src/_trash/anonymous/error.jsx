import { onMount, createSignal } from 'solid-js';
import { styled, keyframes } from 'solid-styled-components';
import { faExclamationTriangle, faSearch, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';


// Animazioni keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 20px 40px rgba(220, 53, 69, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 25px 50px rgba(220, 53, 69, 0.3);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
const Container = styled('div')`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #dc3545 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const BackgroundPattern = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.08) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px, 40px 40px;
  animation: ${float} 25s ease-in-out infinite;
`;

const ContentWrapper = styled('div')`
  text-align: center;
  z-index: 2;
  max-width: 400px;
  width: 100%;
`;

const ErrorContainer = styled('div')`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const ErrorIcon = styled('div')`
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(45deg, #dc3545, #c82333);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 3s ease-in-out infinite, ${shake} 0.8s ease-in-out;
  box-shadow: 
    0 20px 40px rgba(220, 53, 69, 0.3),
    0 0 0 1px rgba(255,255,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    border-radius: 26px;
    z-index: -1;
  }
`;

const IconSVG = styled('svg')`
  width: 60px;
  height: 60px;
  fill: white;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
`;

const Title = styled('h1')`
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled('p')`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.95);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-weight: 300;
  animation: ${fadeInUp} 1s ease-out 0.4s both;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ReasonsList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  animation: ${fadeInScale} 1s ease-out 0.6s both;
`;

const ReasonItem = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  font-weight: 400;
  animation: ${fadeInUp} 1s ease-out ${props => 0.8 + props.delay}s both;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ReasonIcon = styled('svg')`
  width: 18px;
  height: 18px;
  fill: rgba(255,255,255,0.7);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  flex-shrink: 0;
`;

const SuggestionText = styled('p')`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin: 1.5rem 0 0 0;
  line-height: 1.5;
  font-weight: 400;
  animation: ${fadeInUp} 1s ease-out 1.4s both;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FloatingElement = styled('div')`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 1;
`;

const GlitchElement = styled('div')`
  position: absolute;
  width: 100px;
  height: 2px;
  background: rgba(255,255,255,0.2);
  animation: ${shake} 2s ease-in-out infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 1;
`;

export default function Error() {
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
  });

  // Funzione per renderizzare icone SVG
  const renderIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;
    
    return (
      <ReasonIcon viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </ReasonIcon>
    );
  };

  const renderMainIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;
    
    return (
      <IconSVG viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </IconSVG>
    );
  };

  return (
    <Container>
      <BackgroundPattern />
      
      {/* Elementi fluttuanti decorativi */}
      <FloatingElement size={40} duration={10} top={15} left={10} />
      <FloatingElement size={60} duration={8} top={25} left={85} />
      <FloatingElement size={30} duration={12} top={70} left={8} />
      <FloatingElement size={50} duration={9} top={75} left={88} />
      <FloatingElement size={35} duration={11} top={45} left={92} />

      {/* Elementi glitch per effetto errore */}
      <GlitchElement top={20} left={15} />
      <GlitchElement top={60} left={75} />
      <GlitchElement top={80} left={20} />

      <ContentWrapper>
        <ErrorContainer>
          <ErrorIcon>
            {renderMainIcon(faExclamationTriangle)}
          </ErrorIcon>
          
          <Title>Contenuto Non Trovato</Title>
          <Subtitle>
            Spiacenti, l'esperienza AR che stai cercando 
            non è più disponibile.
          </Subtitle>
        </ErrorContainer>

        <ReasonsList>
          <ReasonItem delay={0}>
            {renderIcon(faTrash)}
            <span>Il contenuto potrebbe essere stato eliminato</span>
          </ReasonItem>
          
          <ReasonItem delay={0.1}>
            {renderIcon(faSearch)}
            <span>L'identificativo non corrisponde a nessun elemento</span>
          </ReasonItem>
          
          <ReasonItem delay={0.2}>
            {renderIcon(faHome)}
            <span>Il progetto potrebbe essere stato rimosso</span>
          </ReasonItem>
        </ReasonsList>

        <SuggestionText>
          Verifica il link o contatta chi ti ha condiviso 
          questa esperienza per ottenere un nuovo collegamento.
        </SuggestionText>
      </ContentWrapper>
    </Container>
  );
}