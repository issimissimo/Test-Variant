class Loader {
  constructor(containerId = 'loaderContainer') {
    this.containerId = containerId;
    this.isVisible = false;
    
    // Crea il loader dinamicamente
    this.createLoader();
  }

  createLoader() {
    // Controlla se il loader esiste già
    if (document.getElementById(this.containerId)) {
      this.container = document.getElementById(this.containerId);
      return;
    }
    
    // Crea il container del loader
    this.container = document.createElement('div');
    this.container.id = this.containerId;
    
    // Crea gli elementi del loader
    const loader1 = document.createElement('span');
    loader1.className = 'loader';
    
    const loader2 = document.createElement('span');
    loader2.className = 'loader2';
    
    const loaderText = document.createElement('div');
    loaderText.className = 'loader-text';
    loaderText.textContent = 'Caricamento...';
    
    // Aggiungi gli elementi al container
    this.container.appendChild(loader1);
    this.container.appendChild(loader2);
    this.container.appendChild(loaderText);
    
    // Aggiungi il container al body
    document.body.appendChild(this.container);
    
    // Nascondi inizialmente il loader
    this.container.classList.add('fade-out');
  }

  show(delay = 0) {
    setTimeout(() => {
      this.container.classList.add('fade-in');
      this.container.classList.remove('fade-out');
      this.isVisible = true;
    }, delay);
  }

  hide(delay = 0) {
    setTimeout(() => {
      this.container.classList.add('fade-out');
      this.container.classList.remove('fade-in');
      this.isVisible = false;
    }, delay);
  }

  toggle(delay = 0) {
    if (this.isVisible) {
      this.hide(delay);
    } else {
      this.show(delay);
    }
  }
}

window.Loader = Loader;