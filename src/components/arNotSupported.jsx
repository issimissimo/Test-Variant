import { onMount, createSignal } from 'solid-js';
import { styled, keyframes } from 'solid-styled-components';
import { faMobileAlt, faQrcode, faDesktop, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import { init } from '../hooks/useQRCode';


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
    transform: translateY(-8px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 20px 40px rgba(108, 117, 125, 0.2);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 25px 50px rgba(108, 117, 125, 0.3);
  }
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

// Styled Components
const Container = styled('div')`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%);
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
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  animation: ${float} 20s ease-in-out infinite;
`;

const ContentWrapper = styled('div')`
  text-align: center;
  z-index: 2;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled('div')`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const InfoIcon = styled('div')`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(45deg, #6c757d, #495057);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 3s ease-in-out infinite;
  box-shadow: 
    0 15px 30px rgba(108, 117, 125, 0.3),
    0 0 0 1px rgba(255,255,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    background: linear-gradient(45deg, #5a6268, #3d4246);
    border-radius: 22px;
    z-index: -1;
  }
`;

const IconSVG = styled('svg')`
  width: 50px;
  height: 50px;
  fill: white;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
`;

const Title = styled('h1')`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  animation: ${fadeInUp} 1s ease-out 0.2s both;
  
  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const Subtitle = styled('p')`
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-weight: 300;
  animation: ${fadeInUp} 1s ease-out 0.4s both;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const QRSection = styled('div')`
  margin: 2rem 0;
  animation: ${fadeInScale} 1s ease-out 0.6s both;
`;

const QRContainer = styled('div')`
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef, #dee2e6, #ced4da);
  background-size: 400% 400%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${shimmer} 3s ease-in-out infinite;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.2),
    inset 0 1px 0 rgba(255,255,255,0.8);
  border: 2px solid rgba(255,255,255,0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    background: white;
    border-radius: 16px;
    z-index: 1;
  }
  
  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
  }
`;

const QRPlaceholder = styled('div')`
  position: relative;
  z-index: 2;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;


const InstructionText = styled('p')`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.75);
  margin: 1rem 0 0 0;
  line-height: 1.5;
  font-weight: 400;
  animation: ${fadeInUp} 1s ease-out 1.6s both;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FloatingElement = styled('div')`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  z-index: 1;
`;

export default function ARUnsupported() {
    const [mounted, setMounted] = createSignal(false);

    onMount(() => {
        setMounted(true);
        init();
    });

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

    const renderQRIcon = () => {
        return (
            <img id="qr-code" />
        );
    };

    return (
        <Container>
            <BackgroundPattern />

            {/* Elementi fluttuanti decorativi */}
            <FloatingElement size={45} duration={12} top={15} left={10} />
            <FloatingElement size={35} duration={15} top={25} left={85} />
            <FloatingElement size={55} duration={9} top={70} left={8} />
            <FloatingElement size={40} duration={11} top={75} left={88} />
            <FloatingElement size={30} duration={13} top={45} left={92} />

            <ContentWrapper>
                <HeaderSection>
                    <InfoIcon>
                        {renderMainIcon(faMobileAlt)}
                    </InfoIcon>

                    <Title>AR Non Supportata</Title>
                    <Subtitle>
                        Questo dispositivo non supporta la realtà aumentata.
                    </Subtitle>
                </HeaderSection>

                <QRSection>
                    <QRContainer>
                        <QRPlaceholder>
                            {renderQRIcon()}
                        </QRPlaceholder>
                    </QRContainer>
                </QRSection>

                {/* <DevicesList>
                    <DeviceItem delay={0}>
                        {renderIcon(faMobileAlt)}
                        <span>Smartphone con AR supportata</span>
                    </DeviceItem>

                    <DeviceItem delay={0.1}>
                        {renderIcon(faTabletAlt)}
                        <span>Tablet moderni con sensori avanzati</span>
                    </DeviceItem>

                    <DeviceItem delay={0.2}>
                        {renderIcon(faDesktop)}
                        <span>Dispositivi con fotocamera e accelerometro</span>
                    </DeviceItem>
                </DevicesList> */}

                <InstructionText>
                    Scansiona con un dispositivo compatibile per vivere
                    l'esperienza di realtà aumentata completa.
                </InstructionText>
            </ContentWrapper>
        </Container>
    );
}