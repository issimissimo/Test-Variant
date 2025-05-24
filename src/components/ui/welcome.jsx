// SOLID
import { createSignal, createEffect } from 'solid-js'
import { SwitchPrimitive, SwitchPrimitiveThumb, Switch } from "@hope-ui/solid"

function Welcome() {
    return (
        <div>
            Welcome
            <Switch variant="filled">Switch</Switch>
        </div>
    )
}

export default Welcome