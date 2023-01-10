function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

const rotationMax = 25
const gearsN = 5
const rosettePoints = 80
const maxDiameter = 600



function preload() {}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  // drawingContext.filter = blur(`${b* pixelDensity()}px`)
  noLoop()
  noFill()
  translate(width/2, height/2)
  colorMode(HSB, 360, 100, 100, 100)

  noiseSeed(rnd(1000000000))

  const bgColor = color(16,62, 13)
  const strokeColor = color(20, 4, 83)

  background(bgColor)
  stroke(strokeColor)

  noFill()


  const gears = generateGears(rotationMax, gearsN)


  const layers = 32
  const distBetween = 22
  const maxRadius = 700
  times(layers, i => {
    drawShape(
      rosettePoints*4-(rosettePoints*i*3.5/layers), {
        drawFn: createOutwardLineFunction(0,0, 13),

        xyFn: createSpirographFn(0,0, maxRadius-i*distBetween, maxRadius-i*distBetween, gears),
        beforeFn(drawFn, xyFn, points, _o) {
          beginShape()
          drawFn(xyFn((-1+_o)/points))
        },
        afterFn(drawFn, xyFn, points, _o) {
          drawFn(xyFn((0+_o)/points))
          drawFn(xyFn((1+_o)/points))
          endShape()
        },
      },
      3,
    )
  })

  rectMode(CENTER)
  strokeWeight(80)
  stroke(bgColor)
  rect(0,0, width, height)
}


function draw1() {
  const gears = generateGears(rotationMax, gearsN)

  times(10, i => {
    drawShape(
      rosettePoints, {
        drawFn: createOutwardLineFunction(0,0, 10),
        // xyFn: createSpirographSquareFn(0,0, maxDiameter-i*20, 0.98, gears),
        // xyFn: createSquareFn(0,0, 400),
        xyFn: createSpirographFn(0,0, 300-i*20, 290-i*20, gears),
        beforeFn(drawFn, xyFn, points, _o) {
          beginShape()
          drawFn(xyFn((-1+_o)/points))
        },
        afterFn(drawFn, xyFn, points, _o) {
          drawFn(xyFn((0+_o)/points))
          drawFn(xyFn((1+_o)/points))
          endShape()
        },
      },
      3,
    )
  })
}



function createOutwardLineFunction(xCenter, yCenter, len) {
  return ([x0, y0], p , points) => {
    const angle = atan2(x0-xCenter, y0-yCenter)
    for (let i = 0; i<len; i++) {
      const pointAngle = angle + rnd(-0.04, 0.04)
      const [_x, _y] = getXYRotation(pointAngle, i, x0, y0)
      circle(_x, _y, 0.5)
    }
  }
}

function createSpirographSquareFn(x, y, baseDiameter, diameterAdj, gears) {
  return (progress, p) => {
    const diameter = p % 2 ? baseDiameter : baseDiameter * diameterAdj
    const squareFn = createSquareFn(x, y, diameter)
    const [_x, _y] = squareFn(progress, p)
    const spiroFn = createSpirographFn(_x, _y, diameter/2, diameter/2, gears.slice(1))
    return spiroFn(progress, p)
  }
}



function createSquareFn(x, y, diameter) {
  const top = y - diameter/2
  const bottom = y + diameter/2
  const left = x - diameter/2
  const right = x + diameter/2

  return (progress, p) => {
    if (progress < 0.25) {
      const localProgress = progress/0.25
      return [
        left + localProgress*diameter,
        top,
      ]
    } else if (progress < 0.5) {
      const localProgress = (progress-0.25)/0.25
      return [
        right,
        top + localProgress*diameter,
      ]
    } else if (progress < 0.75) {
      const localProgress = (progress-0.5)/0.25
      return [
        right - localProgress*diameter,
        bottom
      ]
    } else {
      const localProgress = (progress-0.75)/0.25
      return [
        left,
        bottom - localProgress*diameter
      ]
    }
  }
}



function createSpirographFn(x, y, baseRadius, prevRadius, gears) {
  return (progress, p) => gears.reduce(([_x, _y], gear, i) =>
    getXYRotation(
      progress * TWO_PI * gear.rotation,
      baseRadius * gear.radia * gear.radiaAdj(p, i, _x, _y, baseRadius, prevRadius),
      _x,
      _y
    ),
    [x, y]
  )
}

function drawShape(points, fns, offset, start=0, finish=1, graphic=window) {
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
        points,
        graphic
      )
    )
    fns.afterFn(fns.drawFn, fns.xyFn, points, _o)
  })
}



function curveVertexFn([x, y], p, points, graphic=window) {
  graphic.curveVertex(x, y)
}


function generateGears(rotationMax, gearsN=5) {
  const gears = [
    {
      rotation: 1,
      rotationStart: 1,
      radia: 1,
      radiaStart: 1,
      radiaAdj: (p, gearIx, _x, _y, baseRadius, prevRadius) => p % 2 ? 1 : prevRadius/baseRadius,
    },
    ...times(gearsN - 1, g => ({
      rotation: int(rnd(-rotationMax, rotationMax)),
      rotationStart: int(rnd(-rotationMax, rotationMax)),
      radia: rnd(0, 0.1),
      radiaStart: rnd(0, 0.1),
      radiaAdj: (p, gearIx, _x, _y, baseRadius, prevRadius) => 1,
    }))
  ]

  const totalRadia = gears.reduce((sum, g) => g.radia + sum, 0)
  return gears.map(g => ({
    ...g,
    radia: g.radia/totalRadia
  }))
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