

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function preload() {}

let W, H
function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);

}


function draw() {
  noLoop()
  // translate(width/2, height/2)

  colorMode(HSL, 360, 100, 100, 100)


  sketch1()

}

function sketch2() {
  const bgC1 = color(182, 100, 47)
  const bgC2 = color(6, 100, 49)

  const bgC3 = color(80, 95, 58)
  const bgC4 = color(270, 94, 49)

  background(bgC1)

  for (let i = 0; i < height + width; i++) {
    // stroke(lerpColor(
    //   bgC2,
    //   bgC1,
    //   i/(height+width)
    // ))

    stroke(color(
      hue(bgC2),
      saturation(bgC2),
      lightness(bgC2),
      100*i/(height+width)
    ))
    line(0, i, i, 0)
  }


  const cornerToCorner = dist(0, height, width, 0)

  // noStroke()
  noFill()
  rectMode(CENTER)

  const cSize = rnd(95) //7
  for (let x=5; x<=width+5; x+=15)
  for (let y=5; y<=height+5; y+=15) {
    stroke(lerpColor(
      bgC3,
      bgC4,
      dist(x, y, width, 0)/cornerToCorner
    ))

    // strokeWeight(map(1-dist(x, y, 0,0)/dist(0,0, width, height), 0,1, 0.6, 1))

    // fill(lerpColor(
    //   color('purple'),
    //   bgC3,
    //   dist(x, y, width, 0)/cornerToCorner
    // ))
    circle(x, y, cSize * dist(x, y, 0,0)/dist(0,0, width, height))
    // rect(
    //   x,
    //   y,
    //   95 * dist(x, y, 0,0)/dist(0,0, width, height),
    //   95 * dist(x, y, 0,0)/dist(0,0, width, height),
    // )
  }
}

function sketch1() {

  const bgC1 = color(182, 100, 47)
  const bgC2 = color(6, 94, 49)

  const bgC3 = color(80, 75, 58)
  const bgC4 = color(270, 74, 49)

  background(bgC1)

  for (let i = 0; i < height + width; i++) {
    stroke(color(
      hue(bgC2),
      saturation(bgC2),
      lightness(bgC2),
      100*i/(height+width)
    ))
    line(0, i, i, 0)
  }


  const cornerToCorner = dist(0, height, width, 0)

  noFill()
  rectMode(CENTER)

  for (let x=5; x<=width; x+=10)
  for (let y=5; y<=height; y+=10) {
    stroke(lerpColor(
      bgC3,
      bgC4,
      dist(x, y, width, 0)/cornerToCorner
    ))

    rect(
      x,
      y,
      95 * dist(x, y, 0,0)/dist(0,0, width, height),
      95 * dist(x, y, 0,0)/dist(0,0, width, height),
    )
  }
}


function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}


function inPolygon(p, polygon) {
  const infLine = [p[0], height*2]
  const intersections = polygon.reduce((sum, line, i) => {
    const nextI = (i+1) % polygon.length
    const nextLine = polygon[nextI]

    return intersects(p, infLine, line, nextLine)
      ? sum + 1
      : sum
  }, 0)

  return intersections % 2 === 1
}

function intersects(
  [x1, y1],
  [x2, y2],
  [x3, y3],
  [x4, y4]
) {
  const det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1)
  if (det === 0) return false

  const lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det
  const gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det
  return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1)

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