import { createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { faUserPlus, faLock, faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
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
} from './ui/ui';

export default function ARRegisterScreen(props) {
  const { auth } = useFirebase();

  // Stato del form
  const [form, setForm] = createSignal({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Segnali per la visibilità delle password
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

  // Stato per messaggi di errore/successo
  const [message, setMessage] = createSignal({ type: '', text: '' });
  const [loading, setLoading] = createSignal(false);

  // Gestione input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Gestione submit
  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // Validazione campi obbligatori
    if (!form().email || !form().password || !form().confirmPassword) {
      setMessage({ type: 'error', text: 'Tutti i campi sono obbligatori' });
      return;
    }

    // Validazione password
    if (form().password !== form().confirmPassword) {
      setMessage({ type: 'error', text: 'Le password non corrispondono' });
      return;
    }

    if (form().password.length < 6) {
      setMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      return;
    }

    setLoading(true);

    try {
      await auth.register(form());

      setMessage({
        type: 'success',
        text: 'Registrazione completata!'
      });

      setTimeout(() => {
        if (props.onSuccess) props.onSuccess();
      }, 2000);
    } catch (error) {
      let errorMessage = error.message;

      // Gestione errori personalizzata
      if (errorMessage.includes('email-already-in-use')) {
        errorMessage = 'Questo indirizzo email è già registrato';
      } else if (errorMessage.includes('invalid-email')) {
        errorMessage = 'Indirizzo email non valido';
      } else if (errorMessage.includes('weak-password')) {
        errorMessage = 'La password è troppo debole';
      }

      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    props.onGoToLogin?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword());
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container>
      <BackgroundPattern/>

      <Card>
        <Header>
          <Logo>
            {renderIcon(faUserPlus, LogoIcon)}
          </Logo>
          <Title>Registrati</Title>
          {/* <Subtitle>Unisciti alla community AR</Subtitle> */}
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
              {renderIcon(faEnvelope)}
              <Input
                type="email"
                name="email"
                placeholder="inserisci la tua email"
                value={form().email}
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                autocomplete="username"
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
                placeholder="crea una password (min. 6 caratteri)"
                value={form().password}
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                autocomplete="new-password"
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

          <InputGroup>
            <InputLabel>Conferma Password</InputLabel>
            <InputWrapper>
              {renderIcon(faLock)}
              <Input
                type={showConfirmPassword() ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="conferma la tua password"
                value={form().confirmPassword}
                onInput={handleInput}
                onKeyPress={handleKeyPress}
                autocomplete="new-password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword() ? 'Nascondi password' : 'Mostra password'}
              >
                {renderIcon(showConfirmPassword() ? faEyeSlash : faEye, PasswordToggleIcon)}
              </PasswordToggle>
            </InputWrapper>
          </InputGroup>

          <Button
            onClick={handleSubmit}
            disabled={loading() || !form().email || !form().password || !form().confirmPassword}
            mode={BUTTON_MODE.PRIMARY}
          >
            {loading() ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
        </Form>

        <Section>
          <SectionText>Hai già un account?</SectionText>
          <Button onClick={handleGoToLogin} mode={BUTTON_MODE.SECONDARY}>
            Accedi
          </Button>
        </Section>
      </Card>
    </Container>
  );
}