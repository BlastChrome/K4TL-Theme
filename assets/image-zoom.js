function imageZoom(imgID, resultID) {
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
