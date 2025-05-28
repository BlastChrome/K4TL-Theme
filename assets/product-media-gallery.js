class MediaGallery extends HTMLElement {
  constructor() {
    super();
    const grid = this.querySelector('.product-media-grid');
    if (grid) {
      grid.addEventListener('click', this.handleGridElementClick.bind(this));
    }
  }

  handleGridElementClick(e) {
    const el = e.target;
    if (el.tagName == 'IMG') {
      this.handleImgClick(el);
    }
  }

  handleImgClick(clickedImg) {
    const images = [...this.querySelectorAll('img')];
    // clear the active class from the other images
    images.forEach((img) => img.classList.remove('active'));

    // check if the is a zoom-image
    const isZoomImage = clickedImg.parentElement.hasAttribute('data-zoom') ? true : false;
    if (isZoomImage) {
      let zoomInstance = null;
      if (!clickedImg.classList.contains('active')) {
        const resultEl = clickedImg.parentElement.querySelector('#my-result');
        zoomInstance = this.handleImageZoom(clickedImg, resultEl);
        // apply the active class to the clicked img
        clickedImg.classList.add('active');
      } else {
        zoomInstance.disable();
        clickedImg.classList.remove('active');
      }
    }
  }

  handleImageZoom(img, result) {
    const lens = document.createElement('div');

    lens.classList.add('img-zoom-lens');
    img.parentElement.insertBefore(lens, img);

    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    result.style.backgroundImage = `url('${img.src}')`;
    result.style.backgroundSize = `${img.width * cx}px ${img.height * cy}px`;

    function moveLens(e) {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x - lens.offsetWidth / 2;
      let y = pos.y - lens.offsetHeight / 2;

      x = Math.max(0, Math.min(x, img.width - lens.offsetWidth));
      y = Math.max(0, Math.min(y, img.height - lens.offsetHeight));

      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;

      result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    }

    function getCursorPos(e) {
      e = e || window.event;
      const rect = img.getBoundingClientRect();
      const x = e.pageX - rect.left - window.pageXOffset;
      const y = e.pageY - rect.top - window.pageYOffset;
      return { x, y };
    }

    // Attach event listeners
    const events = ['mousemove', 'touchmove'];
    events.forEach((evt) => {
      lens.addEventListener(evt, moveLens);
      img.addEventListener(evt, moveLens);
    });

    // Return an object with disable method
    return {
      disable() {
        events.forEach((evt) => {
          lens.removeEventListener(evt, moveLens);
          img.removeEventListener(evt, moveLens);
        });
        if (lens.parentElement) lens.parentElement.removeChild(lens);
        result.style.backgroundImage = 'none';
      },
    };
  }
}
customElements.define('product-media-gallery', MediaGallery);
