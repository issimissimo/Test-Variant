import { createSignal, onMount } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  BackgroundPattern,
  Card,
  Header,
  Logo,
  LogoIcon,
  Title,
  Subtitle,
  Form,
  InputGroup,
  InputLabel,
  InputWrapper,
  Input,
  InputIcon,
  PasswordToggle,
  PasswordToggleIcon,
  ErrorMessage,
  SuccessMessage,
  Divider,
  Section,
  SectionText,
  Button,
  BUTTON_MODE,
  renderIcon
} from '@/ui';

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

      <Card>
        <Header>
          <Logo>
            {renderIcon(faUser, LogoIcon)}
          </Logo>
          <Title>Benvenuto in AR</Title>
          {/* <Subtitle>Benvenuto nella tua esperienza AR</Subtitle> */}
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
                {renderIcon(showPassword() ? faEyeSlash : faEye, PasswordToggleIcon)}
              </PasswordToggle>
            </InputWrapper>
          </InputGroup>

          <Button
            id="loginButton"
            onClick={handleLogin}
            disabled={loading() || !form().email || !form().password}
            mode={BUTTON_MODE.PRIMARY}
          >
            {loading() ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </Form>

        {/* <Divider>
          <span>oppure</span>
        </Divider> */}

        <Section>
          <SectionText>Non hai ancora un account?</SectionText>
          <Button onClick={handleRegister} mode={BUTTON_MODE.SECONDARY}>
            Registrati
          </Button>
        </Section>
      </Card>
    </Container>
  );
}