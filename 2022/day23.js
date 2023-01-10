function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


function setup() {
  __canvas = createCanvas(window.innerWidth, window.innerHeight);
}



const BUFFER = 900
function draw() {
  noLoop()
  colorMode(HSB, 360, 100, 100, 100)
  noiseSeed(rndint(1_000_000_000))

  translate(width/2, height/2)

  noStroke()
  times(width+height, i => {
    fill(lerpColor(
      color(140, 5, 50),
      color(130, 15, 90),
      i/(width+height)
    ))
    circle(0,0,width+height-i)
  })

fill(color(30, 30, 25))
rect(-width/2, -150, width, height)


  times(10, i => {
    const x = rnd(-width/2, width/2)
    const y = rnd(-height/2, height/2)
    push()
    const scl = 0.2 + map((y+height/2)/height, 0, 1, 0, 0.8)
    scale(scl)
    drawLeaf(x, y, rnd(5, 20), color(75, 20, 90, scl*100))
    pop()
  })





}



function drawLeaf(startX, startY, h, c) {
  push()


  noFill()
  const noiseDivisor = 200
  const blockHeight = 5
  const angleDivisor = 3

  const avenueCoords = generateBranchCoords(startX, startY, PI, blockHeight*8, angleDivisor, noiseDivisor, h)



  const streetCoordsList = []

  avenueCoords.forEach((coord, ix) => {
    if (ix >= avenueCoords.length - 2 || ix<2) return
    const l1 = int(noise(startX, startY, ix/20) * (90-ix)**4/1000000) * (ix%2 ? 0.75 : 1)
    const l2 = int(noise(startX, startY, ix/20) * (90-ix)**4/1000000) * (ix%2 ? 0.75 : 1)


    streetCoordsList.push(generateBranchCoords(coord[0], coord[1], HALF_PI*1.5, blockHeight, angleDivisor, noiseDivisor, l1))
    streetCoordsList.push(generateBranchCoords(coord[0], coord[1], HALF_PI+PI*0.75, blockHeight, angleDivisor, noiseDivisor, l2))
  })

  const branchCoordList = []
  streetCoordsList.forEach((streetCoord, ix) => {
    streetCoord.forEach((coord, jx) => {
      branchCoordList.push(generateBranchCoords(coord[0], coord[1], coord[2]+HALF_PI*rnd(0.27, 0.33), blockHeight, angleDivisor, noiseDivisor, 4))
      branchCoordList.push(generateBranchCoords(coord[0], coord[1], coord[2]-HALF_PI*rnd(0.27, 0.33), blockHeight, angleDivisor, noiseDivisor, 4))
    })
  })

// fill(color(120, 80, 20))
// noStroke()
//   beginShape()
//   curveVertex(avenueCoords[0][0], avenueCoords[0][1])
//   curveVertex(avenueCoords[0][0], avenueCoords[0][1])
//   for (let i=0; i<streetCoordsList.length; i+=2) {
//     const streetCoords = streetCoordsList[i]
//     const lastStreetCord = streetCoords[streetCoords.length-1]
//     curveVertex(lastStreetCord[0], lastStreetCord[1])
//   }
//   curveVertex(avenueCoords[avenueCoords.length-1][0], avenueCoords[avenueCoords.length-1][1])

//   for (let i=streetCoordsList.length-1; i>=0; i-=2) {
//     const streetCoords = streetCoordsList[i]
//     const lastStreetCord = streetCoords[streetCoords.length-1]
//     curveVertex(lastStreetCord[0], lastStreetCord[1])
//   }

//   curveVertex(avenueCoords[0][0], avenueCoords[0][1])
//   curveVertex(avenueCoords[0][0], avenueCoords[0][1])
//   endShape()



  stroke(0)
  strokeWeight(2*1.5)
  beginShape()
  avenueCoords.forEach(coord => {
    vertex(coord[0], coord[1])
  })
  endShape()


  strokeWeight(1*1.5)
  streetCoordsList.forEach(streetCoords => {
    beginShape()
    streetCoords.forEach(coord => {
      vertex(coord[0], coord[1])
    })
    endShape()
  })


  strokeWeight(0.5*1.5)
  branchCoordList.forEach((branchCoords, i) => {
    beginShape()
    branchCoords.forEach((coord, j) => {
      // circle(coord[0], coord[1], 5)
      vertex(coord[0], coord[1])
    })
    endShape()
  })

  stroke(c)
  strokeWeight(2)
  beginShape()
  avenueCoords.forEach(coord => {
    vertex(coord[0], coord[1])
  })
  endShape()


  strokeWeight(1)
  streetCoordsList.forEach(streetCoords => {
    beginShape()
    streetCoords.forEach(coord => {
      vertex(coord[0], coord[1])
    })
    endShape()
  })


  strokeWeight(0.5)
  branchCoordList.forEach((branchCoords, i) => {
    beginShape()
    branchCoords.forEach((coord, j) => {
      // circle(coord[0], coord[1], 5)
      vertex(coord[0], coord[1])
    })
    endShape()
  })
  pop()
}



function generateBranchCoords(startX, startY, startAngle, blockHeight, angleDivisor, noiseDivisor, limit=10000) {
  const coords = [[startX, startY, startAngle]]
  let x = startX
  let y = startY
  let angle = startAngle
  // let i = 0

  // while (
    // y <= height/2 + BUFFER
    // && y >= -height/2 - BUFFER
    // &&  x <= width/2 + BUFFER
    // && x >= -width/2 - BUFFER
    // && i<limit
  // ) {
  for (let i=0; i<limit; i++) {
    const _angle = map(
      noise(x/noiseDivisor, y/noiseDivisor),
      0,
      1,
      angle - HALF_PI/angleDivisor,
      angle + HALF_PI/angleDivisor,
    )
    const [nextX, nextY] = getXYRotation(_angle, blockHeight, x, y)
    coords.push([nextX, nextY, _angle])
    x = nextX
    y = nextY
    // i++
  }
  return coords
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
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

const rndint = (mn, mx) => int(rnd(mn, mx))

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

