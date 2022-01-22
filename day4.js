function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

const rotationMax = 25
const gearsN = 5
const rosettePoints = 200



function preload() {}

function setup() {
  __canvas = createCanvas(1155, 660);
}

function draw() {
  noLoop()
  noFill()
  colorMode(HSB, 360, 100, 100, 100)
  translate(width/2, height/2)
  noiseSeed(rnd(1000000000))

  const bgColor = rndColor()
  background(bgColor)

  const gears = generateGears(rotationMax, 5)

  strokeCap(PROJECT)
  // 1 when l is 1
  // 2 when l is 15
  // l**(l/100)
  times(25, l => {
    strokeWeight(l)
    times(85, ll => {
      const start = rnd(-0.05, 1)
      const end = start + rnd(0, 0.05)
      stroke(rndColor(bgColor))

      drawShape(
        rosettePoints, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(0,0, (2*l**1.9), (2*l**1.9), gears),
          beforeFn(drawFn, xyFn, points, _o) {
            beginShape()
          },
          afterFn(drawFn, xyFn, points, _o) {
            endShape()
          },
        },
        1,
        start,
        end
      )
    })
  })
}



function rndColor(exclude=null) {
  const wht = [40, 2, 98],
        dRed = [358, 64, 86],
        red = [358, 80, 82],
        tan = [25, 40, 88],
        midTan = [25, 40, 60],
        orng = [25, 78, 90],
        pOrng = [25, 68, 93],
        pYllw = [43, 60, 99],
        yllw = [43, 90, 99],
        pnk = [11, 35, 97],
        pPnk = [12, 18, 97],
        xGrn = [125, 55, 55],
        grn = [170, 75, 65],
        pGrn = [170, 35, 80],
        ppGrn = [160, 15, 85],
        pppGrn = [160, 10, 90],
        ppYllwGrn = [125, 12, 90],
        ppBlue = [200, 15, 90],
        pBlue = [200, 35, 75],
        blue = [210, 65, 55],
        dBlue = [220, 65, 35],
        ddBlue = [225, 65, 20],
        bgrndDBlue = [225, 60, 25],
        paleIndigo = [220, 35, 75],
        lavender = [260, 14, 88],
        pBrwn = [28, 42, 39],
        brwn = [25, 45, 33],
        dBrwn = [25, 45, 23],
        ddBrwn = [25, 45, 13],
        nwsprnt = [40, 12, 88],
        bgrndNws = [40, 8, 92],
        blk = [0, 0, 10]

  const c = sample([
    wht,
    dRed,
    red,
    tan,
    midTan,
    orng,
    pOrng,
    pYllw,
    yllw,
    pnk,
    pPnk,
    xGrn,
    grn,
    pGrn,
    ppGrn,
    pppGrn,
    ppYllwGrn,
    ppBlue,
    pBlue,
    blue,
    dBlue,
    ddBlue,
    bgrndDBlue,
    paleIndigo,
    lavender,
    pBrwn,
    brwn,
    dBrwn,
    ddBrwn,
    nwsprnt,
    bgrndNws,
    blk,
  ])

  return c === exclude ? rndColor(exclude) : c

}

















function numismaSketch4() {
  const gears = generateGears(rotationMax)

  strokeWeight(2)
  times(25, i => {
      drawShape(
        rosettePoints, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(0,0, (2*i**2), (2*i**1.9), gears),
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
        2,

      )
  })
}

function numismaSketch3() {

  const gears = generateGears(rotationMax)

  strokeWeight(12)
  times(18, i => {
      drawShape(
        rosettePoints, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(0,0, 890-i*50**0.9, 890-i*50**0.9, gears),
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
  })
}

function numismaSketch2() {
  const gears = generateGears(rotationMax)

  strokeWeight(2)
  times(18, i => {
      drawShape(
        rosettePoints, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(0,0, 890*0.8**i, 890*0.81**(i-1), gears),
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
        2,

      )
  })
}

function numismaSketch1() {
  const gears = generateGears(rotationMax)

  strokeWeight(2)
  times(18, i => {
      drawShape(
        rosettePoints, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(0,0, 890*0.8**i, 890*0.85**(i+1), gears),
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

function drawShape(points, fns, offset, start=0, finish=1) {
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
}


function generateGears(rotationMax, gearsN=5) {
  const gears = [
    {
      rotation: 1,
      rotationStart: 1,
      radia: 1,
      radiaStart: 1,
      radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => (i ? 1 : (p%2 ? 1 : prevRadius/baseRadius)),
    },
    ...times(gearsN - 1, g => ({
      rotation: int(rnd(-rotationMax, rotationMax)),
      rotationStart: int(rnd(-rotationMax, rotationMax)),
      radia: rnd(0, 0.1),
      radiaStart: rnd(0, 0.1),
      radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => (i ? 1 : (p%2 ? 1 : prevRadius/baseRadius)),
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