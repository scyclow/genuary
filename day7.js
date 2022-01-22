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

const nCircles = 50
const circleRad = 50
const lineWidth = 5



function preload() {}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()
  noFill()


  const bgColor = 0
  const strokeColor = '#fff'

  background(bgColor)
  stroke(strokeColor)

  noFill()

  const circleCoords = getRandomCircleCoords(nCircles, circleRad)
  circleCoords.forEach(([x, y]) => circle(x, y, circleRad*2))

  circleCoords.forEach(([x, y]) => {
    for (let _y=0; _y<=circleRad*2; _y+=lineWidth) {
      const xOff = sqrt(abs(circleRad**2 - (circleRad - _y)**2))
      line(x-xOff, y-_y+circleRad, x+xOff, y-_y+circleRad)
    }
  })








  for (let x=0; x<=width; x+=lineWidth) {

    let wasOverlapingCircle = false
    beginShape()
    vertex(x, 0)
    for (let y=0; y<= height; y++) {
      const isOverlapingCircle = circleCoords.some(_coord => dist(x, y, ..._coord) <= circleRad)
      // const isOverlapingCircle = isCircleIntersecting([x, y], circleCoords, circleRad)


      if (!wasOverlapingCircle && isOverlapingCircle) {
        wasOverlapingCircle = true
        endShape()
      } else if (wasOverlapingCircle && !isOverlapingCircle) {
        wasOverlapingCircle = false
        beginShape()
      }

      if (!isOverlapingCircle) {
        vertex(x, y)
      }
    }
    endShape()
  }


}

function getRandomCircleCoords(n, circleRad) {
  const coords = []
  for (let i=0; i<n; i++) {
    let coord = getRandomCircleCoord(circleRad)
    let x = 0
    while (isCircleIntersecting(coord, coords, circleRad) && x < 100) {
      coord = getRandomCircleCoord(circleRad)
      x++
    }
    if(x>=100) console.log('oops')

    coords.push(coord)
  }
  return coords
}

function isCircleIntersecting(coord, existingCircles, rad) {
  return existingCircles.some(_coord => dist(...coord, ..._coord) <= rad*2+1)
}

function getRandomCircleCoord(radius) {
  return [
    rnd(radius+1, width-radius-1),
    rnd(radius+1, height-radius-1),
  ]
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