function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

let me, fontData

const SCALE = 1

function preload() {
  me = loadImage("me2.jpg")
  fontData = loadFont('ShipporiMinchoB1-Regular.ttf');

}

function setup() {
  __canvas = createCanvas(2448*SCALE, 3264*SCALE);
  // __canvas = createCanvas(1333, 1000);
}

function draw() {
  noLoop()
  scale(SCALE)
  textFont(fontData)
  textAlign(CENTER)
  // image(me, 0, 0)
  noStroke()
  background(0)
  dither1(me)
}



function dither1(img) {
  colorMode(HSB, 360, 100, 100, 100)

  img.loadPixels()


  const maxDist = dist(width/2, height/2, 0,0)
  const size = 30



  for (let y = 0; y < img.height; y+=size) {
    for (let x = 0; x < img.width; x+=size) {

      const c =  img.get(x, y)
      const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`

      let _c = rgb

      let h = hue(rgb)
      let s = saturation(rgb)
      let b = brightness(rgb)

      textSize(size * (s/35))

      if (s > 30) {
        s = 100
        b = 100
      }
      // if (saturation(rgb) < 100) {
      //   if (brightness(rgb) < 50) {
      //     b = 0
      //   } else {
      //     b = 100
      //   }
      // }

      h = hfix(
        map(
          noise(x/250, y/250),
          0, 1, 0, 360
        )
      )
      fill(color(h, s, b))
      text('$', x, y)
    }
  }
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

