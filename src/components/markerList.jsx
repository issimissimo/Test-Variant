import { createEffect, createSignal } from 'solid-js';
import { useFirebase } from '../hooks/useFirebase';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';

import Header from '@components/Header';

import { Container, FitHeightScrollable, Title2 } from '@ui/smallElements'
import AnimatedBackground from '@ui/AnimatedBackground';
import Button from '@ui/button';
import Message from '@ui/Message';
import Spinner from '@ui/Spinner';

import Fa from 'solid-fa';
import { faPlus, faEdit, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";




//
// STATISTICS
//

const StatisticsContainer = styled('div')`
    box-sizing: border-box;
    display: flex;
    width: 20%;
    border: none;
    background: #458dfa28;
    border-color: var(--color-secondary);
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.5rem;
  `;


const Statistic = (props) => {
  return (
    <StatisticsContainer>
      <Fa icon={props.icon} size="1x" translateX={-0.5} class="icon" />
      {props.children}
    </StatisticsContainer>
  )
}




//
// MARKER
//

const MarkerContainer = styled(Motion.div)`
    margin-top: 2rem;
  `;

const TimestampContainer = styled('div')`
  `;

const Timestamp = styled('p')`
    font-size: 0.7rem;
    color: var(--color-grey);
    margin: 0;
    font-weight: 500;
  `;

const NameContainer = styled('div')`
    box-sizing: border-box;
    color: var(--color-white);
    width: fit-content;
  `;

const Name = styled('p')`
    font-weight: 400;
    margin: 0;
    margin-top: 0.3rem;
  `;

const BottomContainer = styled('div')`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.5rem;
  `;

const EditButtonContainer = styled('div')`
    box-sizing: border-box;
    display: flex;
    width: 50%;
  `;


const Marker = (props) => {

  const handleModifyMarker = () => {
    console.log("MODIFY MARKER")
  };

  return (
    <MarkerContainer
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, easing: "ease-in-out", delay: props.delay }}
    >

      <TimestampContainer>
        <Timestamp>{props.timestamp}</Timestamp>
      </TimestampContainer>

      <NameContainer class='glass'>
        <Name>{props.name}</Name>
      </NameContainer>


      <BottomContainer>
        <Statistic icon={faEye}>10</Statistic>
        <Statistic icon={faThumbsUp}>2</Statistic>
        <EditButtonContainer>
          <Button
            active={true}
            small={true}
            onClick={handleModifyMarker}
          >Modifica
            <Fa icon={faEdit} size="1x" translateX={1} class="icon" />
          </Button>
        </EditButtonContainer>
      </BottomContainer>
    </MarkerContainer>
  )
};






//
// MARKERLIST
//


const TitleContainer = styled('div')`
    margin-top: 1em;
    margin-bottom: 1em;
  `;

const MarkersListContainer = styled('div')`
    width: 100%;
    flex: 1;
    overflow-y: auto;
    margin-bottom: 2rem;
  `;


const MarkersList = (props) => {

  const [empty, setEmpty] = createSignal(false);
  const [loading, setLoading] = createSignal(false);


  const handleCreateNewMarker = () => {
    console.log("CREATE NEW MARKER")
  }


  return (
    <AnimatedBackground>
      <Container alignLeft={true}>

        {/* HEADER */}
        <Header />

        {/* TITLE */}
        <TitleContainer>
          <Title2
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
          >
            <span style={{ color: 'var(--color-secondary)' }}>I tuoi </span>
            <span style={{ color: 'var(--color-white)' }}>ambienti AR</span>
          </Title2>
        </TitleContainer>

        {/* CONTENT */}


        {loading() ?

          <Spinner> Carico... </Spinner>

          :

          <FitHeightScrollable id="FitHeight"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.5, easing: "ease-in-out", delay: 0.25 }}
          >
            {empty() ?

              <Message>
                Non hai ancora nessun ambiente.<br></br> Inizia creandone uno<br></br><br></br>
                Un ambiente AR è uno spazio fisico intorno a te in cui inserirai oggetti virtuali in realtà aumentata,<br></br>
                per essere visualizzati da altri nello stesso luogo.
              </Message>

              :

              <MarkersListContainer id="MarkersListContainer">
                <Marker
                  timestamp={'11/12/22 - 15.11'}
                  name={'Primo marker di prova'}
                  delay={0.25}
                />
                <Marker
                  timestamp={'11/12/22 - 15.11'}
                  name={'Primo marker di prova'}
                  delay={0.25}
                />
              </MarkersListContainer>
            }

            {/* CREATE BUTTON */}
            <Button
              active={true}
              icon={faPlus}
              border={empty() ? true : false}
              onClick={handleCreateNewMarker}
            >Crea nuovo
            </Button>
          </FitHeightScrollable>

        }
      </Container>
    </AnimatedBackground>
  );
};

