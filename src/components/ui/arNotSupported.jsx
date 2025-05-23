import { onMount } from 'solid-js'
import { init } from "../../utils/qr.js";

function ArNotSupported() {

    onMount(() => {
        init();
    });
    

    return (
        <>
            {<div class="full-screen-div">
                <p>
                    WebXR Not Supported. Open this page on iOS or Android to view the
                    example.
                </p>
                <p>
                    For documentation & support, mail to
                    <a href="mailto:info@issimissimo.com"> info@issimissimo.com</a>
                </p>
                <img id="qr-code" />
            </div>}
        </>
    )
}
export default ArNotSupported