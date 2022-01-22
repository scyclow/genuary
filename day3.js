function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}



function preload() {}

function setup() {

  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()
  noFill()
  colorMode(HSB, 360, 100, 100, 100)
  translate(width/2, height/2)
  noiseSeed(rnd(1000000000))
  background(0, 100, 5)

  const shapePointCount = 5000//00
  const shapeX = rnd(0, width/2-250)
  const shapeY = rnd(250-height/2, 0)
  const innerRadius = 100
  const outterRadius = 600

  const bgc = color(180, 0, 100, 100)
  const fc = color(140, 50, 100, 100)
  console.log(shapeX, shapeY)

  times(400, l => {
    drawAura(shapeX, shapeY, shapePointCount, 800-l, color(330, 40, 100, l/100))
  })
  noFill()
  // drawShape(0, 0, 2000, 100, 440, color(140, 10, 100, 100))
  times(40, l => {
    drawShape(shapeX, shapeY, shapePointCount*0.8, 160-l, 440-l, color(hfix(rnd(140, 160)), 40, 100, 30))
  })

  times(10, l => {
    drawShape(shapeX, shapeY, shapePointCount/3, 160-l, 420-l, color(hfix(rnd(140, 160)), 35, 100, 35))
  })

}

function drawAura(shapeX, shapeY, shapePointCount, radius, c) {
  stroke(c)
  strokeWeight(1)
  const shapeNoiseDivisor = 5

  const shapeCoords = times(shapePointCount, point => {
    const p = (point + shapePointCount) % shapePointCount
    const progress = p * TWO_PI / shapePointCount

    const coords = getXYRotation(progress, 2, 100, 100)
    const _x = (coords[0] + 200)/(shapeNoiseDivisor*2)
    const _y = (coords[1] + 200)/(shapeNoiseDivisor*2)
    const _z = 1/shapeNoiseDivisor
    const _r = noise(_x*2, _y*2, _z) * radius

    return getXYRotation(
      progress,
      _r,
      shapeX,
      shapeY,
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

function drawShape(shapeX, shapeY, shapePointCount, innerRadius, outterRadius, c) {
  const shapeNoiseDivisor = 5
  const lineNoiseDivisor = 1
  const linePoints = 30

  const innerShapeCoords = times(shapePointCount, point => {
    const p = (point + shapePointCount) % shapePointCount
    const progress = p * TWO_PI / shapePointCount

    const coords = getXYRotation(progress, 2, 100, 100)
    const _x = (coords[0] + 200)/(shapeNoiseDivisor*2)
    const _y = (coords[1] + 200)/(shapeNoiseDivisor*2)
    const _z = 0
    const _r = noise(_x*2, _y*2, _z) * innerRadius - rnd(0, 10)

    return getXYRotation(
      progress,
      _r,
      shapeX,
      shapeY,
    )
  })

  const outterShapeCoords = times(shapePointCount, point => {
    const p = (point + shapePointCount) % shapePointCount
    const progress = p * TWO_PI / shapePointCount

    const coords = getXYRotation(progress, 2, 100, 100)
    const _x = (coords[0] + 200)/shapeNoiseDivisor
    const _y = (coords[1] + 200)/shapeNoiseDivisor
    const _z = 1/shapeNoiseDivisor
    const _r = noise(_x, _y, _z) * outterRadius + rnd(0, 10)

    return getXYRotation(
      progress,
      _r,
      shapeX,
      shapeY,
    )
  })


  // innerShapeCoords.forEach(([x, y]) => {
  //   circle(x, y, 3)
  // })

  // outterShapeCoords.forEach(([x, y]) => {
  //   circle(x, y, 3)
  // })

  strokeWeight(0.5)
  times(shapePointCount, i => {
    stroke(c)
    const [x0, y0] = innerShapeCoords[i]
    const [x1, y1] = outterShapeCoords[i]
    const angleAdj = i <= shapePointCount/2 ? HALF_PI : HALF_PI + PI
    let angle = angleAdj-atan((y1 - y0) / (x1 - x0))

    const len = dist(x0, y0, x1, y1)


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

      // console.log(_x, _y)
      curveVertex(_x, _y)
    })
    endShape()

    // line(x0, y0, x1, y1)
  })
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