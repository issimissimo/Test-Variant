import { createSignal, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';

import Header from '@components/Header';

import { Container, FitHeight, FitHeightScrollable, Title } from '@ui/smallElements'
import AnimatedBackground from "@ui/AnimatedBackground";
import InputField from '@ui/inputField';
import Button from '@ui/button';
import ButtonSecondary from '@ui/ButtonSecondary';
import Toggle from '@ui/toggle';
import Message from '@ui/Message';

import Fa from 'solid-fa';
import { faSave, faQrcode, faPuzzlePiece, faTrash } from "@fortawesome/free-solid-svg-icons";




const VIEW_MODE = {
  QRCODE: "qrCode",
  GAMES: "games",
}

const NavigationContainer = styled(Motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 35px;
    color: var(--color-primary);
  `;

const NavigationButtonContainer = styled('div')`
    flex: 1;
    display: flex;
    justify-content: center;
  `;

const NavigationButton = styled(Motion.div)`
    width: 50px;
    height: 30px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
`;

const BorderBottomBar = styled(Motion.div)`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: var(--color-primary);
    transform-origin: left;
`;





const EditMarker = (props) => {

  const [saved, setSaved] = createSignal(true);
  const [name, setName] = createSignal(props.name ?? null);
  const [currentViewMode, setCurrentViewMode] = createSignal(VIEW_MODE.GAMES);
  const [empty, setEmpty] = createSignal(false);


  const handleDeleteMarker = () => {
    console.log("DELETE MARKER")
  }

  const handleSaveMarker = () => {
    setSaved(() => true);
    console.log("SAVE MARKER")
  }


  const Navigation = () => {
    return (
      <NavigationContainer
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
      >
        <NavigationButtonContainer>
          <NavigationButton
            selected={currentViewMode() === VIEW_MODE.GAMES ? true : false}
            onClick={() => setCurrentViewMode(VIEW_MODE.GAMES)}
            animate={{ scale: currentViewMode() === VIEW_MODE.GAMES ? 1.1 : 0.9 }}
            transition={{ duration: 0.3, easing: "ease-in-out" }}
          >
            <Fa icon={faPuzzlePiece} size="1.4x" class="icon" />
            <BorderBottomBar
              animate={{ scaleX: currentViewMode() === VIEW_MODE.GAMES ? 1 : 0 }}
              transition={{ duration: 0.3, easing: "ease-in-out" }}
              initial={false}
            />
          </NavigationButton>
        </NavigationButtonContainer>
        <NavigationButtonContainer>
          <NavigationButton
            selected={currentViewMode() === VIEW_MODE.QRCODE ? true : false}
            onClick={() => setCurrentViewMode(VIEW_MODE.QRCODE)}
            animate={{ scale: currentViewMode() === VIEW_MODE.QRCODE ? 1.1 : 0.9 }}
            transition={{ duration: 0.3, easing: "ease-in-out" }}
          >
            <Fa icon={faQrcode} size="1.4x" class="icon" />
            <BorderBottomBar
              animate={{ scaleX: currentViewMode() === VIEW_MODE.QRCODE ? 1 : 0 }}
              transition={{ duration: 0.3, easing: "ease-in-out" }}
              initial={false}
            />
          </NavigationButton>
        </NavigationButtonContainer>
        <NavigationButtonContainer>
          <ButtonSecondary onClick={handleDeleteMarker}>
            Elimina
            <Fa icon={faTrash} size="1x" translateX={0.5} class="icon" />
          </ButtonSecondary>
        </NavigationButtonContainer>
      </NavigationContainer>
    )
  }


  const GameItem = (props) => {

    const [enabled, setEnabled] = createSignal(props.enabled ?? true);

    const handleEnableGame = (value) => {
      setEnabled(() => !value);
    };


    const GameItemContainer = styled(Motion.div)`
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            background-color: ${props => props.enabled ? "var(--color-dark-transparent)" : "var(--color-dark-transparent-dark)"};
            box-sizing: border-box;
            padding: 0.3rem;
            margin-bottom: 1rem;
            border-radius: 20px;
        `;


    const GameName = styled('p')`
            font-size: small;
            padding-left: 1rem;
            margin: 0;
            color: ${props => props.enabled ? "var(--color-white)" : "var(--color-grey-dark)"};
            flex: 1;
        `;



    return (
      <GameItemContainer
        class="glass"
        enabled={enabled()}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5, easing: "ease-in-out", delay: 0.25 }}
      >
        <ButtonSecondary>
          <Fa icon={faTrash} size="1x" class="icon" />
        </ButtonSecondary>
        <GameName
          enabled={enabled()}>
          {props.name}
        </GameName>
        <Toggle
          checked={props.enabled}
          onChange={handleEnableGame}
        >
        </Toggle>
      </GameItemContainer>
    )
  }


  const dynamicView = () => {
    switch (currentViewMode()) {
      case VIEW_MODE.GAMES:
        return (
          empty() ?
            <Message>
              Entra in AR e aggiungi dei componenti a questo ambiente. <br></br> <br></br>
              I componenti sono elementi 3D che scegli per costruire l'ambiente AR a tuo piacimento. Una volta ggiunti li vedrai elencati qui!
            </Message>
            :
            // TODO - here the list of the games (and the "ENTER AR button")
            <FitHeightScrollable
              style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}
            >

              <GameItem
                name={"Pippolo"}
                enabled={true}
              />
              <GameItem
                name={"Pippolo"}
                enabled={true}
              />
              <GameItem
                name={"Pippolo"}
                enabled={true}
              />
            </FitHeightScrollable>


        )

      case VIEW_MODE.QRCODE:
        return (
          empty() ?
            <Message>
              Non posso darti un QR Code per questo ambiente perchè non hai ancora aggiunto nulla in AR.<br></br> Entra in AR e aggiungi qualcosa!
            </Message>
            :
            // TODO - here the QR Code (and the "Download button")
            <FitHeight>

            </FitHeight>

        )
    }
  }





  return (
    <AnimatedBackground>
      <Container alignLeft={true}>

        {/* HEADER */}
        <Header showBack={true} />

        {/* TITLE */}
        <Title
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
        >
          <span style={{ color: 'var(--color-secondary)' }}>Nuovo </span>
          <span style={{ color: 'var(--color-white)' }}>ambiente AR </span>
        </Title>


        <FitHeightScrollable
          style={{ "padding-top": "3rem" }}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, easing: "ease-in-out", delay: 0.25 }}
        >

          {/* INPUT NAME */}
          <InputField
            type="none"
            name="none"
            label="Nome"
            value={name()}
            onInput={e => setName(e.target.value)}
            required
          />

          {
            saved() ?

              <FitHeightScrollable>

                {/* NAVIGATION */}
                <Navigation />

                {/* DYNAMIC VIEW */}
                {dynamicView()}

                {/* ENTER AR BUTTON */}
                <Button active={true}>Enter AR</Button>

              </FitHeightScrollable>

              :

              <FitHeight>
                <Message>
                  Dai un nome al tuo ambiente in AR che si riferisca al luogo in cui lo creerai, ad esempio 'salotto',
                  o alla scena in AR che implementarai, ad esempio 'ping pong da tavolo'.<br></br><br></br>
                  Il nome è totalmente arbitrario, ma ti auiterà a ricordare a cosa si riferisce.
                </Message>
                <Button
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
                  active={name() ? true : false}
                  icon={faSave}
                  onClick={handleSaveMarker}
                >Salva</Button>
              </FitHeight>
          }





        </FitHeightScrollable>

      </Container>
    </AnimatedBackground>
  )
}

export default EditMarker