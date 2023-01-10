function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

const BUFFER = 1200
const STEP = 5
const SKEW_FACTOR = 0.005

function draw() {
  noLoop()
  background(0)
  noFill()
  translate(width/2-60, height/2-100)
  scale(0.5)
  stroke(255)

  // shearX(-HALF_PI/10)
  // shearY(-HALF_PI/10)



  // const leftCoords = getSquigLineCoords(-width/2, -height/2, -width/2, height/2)
  // const topCoords = getSquigLineCoords(-width/2, -height/2, width/2, -height/2)

  // beginShape()
  // leftCoords.forEach(([x, y]) => vertex(x, y))
  // endShape()

  // stroke('red')
  // beginShape()
  // topCoords.forEach(([x, y]) => vertex(x, y))
  // endShape()


  const xStart = -1 * (width/2 + BUFFER)
  const yStart = -1 * (height/2 + BUFFER)
  const xEnd = width/2 + BUFFER
  const yEnd = height/2 + BUFFER

  for (let x=xStart; x < xEnd; x+=STEP) {
    squigLine(x*SKEW_FACTOR, yStart, x, yEnd)
  }
  for (let y=yStart; y < yEnd; y+=STEP) {
    squigLine(xStart, y*SKEW_FACTOR, xEnd, y)
  }


}


function squigLine(x0, y0, x1, y1) {
  const d = dist(x0, y0, x1, y1)
  let angle = atan2(x1-x0, y1-y0)

  // circle(x0, y0, 3)
  // circle(x1, y1, 3)

  let x = x0
  let y = y0

  beginShape()
  // vertex(x0, y0)
  for (let i = 0; i<d; i+=STEP) {
    vertex(x, y)


    const angleDiff = map(noise(x/100, y/100), 0, 1, -TWO_PI/2500, TWO_PI/2500)
    angle += angleDiff
    ;([x, y] = getXYRotation(angle, STEP, x, y))
  }
  endShape()
}

function getSquigLineCoords(x0, y0, x1, y1) {
  const d = dist(x0, y0, x1, y1)
  let angle = atan2(x1-x0, y1-y0)

  let x = x0
  let y = y0

  const out = []
  for (let i = 0; i<d; i+=STEP) {
    out.push([x, y])
    const angleDiff = map(noise(x/100, y/100), 0, 1, -TWO_PI/1500, TWO_PI/1500)
    angle += angleDiff
    ;([x, y] = getXYRotation(angle, STEP, x, y))
  }
  return out
}






function interestingPattern1() {
  background(0)
  noFill()

  stroke(255)
  for (let x=0; x < width; x+=5) {
    squigLine1(x, 0, x, height)
  }
}
function squigLine1(x0, y0, x1, y1) {
  const step = 10
  const d = dist(x0, y0, x1, y1)
  let angle = atan2(x1-x0, y1-y0)

  let x = x0
  let y = y0

  beginShape()
  vertex(x0, y0)
  for (let i = 0; i<d; i+=step) {
    angle += noise(x, y) * (TWO_PI/200)
    ;([x, y] = getXYRotation(angle, d, x0, y0))
    vertex(x, y)
  }
  endShape()
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

