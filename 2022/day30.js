function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()
  colorMode(HSL, 360, 100, 100, 100)

  translate(width/2, height/2)
  background(0)

  rectMode(CENTER)

  // times(10, i => {
    drawTree(0, height/2, 60, 500)
  // })
}

function drawTree(startX, startY, w, h) {
  fill('brown')
  let branches = drawBranch(startX, startY, PI, w, h)

  const drawnBranches = []

  let i = 0

  while (branches.length && i < 10_000) {
    const branch = branches.pop()
    drawnBranches.push(branch)
    const newBranches = drawBranch(...branch)
    branches = branches.concat(newBranches)
    i++
  }

  for (let branch of drawnBranches) {
    const [endX, endY] = getXYRotation(branch[2], branch[4], branch[0], branch[1])
    times(50, i => {
      fill(rnd(10, 90), 80, 50)
      // if (rnd() < 0.1) fill('#ffcccc')
      // else fill('green')
      const [x, y] = getXYRotation(rnd(TWO_PI), rnd(20), endX, endY)
      rect(
        x, y, rnd(5), rnd(5)
      )
    })
  }
}
function drawBranch(startX, startY, angle, w, l) {
  if (w <= 5) return []

  const newBranches = []

  times(100, i => {
    const startAngleAdj = PI * posOrNeg()
    const [x0, y0] = getXYRotation(angle + startAngleAdj, rnd(w/2), startX, startY)

    const [x, y] = getXYRotation(angle, rnd(l), x0, y0)

    rect(x, y, rnd(w), rnd(w))
    if (
      (i < 50 && rnd() < 0.005) ||
      rnd() < 0.04
    ) {
      const newAngleAdj = HALF_PI * rnd(0.2, 0.6) * posOrNeg()
      newBranches.push([x, y, angle + newAngleAdj, w/2, l/2])
    }
  })

  return newBranches
}


function drawBranch0(startX, startY, angle, width, length) {
  fill('brown')
  times(100, i => {

    const startAngleAdj = PI * posOrNeg()
    const [x0, y0] = getXYRotation(angle + startAngleAdj, rnd(width/2), startX, startY)

    const [x, y] = getXYRotation(angle, rnd(length), x0, y0)

    rect(x, y, rnd(width), rnd(width) )

    if (rnd() < 0.02) {
      const newAngleAdj = HALF_PI * rnd(0.2, 0.6) * posOrNeg()
      drawBranch(x, y, angle + newAngleAdj, width/2, length/2)
    }
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
const sample = arr => arr[int(rnd(arr.length))]

