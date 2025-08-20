import { onMount, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { faMobileAlt, faSadCry } from '@fortawesome/free-solid-svg-icons';
import { init } from '@hooks/useQRCode';

import { Container, Title } from '@components/smallElements'
import Message from '@components/Message';

import Fa from 'solid-fa';


export default function ARUnsupported() {
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
    init();
  });

  const renderQRIcon = () => {
    return (
      <QRImage id="qr-code" />
    );
  };

  return (
    <Container>
      <Message
        icon={faSadCry}
      >
        Purtroppo questo dispositivo non è compatibile per questa app! <br></br>
        Scansiona il Qr Code con un dispositivo compatibile per vivere
        l'esperienza di realtà aumentata completa.
      </Message>

      {/* <div>
        {renderQRIcon()}
      </div> */}

    </Container>
  );
}