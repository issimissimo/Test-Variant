import { config } from "../config";
import { TestGameOnDesktopFallback } from "../app";


class ARButton {
  static createButton(renderer, sessionInit = {}) {

    const button = document.createElement("button");
    button.id = "ARButton";
    button.style.width = "100%";
    button.style.height = "40px";
    button.style.borderRadius = "90px";
    button.style.border = "none";
    button.style.outline = "none";
    // margin-top: 15px;
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";


    navigator.xr
      .isSessionSupported("immersive-ar")
      .then(function (supported) {

        if (supported) {
          button.textContent = "Inizia in AR";
          button.style.pointerEvents = "auto";
          button.style.backgroundColor = "rgba(0, 123, 255, 0.8)";
          initializeButton();
        }
        else if (config.debugOnDesktop) {
          button.textContent = "Debug su desktop";
          button.style.pointerEvents = "auto";
          button.style.backgroundColor = "rgba(0, 123, 255, 0.8)";
          initializeButton();
        }
        else {
          button.textContent = "AR non supportata :(";
          button.style.pointerEvents = "none";
          button.style.backgroundColor = "rgb(83, 83, 83)"
        }
      })


    function initializeButton() {
      let currentSession = null;

      function onSessionStarted(session) {
        session.addEventListener("end", onSessionEnded);
        renderer.xr.setReferenceSpaceType("local");
        renderer.xr.setSession(session);
        currentSession = session;
      }

      function onSessionEnded() {
        currentSession.removeEventListener("end", onSessionEnded);
        currentSession = null;
      }


      button.onclick = function () {
        if (config.debugOnDesktop) {
          // Function called on click when debug on desktop is enabled
          TestGameOnDesktopFallback();
        }

        else {
          // Regular AR session initialization
          if (currentSession === null) {
            navigator.xr
              .requestSession("immersive-ar", sessionInit)
              .then(onSessionStarted);
          } else {
            currentSession.end();
          }
        }
      };
    }

    return button;
  }
}

export { ARButton };
