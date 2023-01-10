function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

let ketchup;

let SCALE = 0.2


function preload() {
  ketchup = loadImage("money-system.jpg");
}

function setup() {
  __canvas = createCanvas(3024*SCALE, 4032*SCALE);
}

function draw() {
  noLoop()

  // image(ketchup, 0, 0)
  noStroke()
  scale(SCALE)
  background(0)
  dither1(ketchup)
}



function dither1(img) {
  colorMode(HSB, 360, 100, 100, 100)
  img.loadPixels()
  strokeWeight(8)

  const maxDist = dist(width/2, height/2, 0,0)
  const size = 2
  const quantRound = 200
  const noiseDivisor = 9000

  const yDataLoss = []
  for (let y = 0; y < img.height; y+=size) {
    if (y>0 && yDataLoss[y-size] > 0) {
      yDataLoss[y] = max(yDataLoss[y-size] * 0.98 - 0.001, 0)
    } else if (rnd() < 0.002) {
      yDataLoss[y] = 0.95
    } else {
      yDataLoss[y] = 0
    }
    for (let x = 0; x < img.width; x+=size) {
      const cNoise = size
      const c =  img.get(x-int(random(-cNoise, cNoise)), y-int(random(-cNoise, cNoise)))
      const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`


      let h = (rnd() < yDataLoss[y]) ? hue(rgb) + 180 : hue(rgb) + rnd(-20, 20)

      const s = (rnd() < yDataLoss[y]) ? 100 : saturation(rgb)*1.5
      const b = (rnd() < yDataLoss[y]) ? 100 : brightness(rgb)

      const c_ = color(
        hfix(h),
        s,
        b,
      )
      fill(c_)



      let _x = x+random(-size, size) + map(noise(y/200), 0, 1, -125, 125) + map(noise(y/20), 0, 1, -75, 75)+ yDataLoss[y]*100
      // let _x = x+random(-size, size) + yDataLoss[y]*250
      // if (_x > width/SCALE) _x -= width
      circle(
        _x,
        y+random(-size, size),
        size
      )

      // rect(x, y, size, size)
    }
  }
  console.log(width)
}

function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}


const prb = x => rnd() < x

const posOrNeg = () => prb(0.5) ? 1 : -1


let __randomSeed = parseInt(tokenData.hash.slice(50, 58), 16)

function rnd(mn, mx) {
  __randomSeed ^= __randomSeed << 13
  __randomSeed ^= __randomSeed >> 17
  __randomSeed ^= __randomSeed << 5
  const out = (((__randomSeed < 0) ? ~__randomSeed + 1 : __randomSeed) % 1000) / 1000
  if (mx != null) return mn + out * (mx - mn)
  else if (mn != null) return out * mn
  else return out
}

function hshrnd(h) {
  const str = tokenData.hash.slice(2 + h*2, 4 + h*2)
  return parseInt(str, 16) / 255
}
const hfix = h => int((h + 360)) % 360
const sample = arr => arr[int(rnd(arr.length))]

