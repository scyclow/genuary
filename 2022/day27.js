function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}



const BUFFER = 100
function preload() {
}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
  noiseSeed(rnd(1000000))
}

function draw() {
  noLoop()
  // translate(width/2, height/2)

  const c1 = color('#2E294E')
  const c2 = color('#541388')
  const c3 = color('#F1E9DA')
  const c4 = color('#FFD400')
  const c5 = color('#D90368')

  noStroke()
  background(c1)

  noStroke()

  const thickness = 20
  const h = hfix(rnd(360))

  const cornerToCorner = dist(0,0, width, height)
  const t = 4*int(cornerToCorner)/thickness + 1

  // const y = rnd(0, height)
  // const x = rnd(0, width)
  // const y = rnd() < 0.5 ? 0 : height
  // const x = rnd() < 0.5 ? 0 : width

  const y = rnd() < 0.5 ? -BUFFER : height+BUFFER/2
  const x = rnd() < 0.5 ? -BUFFER : width+BUFFER/2
  times(t, i => {

    fill([c1, c2, c3, c4, c5][int(rnd(5))])
    if (i) drawNoiseShape(x, y, i/50, (t-i) * thickness, 400)
  })



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

