import Alpine from 'alpinejs';
import {Spinner} from 'spin.js';
import 'spin.js/spin.css';

Alpine.store('ui', {
  visibility: {
    loader: true,
    arNotSupported: false,
    overlay: false,
    game: false
  },
  
  toggleDiv(divName) {
    if (this.visibility.hasOwnProperty(divName)) {
      this.visibility[divName] = !this.visibility[divName];
    } else {
      console.warn(`Div "${divName}" non trovato nello store.`);
    }
  },
  
  setDivVisibility(divName, isVisible) {
    if (this.visibility.hasOwnProperty(divName)) {
      this.visibility[divName] = isVisible;
    } else {
      console.warn(`Div "${divName}" non trovato nello store.`);
    }
  }
});

Alpine.start();


var opts = {
  lines: 5, // The number of lines to draw
  length: 27, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 0.7, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#ffffff', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

var target = document.getElementById('loader');
var spinner = new Spinner(opts).spin(target);