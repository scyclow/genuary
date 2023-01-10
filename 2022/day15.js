

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

  const skyOutline = [
    [-width/2, -height/2],
    [width/2, -height/2],
    [width/2, 90],
    [-width/2, 90],
    [-width/2, -height/2]
  ]


  const sandOutline = [
    [-width/2, 40],
    [width/2, rnd(-60, 60)],
    [width/2, height/2],
    [-width/2, height/2],
    [-width/2, rnd(-60, 60)]
  ]


  fill(180, 80, 100)
  drawOutline(skyOutline)

  drawSun(rnd(-width/2, width/2), rnd(-height/2, 0))

  times(int(rnd(1, 9)), i => {
    drawCloud(rnd(-width/2, width/2), rnd(-height/2, 0))
  })



  fill(48, 52, 99)
  drawOutline(sandOutline)


  noStroke()
  fill(48, 52, 69)
  paint(sandOutline, 0, color(48, 52, 59), color(48, 52, 79))


}

function drawSun(x, y) {
  push()
  fill(60, 100, 100)
  stroke(60, 100, 100)
  strokeWeight(2)
  circle(x, y, 150)

  const numRays = 23
  times(numRays, i => {
    const [x0, y0] = getXYRotation(i*TWO_PI/numRays, 90, x, y)
    const [x1, y1] = getXYRotation(i*TWO_PI/numRays, 140, x, y)

    line(x0, y0, x1, y1)
  })

  stroke(0)
  fill(0)

  circle(x - 23, y - 15, 4)
  circle(x + 23, y - 15, 4)

  noFill()
  beginShape()
  times(8, i => {
    const [_x, _y] = getXYRotation(i*PI/8 - HALF_PI, 30, x, y)
    curveVertex(_x, _y)
  })
  endShape()
  pop()
}

function drawCloud(x, y) {
  push()
  fill(255)
  times(10, i => {
    circle(x + rnd(-40, 40), y + rnd(-20, 20), rnd(20, 80))
  })
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

function paint(coords, _y, c1, c2) {
  for (let x=int(-width/2); x < width; x++)
  for (let y=int(-_y); y < height/2 - _y; y++) {
    if (inPolygon([x, y], coords)) {
      if (rnd() < 0.4*y/height) {
        circle(x, y, 1)
      }
    }
  }
  // times(t, c => {
  //   const coord = getXYRotation(rnd(TWO_PI), rnd(radius), _x, _y)

  //   if (inPolygon(coord, coords)) {
  //     const h1 = hfix(hue(c1) + rnd(10))
  //     const h2 = hfix(hue(c2) + rnd(10))

  //     // const s1 = saturation(c1) - abs(60 - saturation(c1)) + rnd(-2, 2)
  //     // const s2 = saturation(c2) - abs(60 - saturation(c2)) + rnd(-2, 2)


  //     const s1 = 100
  //     const s2 = 100

  //     fill(lerpColor(
  //       color(h1, s1, brightness(c1)+rnd(-2, 2)),
  //       color(h2, s2, brightness(c2)+rnd(-2, 2)),
  //       dist(coord[0], coord[1], xL, yL)/800,
  //     ))
  //     noiseCircle(coord[0], coord[1], rnd(5, 20)/2)
  //   }
  // })
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