export default MarkersList;


// export default function MarkerList(props) {


//   //#region [constants]
//   const firebase = useFirebase();
//   const [markers, setMarkers] = createSignal([]);


//   //#region [lifeCycle]
//   createEffect(() => {
//     if (firebase.auth.authLoading() || !firebase.auth.user()) return;
//     loadMarkers();
//   });


//   //#region [functions]
//   /**
//   * Load all markers from Firestore
//   */
//   const loadMarkers = async () => {
//       const data = await firebase.firestore.fetchMarkers(firebase.auth.user().uid);
//       setMarkers(data);
      
//       // Hide the preloader
//       props.setLoading(false);
//   };


//   const handleLogout = async () => {
//     try {
//       await firebase.auth.logout();
//       if (props.onLogout) props.onLogout();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };


//   //#region [style]
//   const Container = styled('div')`
//         max-width: 28rem;
//         margin: 0 auto;
//         box-sizing: border-box;
//         padding: 1.5rem;
//         display: flex;
//         flex-direction: column;
//         margin: 0 auto;
//         border-radius: 0.5rem;
//         height: 100%;
//     `

//   const Item = styled('div')`
//         padding: 0.75rem;
//         background-color: #f9fafb;
//         border: 1px solid #e5e7eb;
//         border-radius: 0.375rem;
//         margin-bottom: 0.5rem;
//         cursor: pointer;
//         transition: background-color 0.2s;
//         color: black;
        
//         &:hover {
//           background-color: #f3f4f6;
//   }
//     `

//   const AddNewContainer = styled('div')`
//         position: absolute;
//         bottom: 50px;
//         left: 40px;
//         right: 40px;
//         /* width: 100%; */
//     `




//   //#region [return]
//   return (
//     <Container id="markerList">

//       {firebase.auth.authLoading() ? (
//         <div>
//           <p>Verifica autenticazione in corso...</p>
//         </div>
//       ) : !firebase.auth.user() ? (
//         <div>
//           <p>Non sei autenticato.</p>
//           <div>
//             <button
//               onClick={props.onGoToLogin}

//             >
//               Accedi
//             </button>
//             <button
//               onClick={props.onGoToRegister}

//             >
//               Registrati
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div>
//           <div>
//             <p><strong>Email:</strong> {firebase.auth.user().email}</p>
//             {/* {userData() && userData().lastLogin && (
//               <p>
//                 <strong>Ultimo accesso:</strong> {userData().lastLogin.toLocaleString()}
//               </p>
//             )}
//             {userData() && userData().created && (
//               <p>
//                 <strong>Account creato:</strong> {userData().created.toLocaleString()}
//               </p>
//             )} */}
//             <button
//               onClick={handleLogout}

//             >
//               Logout
//             </button>
//           </div>

//           <div>


//             <div>
//               <h3>I tuoi marker</h3>
//               {markers().length === 0 ? (
//                 <p>Nessun elemento presente</p>
//               ) : (
//                 markers().map(marker => (
//                   <Item
//                     onClick={() => {
//                       props.onMarkerClicked(marker)
//                     }}
//                   >
//                     {marker.name}
//                   </Item>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//       <AddNewContainer>
//         <Button
//           onClick={() => props.onCreateNewMarker()}
//           icon={faPlus}
//           mode={BUTTON_MODE.HIGHLIGHT}
//         >
//           Crea nuovo
//         </Button>
//       </AddNewContainer>
//     </Container>
//   );
// }