import QRCode from "qrcode";

async function generateQRCode(text) {
    //apply to #qr-code
    document.getElementById("qr-code").src = await QRCode.toDataURL(text, {
        margin: 2,
        color: {
            dark: "#000000",
            light: "#FFFFFF",
        },
    });
}

async function generateLaunchCode() {
    let url = await VLaunch.getLaunchUrl(window.location.href);
    generateQRCode(url);
}

function isVLaunchDefined() {
    return typeof VLaunch !== "undefined" && VLaunch !== null;
}

export function init() {
    //If we have a valid Variant Launch SDK, we can generate a Launch Code. This will allow iOS users to jump right into the app without having to visit the Launch Card page.
    window.addEventListener("vlaunch-initialized", (e) => {
        if (isVLaunchDefined()) {
            generateLaunchCode();
        } else {
            generateQRCode(window.location.href);
        }
    });

    if (isVLaunchDefined() && VLaunch.initialized) {
        generateLaunchCode(); // generate a Launch Code for this url
    } else {
        generateQRCode(window.location.href); // generate regular QR code for this url
    }
}

export function generateQRCodeForForMarker(userId, markerId) {
    const path = `${window.location.href}?userId=${userId}&markerId=${markerId}`;
    generateQRCode(path);
}