function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}




function preload() {
}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()

  colorMode(HSB, 360, 100, 100, 100)
  background(color(0, 80, 10))

  // noStroke()
  stroke(color(0, 80, 10))
  translate(width/2, height/2)




  rectMode(CENTER)


  times(20, i => {
    const c = color(
      hfix(220 + i*7.5),
      80,
      80
    )

    const top = map(i/20, 0, 1, 200-height/2, height/2)
    paint(createOutline(top), top, c)
  })

  // paint(createOutline(-50), -50, 'red')
  // paint(createOutline(0), 0, 'blue')
  // paintStroke(80, 80, 'blue')





}

function createOutline(top) {
  const coords = times(3, i => {
    const x = (i*width/3)-width/2
    const y = top + rnd(-250, 250)
    return [x, y]
  })
  return [
    [-width/2, top],
    ...coords,
    [width/2, top],
    [width/2, height/2],
    [-width/2, height/2],
    [-width/2, top]
  ]
}




function paint(coords, _y, c) {
  for (let x=int(-width/2); x < width; x+=10)
  for (let y=int(_y); y < height/2; y+=10) {
    if (inPolygon([x, y], coords)) {
      paintStroke(x+rnd(-5, 5), y+rnd(-5, 5), c)
    }
  }
}

function paintStroke(x, y, c) {
  push()

  const maxSize = 40
  fill(
    hfix(hue(c) + rnd(-20, 20)),
    saturation(c) + rnd(-20, 20) ,
    brightness(c) + rnd(-20, 20),
    rnd(10, 80)
  )
  translate(x, y)
  rotate(rnd(HALF_PI))
  if (rnd() < 0.5) {
    rect(0, 0, rnd(maxSize), rnd(maxSize))
  } else {
    circle(0, 0, rnd(maxSize))
  }

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

