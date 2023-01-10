

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function preload() {}

const SCALE = 1
let W, H
function setup() {
  __canvas = createCanvas(800, 80);
  // __canvas = createCanvas(800, 80);

  W = width/SCALE
  H = height/SCALE
}


/*

start at random point on edge
pick random angle



*/

function draw() {
  noLoop()
  colorMode(HSB, 360, 100, 100, 100)
  scale(SCALE)

  background(20)

  stroke('#fff')

  const dots = 50000
  const diameter = 1
  const dotDistance = 1
  let direction = 1
  let angle = HALF_PI + rnd(-HALF_PI, HALF_PI)
  let x = 0
  let y = rnd(H)
  let sat = 0
  const hue = rnd(360)
  const hueShift = rnd(180)

  stroke(0, sat, 100)

  times(dots, d => {
    circle(x, y, diameter)
    if (y <= 0 || y >= height) {
      angle = PI - angle
    }

    if (x >= width && direction === 1) {
      direction = -1
      angle = 2*PI - angle
    } else if (x <= 0 && direction === -1) {
      direction = 1
      angle = 2*PI - angle
      sat += 20

    }
    stroke(color(hfix(map(x, 0, 800, hue, hueShift)), sat, 100))




    ;([x, y] = getXYRotation(angle, dotDistance, x, y))


  })


}


function misprint1() {

  const bgColor = 'red'
  const strokeColor = '#fff'

  background(bgColor)
  stroke(strokeColor)

  fill(0)

  // const circleCoords = getRandomCircleCoords(nCircles, circleRad)
  // circleCoords.forEach(([x, y]) => circle(x, y, circleRad*2))

  const minRad = 5
  const circleCoords = []

  const nearEdge = (x, y) => min(
    dist(x, y, 0, y),
    dist(x, y, W, y),
    dist(x, y, x, 0),
    dist(x, y, x, H),
  ) <= minRad

  const insideCircle = (_x, _y) => circleCoords.some(({x, y, r}) => dist(x, y, _x, _y) < r + minRad)

  times(1500, i => {
    const x = rnd(minRad, W - minRad)
    const y = rnd(minRad, H - minRad)

    if (nearEdge(x, y) || insideCircle(x, y)) return

    const shortestDistance = [
      ...circleCoords,
      { x: 0, y, r: 0 },
      { x: W, y, r: 0 },
      { x, y: 0, r: 0 },
      { x, y: H, r: 0 },
    ].reduce((shortest, coord) =>
      !shortest || dist(x, y, coord.x, coord.y)*2+minRad < dist(x, y, shortest.x, shortest.y)*2+minRad
        ? coord
        : shortest
    , null)

    const r = dist(shortestDistance.x, shortestDistance.y, x, y) - shortestDistance.r

    circleCoords.push({ x, y, r })
    // noStroke()
    strokeWeight(0)
    circle(x, y, r)
    strokeWeight(1)
    line(x, y, shortestDistance.x, shortestDistance.y)
  })
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