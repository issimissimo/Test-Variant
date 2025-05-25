// SOLID
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js'

//HOPE-UI
import { Switch } from "@hope-ui/solid"

//APP
import { AppMode } from '../../app'

function Welcome(props) {
    const [checked, setChecked] = createSignal(false);

    createEffect(() => {
        props.setCurrentMode(() => checked() ? AppMode.SAVE : AppMode.LOAD);
    });


    return (
        <div>
            <Switch
                checked={checked()}
                onChange={(e) => {
                    setChecked(e.target.checked);
                }}
            >
                {checked() ? "Save" : "Load"}
            </Switch>
        </div>
    )
}

export default Welcome