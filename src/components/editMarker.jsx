import { createSignal, createEffect, onMount } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import { generateQRCodeForForMarker } from '@hooks/useQRCode';

import Header from '@components/Header';

import { Container, FitHeight, FitHeightScrollable, Title } from '@ui/smallElements'
import AnimatedBackground from "@ui/AnimatedBackground";
import InputField from '@ui/inputField';
import Button from '@ui/button';
import ButtonSecondary from '@ui/ButtonSecondary';
import Toggle from '@ui/toggle';
import Message from '@ui/Message';

import Fa from 'solid-fa';
import { faSave, faQrcode, faPuzzlePiece, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";





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

const ArButtonContainer = styled('div')`
    z-index: 1000;
    display: ${props => props.viewMode === VIEW_MODE.GAMES ? 'flex' : 'none'};
`;

const QrCodeContainer = styled(Motion.div)`
    /* height: 300px; */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
`;

const QrCodeImg = styled('img')`
        text-align: center;
        z-index: 99;
        width: 150px;
    `

const EditMarker = (props) => {

  const firebase = useFirebase();

  // const [saved, setSaved] = createSignal(props.marker.id ? true : false);
  const [id, setId] = createSignal(props.marker.id ?? null);
  const [name, setName] = createSignal(props.marker.name ?? null);
  const [games, setGames] = createSignal(props.marker.games ?? []);
  const [currentViewMode, setCurrentViewMode] = createSignal(VIEW_MODE.GAMES);

  let animateOnMount = true;

  onMount(() => {
    onMount(() => {
      console.log("ON MOUNT: EditMarker", props.marker);
    })
  })




  // update current marker (app.jsx)
  // --> it will cause a refresh of the page!
  // some tricky "animateOnMount" false/true to disable
  // the enter animations of the games
  const refreshPage = () => {
    animateOnMount = false;
    props.onMarkerUpdated(name(), games());
    setTimeout(() => {
      animateOnMount = true;
    }, 500)
  }


  /**
  * update marker name
  */
  const handleUpdateMarker = async () => {

    if (!id()) return;

    // update marker name on firestore
    if (name() !== props.marker.name) {
      await firebase.firestore.updateMarker(props.userId, props.marker.id, name());
      console.log("marker name updated")
    }

    refreshPage();
  }


  /**
  * save new marker
  */
  const handleSaveMarker = async () => {

    // create new marker on Firestore
    const newMarkerId = await firebase.firestore.addMarker(props.userId, name());

    // update current marker (app.jsx)
    props.onNewMarkerCreated(newMarkerId, name());

    // setSaved(true);
    setId(() => newMarkerId);
  }


  /**
 * Delete a marker,
 * both from firebase and its JSON from RealTime DB,
 * and go back to Home
 */
  const handleDeleteMarker = async () => {

    if (!id()) {
      return;
    }

    console.log("cancello da Firestore...")
    await firebase.firestore.deleteMarker(props.userId, id());

    if (props.marker.games.length > 0) {
      console.log("cancello dati realtime DB...")
      const path = `${props.userId}/${props.marker.id}`;
      await firebase.realtimeDb.deleteData(path);

      // return to Marker List
      props.onBack();
    }

    // return to Marker List
    else props.onBack();
  };


  /**
  * update game (enabled = true / false)
  */
  const handleUpdateGame = async (game) => {

    // update game on Firestore
    await firebase.firestore.updateGame(props.userId, props.marker.id, game.id, game.enabled);

    // refresh games()
    const updatedGames = [];
    for (let i = 0; i < games().length; i++) {
      if (games()[i].id === game.id) {
        updatedGames.push({ ...game });
      } else {
        updatedGames.push(games()[i]);
      }
    }
    setGames(updatedGames);

    refreshPage();
  }


  /**
  * delete game
  */
  const handleDeleteGame = async (game) => {

    // delete game on Firestore
    await firebase.firestore.deleteGame(props.userId, props.marker.id, game.id);

    // refresh games()
    setGames(prevGames => prevGames.filter(g => g.id !== game.id));

    refreshPage();
  }


  /**
  * download Qr Code
  */
  const handleDownloadQrCode = () => {
    console.log("download qr code") // TODO - download
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
    onMount(() => {
      console.log("ON MOUNT: GameItem");
    })
    const [game, setGame] = createSignal(props.game);

    const handleToggleGameEnabled = (value) => {

      // update game()
      setGame(prev => ({ ...prev, enabled: !value }));

      // wait for the animation of the toggle
      setTimeout(() => {

        // call handleUpdateGame
        handleUpdateGame(game());
      }, 250)
    };

    const GameItemContainer = styled(Motion.div)`
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
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
        animate={{
          backgroundColor: game().enabled
            ? "var(--color-dark-transparent)"
            : "var(--color-dark-transparent-dark)"
        }}
        transition={{
          backgroundColor: { duration: animateOnMount ? 0.25 : 0, easing: "ease-in-out" }
        }}
      >
        <ButtonSecondary
          onClick={() => handleDeleteGame(game())}
        >
          <Fa icon={faTrash} size="1x" class="icon" />
        </ButtonSecondary>
        <GameName
          enabled={game().enabled}
        >
          {game().name}
        </GameName>
        <Toggle
          checked={game().enabled}
          onChange={handleToggleGameEnabled}
        >
        </Toggle>
      </GameItemContainer>
    )
  }


  const dynamicView = () => {
    onMount(() => {
      console.log("ON MOUNT: dynamicView");

      if (id()) {

        // initialize 3D scene and AR button
        props.initScene();

        if (currentViewMode() === VIEW_MODE.QRCODE && games().length > 0) {

          // create qr code
          console.log("genero QR Code....")
          generateQRCodeForForMarker(props.userId, id());
        }
      }
    })

    switch (currentViewMode()) {
      case VIEW_MODE.GAMES:
        return (
          props.marker.games?.length === 0 ?
            <Message>
              Entra in AR e aggiungi dei componenti a questo ambiente. <br></br> <br></br>
              I componenti sono elementi 3D che scegli per costruire l'ambiente AR a tuo piacimento. Una volta ggiunti li vedrai elencati qui!
            </Message>

            :

            // THE LIST OF THE GAMES
            <FitHeightScrollable
              style={{ "margin-top": "2rem", "margin-bottom": "1rem" }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: animateOnMount ? 0.5 : 0, easing: "ease-in-out", delay: 0 }}
            >
              {
                props.marker.games?.map(game => (
                  <GameItem
                    game={game}
                  />
                ))
              }
            </FitHeightScrollable>
        )

      case VIEW_MODE.QRCODE:
        return (
          props.marker.games?.length === 0 ?
            <Message>
              Non posso darti un QR Code per questo ambiente perchè non hai ancora aggiunto nulla in AR.<br></br> Entra in AR e aggiungi qualcosa!
            </Message>
            :
            // TODO - here the QR Code (and the "Download button")
            <FitHeight>
              <QrCodeContainer

                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
              >
                <QrCodeImg id="qr-code" />
              </QrCodeContainer>
              <Message>
                Stampa il QR Code e fissalo su una superficie, per poter essere successivamente scansionato.
              </Message>
            </FitHeight>

        )
    }
  }





  return (
    <AnimatedBackground>
      <Container alignLeft={true}>

        {/* HEADER */}
        <Header
          onClickBack={props.onBack}
          onClickUser={props.goToUserProfile}
        />

        {/* TITLE */}
        <Title
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
        >
          <span style={{ color: 'var(--color-secondary)' }}>{id() ? 'Modifica' : 'Nuovo'} </span>
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
            onBlur={handleUpdateMarker()}
            required
          />

          {
            id() ?

              <FitHeightScrollable>

                {/* NAVIGATION */}
                <Navigation />

                {/* DYNAMIC VIEW */}
                {dynamicView()}


                {/* ENTER AR BUTTON */}
                <ArButtonContainer
                  id="ArButtonContainer"
                  viewMode={currentViewMode()}
                />

                {/* DOWNLOAD QR CODE BUTTON */}
                <Button
                  active={props.marker.games?.length > 0 ? true : false}
                  visible={currentViewMode() === VIEW_MODE.QRCODE ? true : false}
                  icon={faDownload}
                  onClick={handleDownloadQrCode}
                >Scarica QR Code</Button>

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