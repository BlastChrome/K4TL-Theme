class MediaGallery extends HTMLElement {
  constructor() {
    super();
    this.grid = this.querySelector('.product-media-grid');
    this.images = [...this.querySelectorAll('img')];
    this.events = ['mousemove', 'touchmove'];

    if (this.grid) {
      this.grid.addEventListener('click', this.handleGridClick.bind(this));
    }
  }

  handleGridClick(e) {
    const img = e.target.closest('img');
    if (!img) return;

    const zoomWrapper = img.closest('[data-zoom]');

    if (zoomWrapper) {
      if (!zoomWrapper.classList.contains('active')) {
        const resultEl = zoomWrapper.querySelector('#my-result');
        this.currentZoom = this.initializeZoom(img, resultEl);
        zoomWrapper.classList.add('active');
      } else {
        this.currentZoom.disable();
        zoomWrapper.classList.remove('active');
      }
    }
  }

  initializeZoom(img, result) {
    const lens = document.createElement('div');
    lens.classList.add('img-zoom-lens');
    img.parentElement.insertBefore(lens, img);

    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    result.style.backgroundImage = `url('${img.src}')`;
    result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;

    // Bind the moveLens method to maintain correct 'this' context
    const boundMoveLens = this.moveLens.bind(this, img, lens, result, cx, cy);

    // Attach event listeners
    this.events.forEach((evt) => {
      lens.addEventListener(evt, boundMoveLens);
      img.addEventListener(evt, boundMoveLens);
    });

    return {
      disable: () => {
        this.events.forEach((evt) => {
          lens.removeEventListener(evt, boundMoveLens);
          img.removeEventListener(evt, boundMoveLens);
        });
        if (lens.parentElement) lens.parentElement.removeChild(lens);
        result.style.backgroundImage = 'none';
      },
    };
  }

  moveLens(img, lens, result, cx, cy, e) {
    e.preventDefault();
    const pos = this.getCursorPos(img, e);
    let x = pos.x - lens.offsetWidth / 2;
    let y = pos.y - lens.offsetHeight / 2;

    x = Math.max(0, Math.min(x, img.width - lens.offsetWidth));
    y = Math.max(0, Math.min(y, img.height - lens.offsetHeight));

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;

    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
  }

  getCursorPos(img, e) {
    e = e || window.event;
    const rect = img.getBoundingClientRect();
    const x = e.pageX - rect.left - window.pageXOffset;
    const y = e.pageY - rect.top - window.pageYOffset;
    return { x, y };
  }
}

customElements.define('product-media-gallery', MediaGallery);
