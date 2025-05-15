import Alpine from 'alpinejs';


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