class Loader {
  constructor(containerId = 'loaderContainer') {
    this.container = document.getElementById(containerId);
    this.isVisible = false;
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