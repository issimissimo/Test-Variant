import { onMount, createSignal } from 'solid-js';
import { styled, keyframes } from 'solid-styled-components';
import { faCube, faEye, faMobileAlt, faStar } from '@fortawesome/free-solid-svg-icons';


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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const Container = styled('div')`
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

const BackgroundPattern = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  animation: ${float} 20s ease-in-out infinite;
`;

const ContentWrapper = styled('div')`
  text-align: center;
  z-index: 2;
  max-width: 400px;
  width: 100%;
`;

const LogoContainer = styled('div')`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const ARIcon = styled('div')`
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${shimmer} 3s ease-in-out infinite, ${pulse} 2s ease-in-out infinite;
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.2),
    0 0 0 1px rgba(255,255,255,0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 26px;
    z-index: -1;
  }
`;

const IconSVG = styled('svg')`
  width: 60px;
  height: 60px;
  fill: white;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  animation: ${rotate} 10s linear infinite;
`;

const Title = styled('h1')`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled('p')`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-weight: 300;
  animation: ${fadeInUp} 1s ease-out 0.4s both;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const FeaturesList = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
`;

const FeatureItem = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: 400;
  animation: ${fadeInUp} 1s ease-out ${props => 0.6 + props.delay}s both;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FeatureIcon = styled('svg')`
  width: 20px;
  height: 20px;
  fill: #4ecdc4;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
`;

const LoadingDots = styled('div')`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
  animation: ${fadeInUp} 1s ease-out 1.2s both;
`;

const Dot = styled('div')`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.7);
  animation: ${pulse} 1.5s ease-in-out ${props => props.delay}s infinite;
`;

const FloatingElement = styled('div')`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 1;
`;

export default function Welcome() {
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
  });

  // Funzione per renderizzare icone SVG
  const renderIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;
    
    return (
      <FeatureIcon viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </FeatureIcon>
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
    <Container id="test">
      <BackgroundPattern />
      
      {/* Elementi fluttuanti decorativi */}
      <FloatingElement size={60} duration={8} top={15} left={10} />
      <FloatingElement size={40} duration={12} top={25} left={85} />
      <FloatingElement size={80} duration={6} top={70} left={5} />
      <FloatingElement size={50} duration={10} top={75} left={90} />
      <FloatingElement size={30} duration={14} top={50} left={95} />

      <ContentWrapper>
        <LogoContainer>
          <ARIcon>
            {renderMainIcon(faCube)}
          </ARIcon>
          
          <Title>AR Experience</Title>
          <Subtitle>
            Immergiti in una nuova dimensione digitale. 
            La realtà aumentata ti aspetta.
          </Subtitle>
        </LogoContainer>

        <FeaturesList>
          <FeatureItem delay={0}>
            {renderIcon(faEye)}
            <span>Visualizzazione immersiva</span>
          </FeatureItem>
          
          <FeatureItem delay={0.1}>
            {renderIcon(faMobileAlt)}
            <span>Ottimizzato per mobile</span>
          </FeatureItem>
          
          <FeatureItem delay={0.2}>
            {renderIcon(faStar)}
            <span>Effetti realistici</span>
          </FeatureItem>
        </FeaturesList>

        <LoadingDots>
          <Dot delay={0} />
          <Dot delay={0.2} />
          <Dot delay={0.4} />
        </LoadingDots>
      </ContentWrapper>
    </Container>
  );
}