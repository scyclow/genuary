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

  colorMode(HSL, 360, 100, 100, 100)

  background(0, 0, 50)

  noStroke()

  const side1 = [
    color(240, 100, 50),
    color(0),
    color(180, 100, 50),
    color(120, 100, 50),
  ]


  const side2 = [
    color(0, 100, 50),
    color(60, 100, 50),
    color(0),
    color(120, 100, 50),
  ]

  const side3 = [
    color(240, 100, 50),
    color(0),
    color(300, 100, 50),
    color(0, 100, 50),
  ]


  const side4 = [
    color(180, 100, 50),
    color(255),
    color(240, 100, 50),
    color(300, 100, 50),
  ]


  const side5 = [
    color(300, 100, 50),
    color(255),
    color(0, 100, 50),
    color(60, 100, 50),
  ]


    const side6 = [
    color(60, 100, 50),
    color(255),
    color(180, 100, 50),
    color(240, 100, 50),
  ]


  const drawRects = c => {
    fill(c[0])
    rect(0, 0, width/2, height,2)


    fill(c[1])
    rect(width/2,0, width/2, height,2)


    fill(c[2])
    rect(0, height/2, width/2, height,2)


    fill(c[3])
    rect(width/2, height/2, width/2, height,2)
  }

  // drawRects(side6)


  const drawDots = c => {
    times(500000, i => {
      const x = rnd(width)
      const y = rnd(height)


      const distances = [
        [0,0],
        [0,height],
        [width,0],
        [width, height],
      ].map(([_x, _y]) => dist(x, y, _x, _y))

      const totalDistace = distances.reduce((a, x) => a + x, 0)

      const threshold = rnd()
      let runningSum = 0
      let ix = 0
      for (let d of distances) {
        const amt = d/totalDistace
        runningSum += amt
        if (threshold < runningSum) {
          break
        } else {
          ix++
        }
      }

      fill(c[ix])
      circle(x, y, rnd(2,3))


    })
  }
  drawDots(sample([
    side1,
    side2,
    side3,
    side4,
    side5,
    side6,
  ]))


  // noStroke()

  // const thickness = 20
  // const x = rnd() < 0.5 ? 0 : width
  // const y = rnd() < 0.5 ? 0 : height
  // const h = hfix(rnd(360))

  // const cornerToCorner = dist(0,0, width, height)
  // const t = 2*int(cornerToCorner)/thickness + 1
  // times(t, i => {
  //   if (i%2) fill(color(h, 85, 90))
  //   else fill(0)

  //   if (i) drawNoiseShape(x, y, 0, (t-i) * thickness, 400)
  // })

  // stroke(color(180, 100, 100))
  // times(40, i => {
  //   if (i) drawNoiseShape(width,height, 0, i * 100, 300)
  // })


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
  const r = noise(rx/3, ry/3, z) * maxR
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

