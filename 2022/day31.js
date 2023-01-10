function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

let fontData
function preload() {
  fontData = loadFont('ShipporiMinchoB1-Regular.ttf');

}

function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  noLoop()
  translate(width/2, height/2)
  colorMode(HSL, 360, 100, 100, 100)

  noStroke()

  // DARK_C = color(150, 20, 15)
  // LIGHT_C = color(78, 6, 91)
  // ACCENT_C = color(5, 80, 64)

  background(0)


  const maxX = $outline.reduce((max, c) => c[0] > max ? c[0] : max, 0)
  const maxY = $outline.reduce((max, c) => c[1] > max ? c[1] : max, 0)
  const minX = $outline.reduce((min, c) => c[0] < min ? c[0] : min, 0)
  const minY = $outline.reduce((min, c) => c[1] < min ? c[1] : min, 0)

  console.log(maxX, maxY)
  console.log(minX, minY)

  textFont(fontData)
  textAlign(CENTER)

  scale(5)
  translate(-25,37)

  const dotPalette = rndPalette()

  drawColorDots(dotPalette)

  // times(8000, i => {
  //   const x = rnd(-20, 70)
  //   const y = rnd(-100, 32)

  //   if (
  //     inPolygon([x, y], $hole1) ||
  //     inPolygon([x, y], $hole2) ||
  //     !inPolygon([x, y], $outline)
  //   ) {
  //     textSize(rnd(3))
  //     // if (rnd() < 0.9) fill(LIGHT_C)
  //     // else fill(ACCENT_C)
  //     fill(color(hfix(rnd(5, 70)), 80, 64))
  //     text('$', x, y)

  //     fill(LIGHT_C)
  //     text('$', x+0.25, y+0.25)
  //   }
  // })

  // times(8000, i => {
  //   const x = rnd(-20, 70)
  //   const y = rnd(-100, 32)

  //   if (
  //     inPolygon([x, y], $hole1) ||
  //     inPolygon([x, y], $hole2) ||
  //     !inPolygon([x, y], $outline)
  //   ) {
  //     textSize(rnd(3))
  //     // if (rnd() < 0.9) fill(LIGHT_C)
  //     // else fill(ACCENT_C)
  //     fill(color(hfix(rnd(5, 70)), 80, 64))
  //     text('$', x, y)

  //     fill(LIGHT_C)
  //     text('$', x+0.25, y+0.25)
  //   }
  // })
  // scale(5)
  // const coords = get$Coords($hole2)

  // textSize(2)
  // beginShape()
  // $outline.forEach((coord, i) => {
  //   const [x, y] = coord
  //   vertex(coord[0], coord[1])
  // })
  // endShape()


}

  const drawColorDots = c => {
    times(100_000, i => {
      const x = rnd(-40, 90)
      const y = rnd(-120, 50)

      if (
        !inPolygon([x, y], $hole1) &&
        !inPolygon([x, y], $hole2) &&
        inPolygon([x, y], $outline)
      ) return

      const distances = [
        [-40,-120],
        [-40,50],
        [90,-120],
        [90, 50],
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
      circle(x, y, rnd(0.4, 0.25))


    })
  }


function rndPalette() {

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

  return sample([side1, side2, side3, side4, side5, side6])
}


const $outline = [[48,-28],[50,-20],[50,-20],[47,-9],[39,-1],[29,1],[29,1],[29,3],[29,10],[28,12],[27,12],[27,12],[26,12],[26,10],[26,10],[26,3],[24,1],[24,1],[11,-5],[6,-17],[6,-17],[7,-21],[11,-23],[11,-23],[14,-22],[16,-18],[16,-18],[15,-15],[14,-13],[14,-13],[14,-12],[13,-10],[13,-10],[16,-5],[23,-3],[23,-3],[24,-3],[25,-3],[26,-5],[26,-5],[26,-30],[24,-33],[24,-33],[15,-37],[15,-37],[9,-43],[7,-52],[7,-52],[9,-60],[14,-67],[24,-71],[24,-71],[26,-73],[26,-73],[26,-78],[26,-80],[27,-80],[27,-80],[28,-80],[29,-78],[29,-78],[29,-73],[31,-71],[31,-71],[43,-66],[48,-55],[48,-55],[47,-51],[43,-49],[43,-49],[40,-50],[38,-54],[38,-54],[39,-57],[39,-57],[40,-60],[40,-60],[37,-65],[31,-68],[31,-68],[31,-68],[29,-66],[29,-66],[29,-42],[31,-39],[31,-39],[41,-34],[41,-34],[41,-34],[48,-28], [50,-20], [50,-20]]
const $hole1 = [[23,-43],[26,-44],[26,-44],[26,-65],[25,-67],[23,-67],[23,-67],[16,-62],[13,-54],[13,-54],[15,-48],[21,-44],[23,-43]]
const $hole2 = [[30,-30],[29,-28],[29,-28],[29,-5],[29,-3],[31,-3],[31,-3],[40,-8],[43,-17],[43,-17],[36,-27],[36,-27],[31,-29],[31,-29], [30,-30]]


function inPolygon(p, polygon) {
  const infLine = [width*2, height*2]
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

