let ctx;

const init = () => {
  let canvas = document.querySelector('canvas');
  canvas.height = (window.innerHeight * 1) / 3;
  canvas.width = window.innerWidth;

  ctx = canvas.getContext('2d');

  // C - all fill operations are now in red
  ctx.fillStyle = 'black';

  // D - fill a rectangle with the current fill color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export { ctx, init };
