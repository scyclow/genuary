

function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function preload() {}

let W, H
const __graphics = []

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight)
  __graphics[0] = window
  __graphics[1] = createGraphics(window.innerWidth, window.innerHeight)
  __graphics[2] = createGraphics(window.innerWidth, window.innerHeight)
  __graphics[3] = createGraphics(window.innerWidth, window.innerHeight)

  noiseSeed(int(rnd(0, 1_000_000_000_000)))


}


function draw() {
  noLoop()
  __graphics.forEach(g => {
    g.translate(width/2, height/2)
    g.colorMode(HSL, 360, 100, 100, 100)
  })



  // blue grayish hsl(212deg 9% 35%)
                    // 222, 11, 23
  // redish hsl(351deg 34% 50%)
  // whitish hsl(225deg 7% 88%)


  // const blackC = color(212, 9, 5)
  // const redC = color(351, 74, 50)
  // const whiteC = color(225, 7, 88)

  // const blackC = color(212, 9, 25)
  // const redC = color(351, 84, 50)
  // const tealC = color(172, 74, 60)

  const blackC = color(52, 9, 15)
  const redC = color(351, 84, 50)
  const tealC = color(62, 54, 70)

  background(blackC)

  const peakDist = 500
  const baseX = 0
  const baseY = 0
  const peaks = times(5, i => [
    rnd(-peakDist, peakDist) + baseX,
    rnd(-peakDist, peakDist) + baseY
  ])

  const layers = times(100, i => ({
    skip: rnd() < 0.25,
    strokeMod: rnd(0.5, 2),
    z: i/200,
  }))


  const xOff = rnd(-10)
  const yOff = rnd(-10)

  drawLayer(peaks, layers, tealC, xOff*2, yOff*2, __graphics[3])
  drawLayer(peaks, layers, redC, xOff, yOff, __graphics[1])
  // drawLayer(peaks, layers, blackC, 0, 0, __graphics[2])





}



function drawLayer(peaks, layers, c, xOff, yOff, g) {
  const points = 800
  const effectiveStroke = 4
  const strokeDist = 20

  g.noStroke()
  g.fill(c)

  layers.forEach((layer, i) => {
    if (layer.skip) return
    const rad = layers.length*strokeDist - i*strokeDist

    peaks.forEach(([x, y], i) => {
      drawNoiseShape(x+xOff, y+yOff, i + layer.z, rad, points, g)
    })

    peaks.forEach(([x, y], i) => {
      g.erase()
      drawNoiseShape(
        x+xOff,
        y+yOff,
        i + layer.z,
        rad-(effectiveStroke*layer.strokeMod),
        // rad-(effectiveStroke*layer.strokeMod*map(noise(x, y), 0, 1, 0.1, 2)),
        points,
        g
      )
      g.noErase()
    })
  })

  image(g, -width/2, -height/2)
}

function drawNoiseShape(x, y, z, radius, points, graphic=window) {
  drawShape(
    points, {
      drawFn: createCurveVertexFn(graphic),
      xyFn: noiseXY(x, y, z, radius),
      beforeFn(drawFn, xyFn, points, _o) {
        graphic.beginShape()
        drawFn(xyFn((-1+_o)/points, -1))
      },
      afterFn(drawFn, xyFn, points, _o) {
        drawFn(xyFn((0+_o)/points, 0))
        drawFn(xyFn((1+_o)/points, 1))
        graphic.endShape()
      },
    }
  )
}




const noiseXY = (cx, cy, z, maxR) => (progress) => {
  const angle = progress*TWO_PI
  const [rx, ry] = getXYRotation(angle, 1, 1000, 1000)
  const r = noise(rx, ry, z) * maxR
  return getXYRotation(angle, r, cx, cy)
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

function createCurveVertexFn(graphic=window) {
  return ([x, y]) => graphic.curveVertex(x, y)
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
  for (let i = 0; i < t; i++) out.push(fn(i, t))
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