function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}



let fontData

function preload() {
  fontData = loadFont('ShipporiMinchoB1-Regular.ttf');
}

const cols = 40
const rows = 60

let SIZE = window.innerHeight
function setup() {
  __canvas = createCanvas(800, 1200);
}

function draw() {
  noLoop()
  colorMode(HSB, 360, 100, 100, 100)

  HUE = 160//int(rnd(0,360))
  DARK_C = color(HUE, 20, 10)
  LIGHT_C = color(hfix(HUE-72), 6, 91)
  ACCENT_C = color(hfix(HUE-155), 90, 74)
  ACCENT2_C = color(hfix(HUE+70), 85, 67)
  ACCENT3_C = color(hfix(HUE-50), 90, 45)

  textFont(fontData)
  textAlign(CENTER)

  background(LIGHT_C)
  noStroke()

  const dollarSize = SIZE/cols
  textSize(dollarSize)

  let x = 0
  let y = 9
  while (y < rows) {
    let maxY = 0
    while (x < cols) {
      const w = int(rnd(1, 4))
      const h = int(rnd(1, 4))
      maxY = max(maxY, h)

      let charSeed = rnd()
      let char
      if (charSeed < 0.4) char = '$'
      else if (charSeed < 0.7) char = '!'
      else char = '%'


      const c = rnd()
      if (c < 0.1) fill(ACCENT3_C)
      else if (c < 0.2) fill(ACCENT2_C)
      else if (rnd() < 0.4) fill(ACCENT_C)
      else fill(DARK_C)

      drawTextSquare(x, y, w, h, char, dollarSize)

      x += w
    }
    x = 0
    y += maxY
  }

  // times(125, i => {
  //   const startX = int(rnd(cols))
  //   const startY = int(rnd(rows))
  //   const w = int(rnd(1, 8))
  //   const h = int(rnd(1, 8))

  //   if (rnd() < 0.3) fill(ACCENT_C)
  //   else fill(DARK_C)

  //   const char = rnd() < 0.5 ? '$' : '!'

  //   for (let x=startX; x<startX+w; x++) {
  //     for (let y=startY; y<startY+h; y++) {

  //       text(char, x*dollarSize + dollarSize/2, y*dollarSize*1.025-2 + dollarSize)
  //     }
  //   }

  // })

  // for (let x=0; x<cols; x++) {
  //   for (let y=0; y<rows; y++) {
  //     fill(DARK_C)
  //     fill(ACCENT_C)
  //     text('$', x*dollarSize + dollarSize/2, y*dollarSize + dollarSize*0.87)


  //     // text('$', 50, 50)

  //   }
  // }

}

function sketch1() {
const cols = 40
const rows = 60

let SIZE = window.innerHeight
  function setup() {
    __canvas = createCanvas(800, 800);
  }

  function draw() {
    noLoop()
    colorMode(HSB, 360, 100, 100, 100)

    HUE = 160//int(rnd(0,360))
    DARK_C = color(HUE, 20, 10)
    LIGHT_C = color(hfix(HUE-72), 6, 91)
    ACCENT_C = color(hfix(HUE-155), 90, 74)
    ACCENT2_C = color(hfix(HUE+70), 85, 67)
    ACCENT3_C = color(hfix(HUE-50), 90, 45)

    textFont(fontData)
    textAlign(CENTER)

    background(LIGHT_C)
    noStroke()

    const dollarSize = SIZE/cols
    textSize(dollarSize)

    fill(ACCENT_C)
    drawTextSquare(20-1, 30-12, 2, 2, '@', dollarSize)

    fill(ACCENT3_C)
    drawTextSquare(17-1, 27-12, 8, 3, '$', dollarSize)
    drawTextSquare(17-1, 32-12, 8, 3, '$', dollarSize)
    drawTextSquare(17-1, 30-12, 3, 3, '$', dollarSize)
    drawTextSquare(22-1, 30-12, 3, 3, '$', dollarSize)

    fill(ACCENT2_C)
    drawTextSquare(13-1, 23-12, 16, 4, '%', dollarSize)
    drawTextSquare(13-1, 35-12, 16, 4, '%', dollarSize)
    drawTextSquare(13-1, 27-12, 4, 8, '%', dollarSize)
    drawTextSquare(25-1, 27-12, 4, 8, '%', dollarSize)

    fill(0)
    drawTextSquare(8-1, 18-12, 26, 5, '!', dollarSize)
    drawTextSquare(8-1, 39-12, 26, 5, '!', dollarSize)
    drawTextSquare(8-1, 23-12, 5, 16, '!', dollarSize)
    drawTextSquare(29-1, 23-12, 5, 16, '!', dollarSize)
  }
}

function drawTextSquare(startX, startY, w, h, char, size) {
  for (let x=startX; x<startX+w; x++) {
    for (let y=startY; y<startY+h; y++) {
      text(char, x*size + size/2, y*size*1.025-2 + size)
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

