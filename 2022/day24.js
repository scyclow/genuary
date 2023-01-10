function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

let e=0
function draw() {
  noLoop()

  // image(ketchup, 0, 0)
  noStroke()
  // translate(300, 300)
  // scale(0.5)

  translate(width/2, height/2)
  background(255)
  noStroke()
  fill(0)


  for (let x = -width/2; x < width; x+= 5)
  for (let y = -height/2; y < height; y+= 5) {
    circle(x, y, rnd()*5)
  }
  e+=0.01
}

let _seed = 0
function rnd() {
  _seed++
  return myRandomNumber(2.1+_seed, _seed**2)
}

function myRandomNumber(x, y) {
  return min(1, Math.sqrt(
    (Math.sin(3*((x)**2+(y)**2) )) ** 2
    / (Math.sin(6*(Math.max(x**2, y**2)))**2)
  ))

}

function myRandomNumber1(x, y) {
  return Math.sin(x**2+y**2)/Math.cos(2*(Math.max(x**2, y**2)))
}


