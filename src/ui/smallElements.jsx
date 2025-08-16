import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';

export const Container = styled('div')`
    padding: 1.5em;
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    /* align-items: ${props => props.alignLeft ? 'normal' : 'center'}; */
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

// TITLE

const TitleContainer = styled(Motion.div)`
    margin-top: 1em;
    margin-bottom: 2em;
  `;

const TitleStyled = styled('p')`
    font-size: 1.8rem;
    font-family: "Montessori";
    /* line-height: 100%; */
    color: ${props => props.color ?? props.color};
    margin: 0;
  `;


export const Title = styled(Motion.p)`
    font-size: 2.6rem;
    font-family: "Montessori";
    line-height: 100%;
    color: ${props => props.color ?? props.color};
    margin: 0;
  `;

export const Title2 = styled(Motion.p)`
    font-size: 1.8rem;
    font-family: "Montessori";
    line-height: 100%;
    color: ${props => props.color ?? props.color};
    margin: 0;
  `;

export const NewTitle = (props) => {
  return (
    <TitleContainer
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5, easing: "ease-in-out", delay: 0 }}
    >
      <TitleStyled>{props.children}</TitleStyled>
    </TitleContainer>
  )

}
