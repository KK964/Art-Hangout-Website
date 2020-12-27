window.onload = function () {
  registerNavigationScoll(); //register smooth scroll listener
};

//paint explosion
const html = document.documentElement;
const canvas = document.querySelector('header canvas');
const title = document.getElementById('art-title');
const context = canvas.getContext('2d');
var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
canvas.width = innerWidth + 20;
canvas.height = innerHeight + 20;
const width = canvas.width;
const height = canvas.height;
const imgWidth = 1920;
const imgHeight = 1080;
const frameCount = 14;
const currentFrame = (index) => `./assets/imgs/spashWelcome/frame-${index}.jpg`;
const images = [null];
const preloadImages = () => {
  for (let i = 1; i < frameCount; i++) {
    images[i] = new Image();
    images[i].src = currentFrame(i);
  }
};
const img = new Image();
img.src = currentFrame(1);
img.onload = function () {
  context.drawImage(img, 0, 0);
};
const updateImage = (index) => {
  if (index > 0 && index < frameCount) {
    const x = (innerWidth - imgWidth) * 0.5;
    const y = (innerHeight - imgHeight) * 0.5;
    context.drawImage(images[index], x, y);
  }
};
window.addEventListener('scroll', () => {
  getNextFrame();
});

window.addEventListener('resize', () => {
  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;
  getNextFrame();
});

function getNextFrame() {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
  requestAnimationFrame(() => updateImage(frameIndex + 1));
}

preloadImages();
//end of paint explosion

//smooth (ty PureGero)!
function registerNavigationScoll() {
  var navigationLinks = document.querySelectorAll('nav a');
  for (var i = 0; i < navigationLinks.length; i++) {
    var link = navigationLinks[i];
    link.addEventListener('click', function (e) {
      if (navigationScrollTo(e.target.getAttribute('href'))) {
        e.preventDefault();
      }
    });
  }
}
function navigationScrollTo(elementSelector) {
  var element = document.querySelector(elementSelector);
  if (element) {
    new SmoothScroll(scrollX, scrollY, element.offsetLeft, element.offsetTop - 25, 1000);
    return true;
  }
  return false;
}
function SmoothScroll(fromX, fromY, toX, toY, duration) {
  this.fromX = fromX;
  this.fromY = fromY;
  this.toX = toX;
  this.toY = toY;
  this.dX = toX - fromX;
  this.dY = toY - fromY;
  this.duration = duration;
  this.start = Date.now();
  requestAnimationFrame(this.scrollFrame.bind(this));
}
SmoothScroll.prototype.scrollFrame = function () {
  var time = Date.now();
  if (time >= this.start + this.duration) {
    scroll(this.toX, this.toY);
    return;
  }
  var dt = Math.sin((((time - this.start) / this.duration) * Math.PI) / 2);
  var x = this.fromX + dt * this.dX;
  var y = this.fromY + dt * this.dY;
  scroll(x, y);
  requestAnimationFrame(this.scrollFrame.bind(this));
};
