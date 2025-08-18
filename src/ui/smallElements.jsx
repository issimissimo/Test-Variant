import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';

export const Container = styled('div')`
    padding: 1.5em;
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    height: 100dvh;
  `;

export const FitHeight = styled(Motion.div)`
    margin-bottom: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  `;

export const FitHeightScrollable = styled(FitHeight)`
    overflow-y: auto;
  `;

export const Title = styled(Motion.p)`
    font-size: 1.8rem;
    font-family: "Montessori";
    line-height: 100%;
    color: ${props => props.color ?? props.color};
    /* margin: 0; */
    margin-bottom: 1rem;
  `;

