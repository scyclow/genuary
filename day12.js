/*
On a black background, place 50 white circles at random with a radius of 50 pixels.
The circles should be evenly distributed over the area of the screen.
None of the circles should overlap one another or the edge of the screen.
From left to right, draw vertical white lines from the top of the screen to the bottom spaced 5 pixels apart.
The vertical lines should not enter the circles.
Inside of each circle, from top to bottom, draw horizontal white lines from edge to edge spaced 5 pixels apart.
*/



function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function preload() {}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()
  colorMode(HSB, 360, 100, 100, 100)



  const bgColor = color(2,90, 90)
  const strokeColor1 = color(0,20,5)
  const strokeColor2 = color(58,89,85)

  // const strokeWeight1 = 15
  const strokeWeight1 = 12
  const strokeWeight2 = 1
  const minRad = 4
  const circleCoords = []
  const shortestDistances = []

  // const bgColor = color(180,95, 90)
  // const strokeColor1 = color(260,75, 70)
  // const strokeColor2 = color(260,75, 70)

  background(bgColor)

  // fill(0)
  noFill()

  // const circleCoords = getRandomCircleCoords(nCircles, circleRad)
  // circleCoords.forEach(([x, y]) => circle(x, y, circleRad*2))


  const nearEdge = (x, y) => min(
    dist(x, y, 0, y),
    dist(x, y, width, y),
    dist(x, y, x, 0),
    dist(x, y, x, height),
  ) <= minRad

  const insideCircle = (_x, _y) => circleCoords.some(({x, y, r}) => dist(x, y, _x, _y) < r + minRad)

  times(300_000, i => {
    const x = rnd(minRad, width - minRad)
    const y = rnd(minRad, height - minRad)

    if (nearEdge(x, y) || insideCircle(x, y)) return

    const distToEdge = (_x, _y, _r) => dist(_x, _y, x, y) - _r

    const shortestDistance = [
      ...circleCoords,
      { x: 0, y, r: 0 },
      { x: width, y, r: 0 },
      { x, y: 0, r: 0 },
      { x, y: height, r: 0 },
    ].reduce((shortest, coord, i) => {
      if (!shortest) return coord

      else if (
        distToEdge(coord.x, coord.y, coord.r)
        <
        distToEdge(shortest.x, shortest.y, shortest.r)
      ) {
        return coord
      }

      else return shortest
    }
    , null)

    const r = dist(shortestDistance.x, shortestDistance.y, x, y) - shortestDistance.r



    circleCoords.push({ x, y, r })
    shortestDistances.push(shortestDistance)
  })

  circleCoords.forEach((coord, i) => {
    const shortestDistance = shortestDistances[i]
    fill(0)
    // noStroke()
    // circle(coord.x, coord.y, r*2)
    strokeWeight(strokeWeight1)
    stroke(strokeColor1)
    line(coord.x, coord.y, shortestDistance.x, shortestDistance.y)
  })

  circleCoords.forEach((coord, i) => {
    const shortestDistance = shortestDistances[i]
    strokeWeight(strokeWeight2)
    stroke(strokeColor2)
    line(coord.x, coord.y, shortestDistance.x, shortestDistance.y)
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
    dist(x, y, width, y),
    dist(x, y, x, 0),
    dist(x, y, x, height),
  ) <= minRad

  const insideCircle = (_x, _y) => circleCoords.some(({x, y, r}) => dist(x, y, _x, _y) < r + minRad)

  times(1500, i => {
    const x = rnd(minRad, width - minRad)
    const y = rnd(minRad, height - minRad)

    if (nearEdge(x, y) || insideCircle(x, y)) return

    const shortestDistance = [
      ...circleCoords,
      { x: 0, y, r: 0 },
      { x: width, y, r: 0 },
      { x, y: 0, r: 0 },
      { x, y: height, r: 0 },
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