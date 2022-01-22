function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

let START_ANGLES, POS_VALS, NEG_VALS

const MAX = 365*4


const startTime = 1642872668419
const timeSinceStart = Date.now() - startTime
const msInYear = 1000*60*60*24*365
const DAY = MAX*(timeSinceStart/msInYear)

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);

  START_ANGLES = times(5, i => [
    -PI*i/4,
    -PI*i/4,
    PI*i/4,
    PI*i/4,
  ]).flat()
  POS_VALS = times(START_ANGLES.length, i => rnd(0.00001, 0.00005) * (i%2 ? 1 : -1))
  NEG_VALS = times(START_ANGLES.length, i => rnd(0.00001, 0.0001) * (i%2 ? -1 : 1))
}

function draw() {
  noLoop()
  colorMode(HSB, 360, 100, 100, 100)
  translate(width/2, height/2)

  scale(0.5)
  noStroke()

  const maxCircle = width+height*2.5
  times(maxCircle, i => {
    const p = i/maxCircle

    fill(color(
      hfix(map(p, 0, 1, 0, 30)),
      map(DAY/MAX, 0, 1, 0, 90),
      map(p, 0, 1, 0, 100)
    ))
    circle(0,0, maxCircle - i)
  })

  fill(0)
  const createChangeFn = (tippingPoint, posVal=0.00003, negVal=-0.0001) => (a, i, len) => {
    const progress = i/len

    return a + (
      progress > tippingPoint
        ? negVal
        : posVal
      )
  }








// 0x07abca4810f220e8247162c16bb3233fdb8e83c665e85e42975557b697009319
// 0x9656b75967ece3381b69de755dc9bb1ab5a618ddb1e0e608593ecd68bba07d6e



  const offset = map(DAY/MAX, 0, 1, 0, 10)
  START_ANGLES.forEach((a, i) => {
    drawCurve(offset, offset, a, DAY,
      () => color(0),
      i => 3+(i/30),
      createChangeFn(0.2, POS_VALS[i], NEG_VALS[i])
    )
  })

//
  START_ANGLES.forEach((a, i) => {
    drawCurve(0, 0, a, DAY,
      (i, len) => color(
        hfix((180*i/len)),
        map(i/len, 0, 1, 30, 80),
        20
        // map(i/len, 0, 1, 20, 40)
      ),
      i => 3+(i/30),
      createChangeFn(0.2, POS_VALS[i], NEG_VALS[i])
    )
  })

  START_ANGLES.forEach((a, i) => {
    drawCurve(0, 0, a, DAY,
      (i, len) => color(
        hfix(map(i/len, 0, 1, 270, 370)),
        map(i/len, 0, 1, 10, 75),
        map(i/len, 0, 1, 70, 85)
      ),
      i => 1+(i/40),
      createChangeFn(0.2, POS_VALS[i], NEG_VALS[i])
    )
  })

  // DAY += 2

}


const createCFn = c => (i, len) => color(hfix(hue(c)+(180*i/len)), map(i/len, 0, 1, 30, 100), map(i/len, 0, 1, 80, 90))

const iden = x => x
const defaultThick = i => 1+(i/40)

function drawCurve(startX=0, startY=0, startAngle=HALF_PI, len=800, colorFn=createCFn(0), thickFn=defaultThick, changeFn=iden) {
  let angle = startAngle
  let angleChange = TWO_PI/(3200)

  let x = startX
  let y = startY

  let i = 0
  while (i < len) {
  // while (i < len && angleChange < PI && angleChange > -PI) {
    fill(colorFn(i, len))
    circle(x, y, thickFn(i))
    ;([x, y] = getXYRotation(angle, 1, x, y))

    angle += angleChange
    angleChange = changeFn(angleChange, i, len)
    i++
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

