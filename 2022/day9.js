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

  background(0)

  drawFlowField(-width/2, -height/2, () => color(rnd() < 0.1 ? 0 :180,50,30, 4), 5, 1, 20, 150)


  // draw1()


  noFill()

  drawLines(0,0, 4000, 400,450, 1, 10, 4, 0, color(0, 70, 85), true)
  drawLines(0,0, 4000, 350,410, 1, 1, 3, 4, color(5, 70, 85))
  drawLines(0,0, 4000, 300,360, 1, 1, 2, 3, color(10, 70, 85))
  drawLines(0,0, 4000, 250,310, 1, 1, 1, 2, color(15, 70, 85))
  drawLines(0,0, 4000, 200,260, 1, 1, 0, 1, color(20, 70, 85))
  drawLines(0,0, 4000, 170,210, 10, 1, 0, 0, color(25, 70, 85))


  times(3, i => {
    stroke(color(180,100,95, 20+i*10))
    drawPyramid(3, 50-i*6, 50-i*6)
  })

  // stroke(color(180, 100, 95))
  // drawPyramid(3, 50, 50)

  // fill('red')
  // circle(0,0,4)
}

function draw1() {
  times(width*1.5, r => {
    stroke(lerpColor(
      color(30,60, 30),
      color(0, 80, 5),
      r/(width*1.5)
    ))
    circle(0,0,r)
  })


  times(200, i => {
    stroke(color(hfix(40 - int(i/7)), 100, 100, 30))
    drawLines(0, 0, 30, i, i*4)
  })

  stroke(0)

  times(6, i => {
    fill(color(200,10,90, 20+i*10))
    drawPyramid(5, 90-i*12, 90-i*12)
  })


}


function drawPyramid(blockHeight, baseNBlocks, heightBlocks) {
  const blockWidth = blockHeight*1.35
  const pyramidBaseWidth = blockWidth*baseNBlocks
  const pyramidHeight = blockHeight*heightBlocks
  const pyramidXOffset = pyramidBaseWidth/2
  const {heightOfCenter: pyramidYOffset} = triStats(pyramidBaseWidth)
  const blockOffset = blockWidth/2
  strokeWeight(blockHeight/5)

  times(heightBlocks, y => {

    times(baseNBlocks - y, x => {
      rect(
        x*blockWidth+y*blockOffset - pyramidXOffset + rnd(-0.5, 0.5),
        -y*blockHeight+pyramidYOffset + rnd(-0.25, 0.25),
        blockWidth,
        blockHeight
      )
    })
  })
}



