import { createSignal, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { styled, keyframes } from 'solid-styled-components';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Animazioni keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
    transform: translateY(-5px);
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
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 2px, transparent 2px);
  background-size: 40px 40px;
  animation: ${float} 15s ease-in-out infinite;
`;

const LoginCard = styled('div')`
  /* background: rgba(255, 255, 255, 0.1); */
  /* backdrop-filter: blur(10px); */
  /* border-radius: 20px; */
  /* padding: 2rem; */
  width: 85%;
  max-width: 400px;
  /* box-shadow: 
    0 20px 40px rgba(0,0,0,0.1),
    0 0 0 1px rgba(255,255,255,0.2); */
  animation: ${fadeInUp} 0.8s ease-out;
  color: white;
  z-index: 999;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Header = styled('div')`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled('div')`
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

const LogoIcon = styled('svg')`
  width: 30px;
  height: 30px;
  fill: white;
`;

const Title = styled('h1')`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled('p')`
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
`;

const Form = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled('div')`
  position: relative;
`;

const InputLabel = styled('label')`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled('input')`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 2px solid #e9ecef;
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

const InputIcon = styled('svg')`
  position: absolute;
  left: 0.75rem;
  width: 18px;
  height: 18px;
  fill: #6c757d;
  z-index: 2;
  pointer-events: none;
`;

const PasswordToggle = styled('button')`
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
  
  &:hover {
    background-color: rgba(0,0,0,0.05);
  }
`;

const PasswordToggleIcon = styled('svg')`
  width: 18px;
  height: 18px;
  fill: #6c757d;
`;

const LoginButton = styled('button')`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: 2px solid;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled('div')`
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

const RegisterSection = styled('div')`
  text-align: center;
`;

const RegisterText = styled('p')`
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
`;

const RegisterButton = styled('button')`
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff83;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
  }
`;

const ErrorMessage = styled('div')`
  background: #fee;
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #dc3545;
`;

const SuccessMessage = styled('div')`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #28a745;
`;

export default function ARLoginScreen(props) {
  // Hook Firebase
  const { auth } = useFirebase();

  // Segnali per i form (strutturati come nel backup)
  const [form, setForm] = createSignal({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal({ type: '', text: '' });

  // Funzione per renderizzare icone SVG
  const renderIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;

    return (
      <InputIcon viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </InputIcon>
    );
  };

  const renderPasswordToggleIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;

    return (
      <PasswordToggleIcon viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </PasswordToggleIcon>
    );
  };

  const renderLogoIcon = (iconDefinition) => {
    const { icon } = iconDefinition;
    const [width, height, , , svgPathData] = icon;

    return (
      <LogoIcon viewBox={`0 0 ${width} ${height}`}>
        {Array.isArray(svgPathData) ? (
          svgPathData.map((path, index) => (
            <path key={index} d={path} />
          ))
        ) : (
          <path d={svgPathData} />
        )}
      </LogoIcon>
    );
  };

  // Handler per l'input (adattato dal backup)
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handler per il login (adattato dal backup)
  const handleLogin = async () => {
    const currentForm = form();

    if (!currentForm.email || !currentForm.password) {
      setMessage({ type: 'error', text: 'Tutti i campi sono obbligatori' });
      return;
    }

    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      // Login usando la stessa logica del backup
      await auth.login(currentForm);

      // Notifica l'App di navigare verso la home (come nel backup)
      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      let errorMessage = error.message;

      // Gestione errori personalizzata (dal backup)
      if (errorMessage.includes('user-not-found')) {
        errorMessage = 'Utente non trovato';
      } else if (errorMessage.includes('wrong-password')) {
        errorMessage = 'Password errata';
      } else if (errorMessage.includes('too-many-requests')) {
        errorMessage = 'Troppi tentativi falliti. Riprova più tardi';
      } else if (errorMessage.includes('invalid-email')) {
        errorMessage = 'Formato email non valido';
      } else if (errorMessage.includes('user-disabled')) {
        errorMessage = 'Account disabilitato';
      }

      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Passa alla schermata di registrazione
    props.onGoToRegister?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container>
      <BackgroundPattern/>

      <LoginCard>
        <Header>
          <Logo>
            {renderLogoIcon(faUser)}
          </Logo>
          <Title>Accedi</Title>
          <Subtitle>Benvenuto nella tua esperienza AR</Subtitle>
        </Header>

        <Form>
          {/* Messaggio di errore o successo */}
          {message().text && (
            <>
              {message().type === 'error' && (
                <ErrorMessage>{message().text}</ErrorMessage>
              )}
              {message().type === 'success' && (
                <SuccessMessage>{message().text}</SuccessMessage>
              )}
            </>
          )}

          <InputGroup>
            <InputLabel>Email</InputLabel>
            <InputWrapper>
              {renderIcon(faUser)}
              <Input
                type="email"
                name="email"
                placeholder="inserisci la tua email"
                value={form().email}
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                autocomplete="email"
                required
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <InputLabel>Password</InputLabel>
            <InputWrapper>
              {renderIcon(faLock)}
              <Input
                type={showPassword() ? 'text' : 'password'}
                name="password"
                placeholder="inserisci la tua password"
                value={form().password}
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                autocomplete="current-password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword() ? 'Nascondi password' : 'Mostra password'}
              >
                {renderPasswordToggleIcon(showPassword() ? faEyeSlash : faEye)}
              </PasswordToggle>
            </InputWrapper>
          </InputGroup>

          <LoginButton id="loginButton"
            onClick={handleLogin}
            disabled={loading() || !form().email || !form().password}
          >
            {loading() ? 'Accesso in corso...' : 'Accedi'}
          </LoginButton>
        </Form>

        <Divider>
          <span>oppure</span>
        </Divider>

        <RegisterSection>
          <RegisterText>Non hai ancora un account?</RegisterText>
          <RegisterButton onClick={handleRegister}>
            Registrati
          </RegisterButton>
        </RegisterSection>
      </LoginCard>
    </Container>
  );
}