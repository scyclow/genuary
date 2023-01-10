function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

const rotationMax = 25
const gearsN = 6
const rosettePoints = 380
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

  const bgColor = color(0)
  const strokeColor1 = color(20, 4, 83)
  const strokeColor2 = color(18, 50, 73)
  const strokeColor3 = color(16, 80, 63)

  background(bgColor)

  times(width*1.5, i => {
    stroke(45,30, 20 - ((19*i)/width))
    circle(0,0,i)
  })

  noFill()

  stroke(strokeColor1)

  const gears = generateGears(rotationMax, gearsN)


  const layers = 32
  const distBetween = 22
  const maxRadius = 700

strokeWeight(4)
stroke(strokeColor3)
    drawShape(
      rosettePoints*20, {
        drawFn: curveVertexFn,

        // xyFn: createSpirographFn(0,0, 350, 350, gears),
        xyFn: createSpiralSpirographFn(0, 0, rosettePoints-10, gears),
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
      1,
    )


strokeWeight(2)
stroke(strokeColor2)
    drawShape(
      rosettePoints*20, {
        drawFn: curveVertexFn,

        // xyFn: createSpirographFn(0,0, 350, 350, gears),
        xyFn: createSpiralSpirographFn(0, 0, rosettePoints-10, gears),
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
      1,
    )

strokeWeight(0.5)
stroke(strokeColor1)
    drawShape(
      rosettePoints*20, {
        drawFn: curveVertexFn,

        // xyFn: createSpirographFn(0,0, 350, 350, gears),
        xyFn: createSpiralSpirographFn(0, 0, rosettePoints-10, gears),
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
      1,
    )


}








function createSpiralSpirographFn(x, y, points, gears) {
  return (_, p) => {
    const progress = p/points
    return gears.reduce(([_x, _y], gear, i) =>
      getXYRotation(
        progress * TWO_PI * gear.rotation,
        100 * gear.radia + progress*2,
        _x,
        _y
      ),
      [x, y]
    )
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