function drawLines(
  shapeX,
  shapeY,
  shapePointCount,
  innerRadius,
  outterRadius,
  innerShapeNoiseDivisor = 10,
  outterShapeNoiseDivisor = 10,
  innerZ = 0,
  outterZ = 0,
  c=null,
  drawBorder=false
) {
  push()
  const lineNoiseDivisor = 1
  const linePoints = 30

  const createShapeCoords = (rad, shapeNoiseDivisor, _z, rndFn) => times(shapePointCount, point => {
    const p = (point + shapePointCount) % shapePointCount
    const progress = p * TWO_PI / shapePointCount

    const coords = getXYRotation(progress, 2, 100, 100)
    const _x = (coords[0] + 200)/(shapeNoiseDivisor*2)
    const _y = (coords[1] + 200)/(shapeNoiseDivisor*2)
    const _r = map(noise(_x*2, _y*2, _z), 0, 1, rad*0.75, rad) + rndFn()

    return getXYRotation(
      progress,
      _r,
      shapeX,
      shapeY,
    )
  })

  const innerShapeCoords = createShapeCoords(innerRadius, innerShapeNoiseDivisor, innerZ, () => rnd(-10, 0))
  const outterShapeCoords = createShapeCoords(outterRadius, outterShapeNoiseDivisor, outterZ, () => rnd(-10, 0))
  const borderCoords = createShapeCoords(outterRadius, outterShapeNoiseDivisor, outterZ, () => -5)


  // innerShapeCoords.forEach(([x, y]) => {
  //   circle(x, y, 3)
  // })

  // outterShapeCoords.forEach(([x, y]) => {
  //   circle(x, y, 3)
  // })

  if (drawBorder) {

    fill(0)
    drawShape(
      borderCoords.length, {
        drawFn: curveVertexFn,

        xyFn: (progress, p) => borderCoords[(p+borderCoords.length) % borderCoords.length],
        beforeFn(drawFn, xyFn, points, _o) {
          beginShape()
          drawFn(xyFn((-1+_o)/points, -1))
        },
        afterFn(drawFn, xyFn, points, _o) {
          drawFn(xyFn((0+_o)/points, 0))
          drawFn(xyFn((1+_o)/points, 1))
          endShape()
        },
      },
    )
  }


  noFill()
  strokeWeight(0.5)
  times(shapePointCount, i => {
    const [x0, y0] = innerShapeCoords[i]
    const [x1, y1] = outterShapeCoords[i]
    const angleAdj = i <= shapePointCount/2  ? HALF_PI : HALF_PI + PI
    let angle = angleAdj-atan((y1 - y0) / (x1 - x0))

    const len = dist(x0, y0, x1, y1)

    stroke(
      c
        ? color(
            rnd() < 0.01 ? hfix(hue(c) + 180) : hue(c),
            rnd(40, 100),
            lightness(c),
          )
        : '#fff'
    )

    beginShape()
    curveVertex(x0, y0)
    let [_x, _y] = [x0, y0]
    times(linePoints, j => {
      const n = noise(_x/lineNoiseDivisor, _y/lineNoiseDivisor)
      const angleDelta = map(n, 0, 1, -PI/50, PI/50)
      angle = angle + angleDelta
      const coords = getXYRotation(angle, len/linePoints, _x, _y)
      _x = coords[0]
      _y = coords[1]

      curveVertex(_x, _y)
    })
    endShape()
  })

  pop()
}



function drawShape(points, fns, offset=1, start=0, finish=1, graphic=window) {
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

const drawFlowField = (xStart, yStart, getC, z=0, xDensity=2, freq=50, noiseDivisor=40) => {
  const linesPerColumn = freq
  // const noiseDivisor = 30//rnd(10, maxNoiseDivisor)
  // const noiseDivisor = 40
  for (let x = xStart-15; x < width + 30; x += xDensity) {
    times(linesPerColumn, l => {
      // stroke(color((startHue + l) % 360, 10, 90))
      // stroke(color((startHue + l) % 360, 25, 90))
      // stroke(color((startHue + l) % 360, 75, 90, rnd(20, 40))) // <-- *******
      // stroke(color((startHue + l) % 360, 75, 100))
      stroke(getC(l))

      const lineLength = rnd(10, 55)
      const xOff = 0//rnd(-5, 5)
      const yOff = 0//rnd(-5, 5)
      beginShape()
      let _x = x + rnd(-5, 5)
      let _y = rnd(yStart-15, yStart + height + 15)
      times(lineLength, _l => {
        curveVertex(_x+xOff, _y+yOff)
        ;([_x, _y] = getXYRotation(noise(_x/noiseDivisor, _y/noiseDivisor, z/noiseDivisor)*TWO_PI*2, 5, _x, _y))
      })
      endShape()
    })

  }
}


function curveVertexFn([x, y], p, points, graphic=window) {
  graphic.curveVertex(x, y)
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


function triStats(tBase) {
  const tHeight = sin(PI/3) * tBase
  const heightOfCenter = (tan(PI/6) * tBase) / 2
  const heightDiff = tHeight - heightOfCenter
  const centerW = tan(PI/6) * heightDiff * 2

  return {
    tHeight,
    heightOfCenter,
    heightDiff,
    centerW,
  }
}



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