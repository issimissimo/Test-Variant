import { createSignal } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import { Container, Title } from '@ui/smallElements'
import InputField from '@ui/inputField';
import Button from '@ui/button';
import AnimatedBackground from "@ui/AnimatedBackground";

import Header from '@components/Header';

import Fa from 'solid-fa';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";


const Login = (props) => {

  const { auth } = useFirebase();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);


  const handleLogin = async (e) => {
    // e.preventDefault();
    if (!email() || !password()) {
      setError("Email e/o password non validi.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await auth.login({ email: email(), password: password() });
      setLoading(false);
      props.onSuccess();

    } catch (error) {
      let errorMessage = error.message;
      if (errorMessage.includes('invalid-credential')) {
        errorMessage = 'Email o password non validi';
      } else if (errorMessage.includes('wrong-password')) {
        errorMessage = 'Password errata';
      } else if (errorMessage.includes('too-many-requests')) {
        errorMessage = 'Troppi tentativi falliti. Riprova più tardi';
      } else if (errorMessage.includes('invalid-email')) {
        errorMessage = 'Formato email non valido';
      } else if (errorMessage.includes('user-disabled')) {
        errorMessage = 'Account disabilitato';
      }
      setError(errorMessage);
      setLoading(false);
    }
  };




  const Form = styled(Motion.Form)`
    width: 100%;
    margin: 2rem auto;
    flex: 1;
  `;


  // Clear error on any input focus
  const handleInputFocus = () => setError("");


  return (
    <AnimatedBackground>
      <Container>

        {/* HEADER */}
        <Header
          showBack={false}
          showUser={false}
        />

        {/* TITLE */}
        <Title
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
        >
          <span style={{ color: 'var(--color-secondary)' }}>Accedi </span>
          <span style={{ color: 'var(--color-white)' }}>al tuo spazio AR</span>
        </Title>

        <Form
          onSubmit={handleLogin}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, easing: "ease-in-out", delay: 0.25 }}
        >
          <InputField
            style={{ 'margin-top': '1rem' }}
            type="email"
            name="email"
            label="Email"
            value={email()}
            onInput={e => setEmail(e.target.value)}
            autoComplete="email"
            required
            error={error()}
            data-error={!!error()}
            onFocus={handleInputFocus}
          />
          <InputField
            style={{ 'margin-top': '2rem' }}
            type="password"
            name="password"
            label="Password"
            value={password()}
            onInput={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            error={error()}
            data-error={!!error()}
            onFocus={handleInputFocus}
          />
        </Form>

        <Button
          onClick={handleLogin}
          style={{ "margin-top": "2em" }}
          active={true}
        >
          {loading() ? 'Accesso in corso...' : 'Accedi'}
        </Button>

        <Button
          onClick={props.onGoToRegister}
          style={{ "margin-top": "30px" }}
          grey={true}
          icon={faChevronRight}
          border={false}
        >Oppure registrati
        </Button>
      </Container>
    </AnimatedBackground>
  );
}
export default Login;