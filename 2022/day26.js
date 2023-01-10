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

  background(0);
  const size = 5
  // console.log(mouseX, mouseY)

  const points = times(80, i => [rnd(0, width), rnd(0, height)])

  for (let x0=0; x0 <= width+size*3; x0 += size)
  for (let y0=0; y0 <= height+size*3; y0 += size) {
    // const rotation = radians(map(noise(x0, y0), 0, 1, 0, 90))
    // const x2 = x0 + cos(rotation) * (size+4)
    // const y2 = y0 + sin(rotation) * (size+4)
    const angle = map(noise(x0/200, y0/200), 0, 1, PI*.8, HALF_PI+PI*1.2)
    const [x1, y1] = getXYRotation(angle, size*2, x0, y0)

    const distFromMinPoint = min(...points.map(([_x, _y]) => dist(x0, y0, _x, _y)))
    // const q = min(1, Math.sqrt(
    //   (Math.sin(3*((x_)**2+(y_)**2) )) ** 2
    //   / (Math.sin(6*(Math.max(x_**2, y_**2)))**2)
    // ))
    // const hue = hfix(map(q, 0,1, -200, 160))

    // const hue = hfix(map(sin(x0)/cos(y0), 0,1, -200, 160))
    // const hue = hfix(map(
    //   min(dist(x0, y0, width/2,height/2), dist(x0, y0, 0,0), dist(x0, y0, width,height), dist(x0, y0, 0,height), dist(x0, y0, width,0))
    //   , 0,0.25, -0, 100))
    // const hue = hfix(
    //   map(
    //     distFromMinPoint,
    //     0,
    //     1,
    //     -0,
    //     100
    //   )
    // )
    // const hue = hfix(map(noise(x0+1, y0+1),0,1,0,220))

    // const c = color(hue,70,85)
    const c = distFromMinPoint < 30 ? color(0, 0, 100) : color(190, 90, 90)

    strokeWeight(size)
    stroke(0)
    line(x0, y0, x1, y1)

    strokeWeight(size*0.95)
    stroke(c)

    line(x0, y0, x1, y1)

    strokeWeight(size*0.05)
    stroke(0)
    line(x0, y0, x1, y1)
  }


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

