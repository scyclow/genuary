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

  noStroke()



  background(255)

  const rectsPerWidth = 18
  const rectsPerHeight = 9
  const rectWidth = width/rectsPerWidth
  const rectHeight = height/rectsPerHeight

  const yDiff = 100/rectsPerHeight
  const xDiff = 360/rectsPerWidth

  const hueShift = 180


  for (let y=0; y<rectsPerHeight; y+=1) {
    for (let x=0; x<rectsPerWidth; x+=1) {
      fill(hfix(x*xDiff), 100, y*10)
      rect(
        x*rectWidth,
        y*rectHeight,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*xDiff), y*yDiff, 100)
      rect(
        x*rectWidth,
        y*rectHeight+rectHeight/2,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*xDiff), y*yDiff, y*yDiff)
      rect(
        x*rectWidth+rectWidth/2,
        y*rectHeight,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*xDiff), y*yDiff, 100-y*yDiff)
      rect(
        x*rectWidth+rectWidth/2,
        y*rectHeight+rectHeight/2,
        rectWidth/2,
        rectHeight/2
      )


      fill(hfix(x*xDiff+hueShift), 100, y*10)
      ellipse(x*rectWidth+rectWidth/2, y*rectHeight+rectHeight/2, rectWidth*0.75, rectHeight*0.75)

      fill(hfix(x*xDiff+hueShift), y*yDiff, y*yDiff)
      ellipse(x*rectWidth+rectWidth/2, y*rectHeight+rectHeight/2, rectWidth*0.5, rectHeight*0.5)

      fill(hfix(x*xDiff+hueShift), y*yDiff, 100)
      ellipse(x*rectWidth+rectWidth/2, y*rectHeight+rectHeight/2, rectWidth*0.25, rectHeight*0.25)
    }
  }
}


function testStrip1() {
  colorMode(HSB, 360, 100, 100, 100)

  noStroke()
  background(255)

  const rectsPerWidth = 18
  const rectsPerHeight = 9
  const rectWidth = width/rectsPerWidth
  const rectHeight = height/rectsPerHeight


  for (let y=0; y<rectsPerHeight; y+=1) {
    for (let x=0; x<rectsPerWidth; x+=1) {
      fill(hfix(x*20), 100, y*10)
      rect(
        x*rectWidth,
        y*rectHeight,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*20), y*10, 100)
      rect(
        x*rectWidth,
        y*rectHeight+rectHeight/2,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*20), 100, 100-y*10)
      rect(
        x*rectWidth+rectWidth/2,
        y*rectHeight,
        rectWidth/2,
        rectHeight/2
      )

      fill(hfix(x*20), 100-y*10, 100)
      rect(
        x*rectWidth+rectWidth/2,
        y*rectHeight+rectHeight/2,
        rectWidth/2,
        rectHeight/2
      )


      fill(hfix(x*20+180), 100, y*10)
      ellipse(x*rectWidth+rectWidth/2, y*rectHeight+rectHeight/2, rectWidth/2, rectHeight/2)
    }
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

