
import { createSignal, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { Motion } from 'solid-motionone';


const ToggleWrapper = styled("div")`
  width: 39px;
  height: 21px;
  background-color: ${(props) => (props.checked ? "var(--color-secondary-dark-dark)" : "var(--color-background)")};
  border-radius: 50px;
  color: ${(props) => (props.checked ? "var(--color-background)" : "var(--color-secondary-dark-dark)")};
  /* border: 1px solid; */
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
`;

const Knob = styled(Motion.div)`
  width: 16px;
  height: 16px;
  background-color: var(--color-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
`;

export default function Toggle(props) {
  const [checked, setChecked] = createSignal(props.checked ?? false);
  const [transitionDuration, setTransitionDuration] = createSignal(0);

  onMount(() => {
    setTimeout(() => {
      setTransitionDuration(() => 0.25);
    }, 200)
  });

  return (
    <ToggleWrapper
      checked={checked()}
      onClick={() => {
        setChecked(!checked());
        props.onChange?.(!checked());
      }}
    >
      <Knob
        checked={checked()}
        animate={{ x: checked() ? 19 : 4 }}
        transition={{ duration: transitionDuration() }}
      >
      </Knob>
    </ToggleWrapper>
  );
}
