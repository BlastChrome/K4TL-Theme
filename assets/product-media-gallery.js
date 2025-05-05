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
    // get the featured img src
    const images = [...this.querySelectorAll('img')];
    const featuredImg = images.filter((img) => img.id == 'zoom-img')[0];

    // swap the clicked img with the featured image
    if (featuredImg.src != clickedImg.src) {
      featuredImg.src = clickedImg.src;

      // clear the active class from the other images
      images.forEach((img) => img.classList.remove('active'));

      // apply the active class to the clicked img
      clickedImg.classList.add('active');
    } else {
      debugger;
      let zoomInstance = null;
      const featuredID = featuredImg.id;
      if (!zoomInstance) {
        zoomInstance = this.handleImageZoom(featuredID, 'myresult');
      } else {
        zoomInstance.disable();
        zoomInstance = null;
      }
    }
  }

  handleImageZoom(imgID, resultID) {
    const img = document.getElementById(imgID);
    const result = document.getElementById(resultID);
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
