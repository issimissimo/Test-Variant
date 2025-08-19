import { createSignal } from 'solid-js';
import { useFirebase } from '@hooks/useFirebase';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import { Container, Title } from '@ui/smallElements'
import InputField from '@ui/inputField';
import Button from '@ui/button';
import AnimatedBackground from "@ui/AnimatedBackground";

import Header from '@components/Header';

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";


// --- Example Usage ---
function Register() {
  // State for email and password
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  // Simulate error (replace with real logic)
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email() || !password()) {
      setError("Email e/o password non validi.");
    } else {
      setError("");
      // ...login logic...
    }
  };


  const Form = styled(Motion.Form)`
    width: 100%;
    margin: 2rem auto;
  `;


  // Clear error on any input focus
  const handleInputFocus = () => setError("");

  return (
    <AnimatedBackground>
      <Container>
        <Title
          color={'var(--color-secondary)'}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 1, easing: "ease-in-out", delay: 0 }}
        > Registrazione </Title>


        <Form
          onSubmit={handleLogin}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 1, easing: "ease-in-out", delay: 0.5 }}
        >
          <InputField
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
          <InputField
            type="password"
            name="password"
            label="Ripeti password"
            value={password()}
            onInput={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            error={error()}
            data-error={!!error()}
            onFocus={handleInputFocus}
          />

          <Button
            style={{ "margin-top": "2em" }}
            active={true}
          >Registrati
          </Button>

          <Button
            style={{ "margin-top": "30px" }}
            grey={true}
            icon={faChevronRight}
            border={false}
          >Oppure accedi
          </Button>

        </Form>
      </Container>
    </AnimatedBackground>
  );
}
export default Register;