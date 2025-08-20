import { createSignal, onMount, createEffect } from 'solid-js';
import { styled } from 'solid-styled-components';

//Components
import Welcome from './welcome';
import Error from './error';

//UI
import { ArButtonContainer } from '../../_trash/ui';


const ArButtonContainer = styled('div')`
    z-index: 1000;
    display: ${props => props.viewMode === VIEW_MODE.GAMES ? 'flex' : 'none'};
`;


export default function Main(props) {

  //#region [constants]
  const [markerValid, setMarkerValid] = createSignal(false)


  //#region [lifeCycle]
  onMount(() => {
    if (props.marker.games != null) {
      if (props.marker.games.length > 0) {
        setMarkerValid(()=>true);

        setTimeout(()=>{
          props.initScene();
        },50)
      }
    }
  })


  //#region [return]
  return (
    <div>
      {
        markerValid() ?
          <div>
            <Welcome />
            <ArButtonContainer id="ArButtonContainer" />
          </div>
          :
          <Error />
      }
    </div>
  );
}