

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
  translate(width/2, height/2)

  colorMode(HSB, 360, 100, 100, 100)

  const startHue = rnd(360)
  const endHue = startHue + rnd(20, 180)

  background(255)
  noStroke()



  paint([
    [-width/2, -height/2],
    [width/2, -height/2],
    [width/2, -80],
    [-width/2, -80],
    [-width/2, -height/2],
  // ], width, 0,0, rnd(-100, 100), rnd(-100, 100), color(160, rnd(30, 40), rnd(90, 99)), color(240, rnd(30, 40), rnd(90, 99)), 200000)
  ], width, 0,0, rnd(-100, 100), rnd(-100, 100), color(160, 100, rnd(90, 99)), color(240, 100, rnd(90, 99)), 200000)

  paint([
    [-width/2, -90],
    [width/2, -90],
    [width/2, height/2],
    [-width/2, height/2],
    [-width/2, -90],
  // ], width, 0,0, rnd(-100, 100), rnd(-100, 100), color(26, 67, 49), color(49, 67, 59), 200000)
  ], width, 0,0, rnd(-100, 100), rnd(-100, 100), color(26, 100, 49), color(49, 100, 59), 200000)


  const fruitCoords = getFruitCoords(0,0)
  // fill(180, 50, 90)
  times(15, i => {
    const h = rnd(0, 80)
    const c1 = color(hfix(h), 45, 99)
    const c2 = color(hfix(h+30), 60, 40)

    drawLemon(rnd(-350, 350), rnd(-100, 280), rnd(TWO_PI), c1, c2)
  })


}


function getFruitCoords(x, y, size) {
  return [
    // [0,0],
    [0,-64],
    [45,-54],
    [73,-31],
    [94,-15],
    [99,-7],
    [95,3.5],
    [75,15],
    [52,32],
    [9,43],
    [-25,42],
    [-51,32],
    [-74,12],
    [-92,-3],
    [-96,-15],
    [-87,-26],
    [-51,-47],
  ]
}

function drawLemon(x, y, rot, c1, c2) {
  push()
  translate(x, y)
  rotate(rot)
  const fruitCoords = getFruitCoords(0,0)
  drawOutline(fruitCoords)
  paint(fruitCoords, 100, 0, 0, rnd(-100, 100), rnd(-100, 100), c1, c2, 4000)
  pop()
}

function drawOutline(coords) {
  drawShape(
    coords.length, {
      drawFn: curveVertexFn,
      xyFn: (progress, p) => coords[(p+coords.length) % coords.length],
      beforeFn(drawFn, xyFn, points, _o) {
        beginShape()
        drawFn(xyFn((-1+_o)/points, -1))
      },
      afterFn(drawFn, xyFn, points, _o) {
        drawFn(xyFn((0+_o)/points, 0))
        drawFn(xyFn((1+_o)/points, 1))
        endShape()
      },
    }
  )
}

function paint(coords, radius, _x, _y, xL, yL, c1, c2, t) {
  times(t, c => {
    const coord = getXYRotation(rnd(TWO_PI), rnd(radius), _x, _y)

    if (inPolygon(coord, coords)) {
      const h1 = hfix(hue(c1) + rnd(10))
      const h2 = hfix(hue(c2) + rnd(10))

      // const s1 = saturation(c1) - abs(60 - saturation(c1)) + rnd(-2, 2)
      // const s2 = saturation(c2) - abs(60 - saturation(c2)) + rnd(-2, 2)


      const s1 = 100
      const s2 = 100

      fill(lerpColor(
        color(h1, s1, brightness(c1)+rnd(-2, 2)),
        color(h2, s2, brightness(c2)+rnd(-2, 2)),
        dist(coord[0], coord[1], xL, yL)/800,
      ))
      noiseCircle(coord[0], coord[1], rnd(5, 20)/2)
    }
  })
}

function noiseCircle(_x, _y, rad) {
  const shapePointCount = 30
  const shapeNoiseDivisor = 0.1

  const shapeCoords = times(shapePointCount, point => {
    const p = (point + shapePointCount) % shapePointCount
    const progress = p * TWO_PI / shapePointCount

    const coords = getXYRotation(progress, 2, 100, 100)
    const __x = (coords[0] + 200)/shapeNoiseDivisor
    const __y = (coords[1] + 200)/shapeNoiseDivisor
    const _z = 1/shapeNoiseDivisor
    const _r = map(noise(__x, __y, _z), 0, 1, rad*0.5, rad*2)

    return getXYRotation(
      progress,
      _r,
      _x,
      _y,
    )
  })


  beginShape()
  curveVertex(...shapeCoords[shapeCoords.length - 1])
  shapeCoords.forEach(([x, y]) => {
    curveVertex(x, y)
  })
  curveVertex(...shapeCoords[0])
  curveVertex(...shapeCoords[1])
  endShape()

}


function drawShape(points, fns, offset=1, start=0, finish=1) {
  times(offset, o => {

    const _o = 2 * o / offset
    const adjustedPoints = int(points * (finish-start))

    fns.beforeFn(fns.drawFn, fns.xyFn, points, _o)
    times(
      points,
      p => fns.drawFn(
        fns.xyFn(
          start + (p+_o)/(points/(finish-start)),
          p,
          points
        ),
        p,
        points
      )
    )
    fns.afterFn(fns.drawFn, fns.xyFn, points, _o)
  })
}

function curveVertexFn([x, y]) {
  curveVertex(x, y)
  // circle(x, y, 8)
}


function showMouseCoords() {
  stroke(0)
  fill('red')
  circle(mouseX-width/2, mouseY-height/2, 4)
  text(`${mouseX-width/2}, ${mouseY-height/2}`, mouseX-width/2 + 20, mouseY-height/2+20)
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