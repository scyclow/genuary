function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}

let ketchup;

let SCALE = 1
SCALE = 0.5

function preload() {
  ketchup = loadImage("ketchup.jpg");
}

function setup() {

  __canvas = createCanvas(1024*SCALE, 1365*SCALE);
}

function draw() {
  noLoop()

  // image(ketchup, 0, 0)
  noStroke()
  scale(SCALE)
  background(0)
  dither4(ketchup)
}


function dither4(img) {
  colorMode(HSB, 360, 100, 100, 100)
  img.loadPixels()
  strokeWeight(8)

  const maxDist = dist(width/2, height/2, 0,0)
  const size = 3
  const quantRound = 200
  const noiseDivisor = 9000
  const colorNoiseDivisor = 150
  for (let x = 0; x < img.width; x+=size)
  for (let y = 0; y < img.height; y+=size) {
    const cNoise = size
    const c =  img.get(x-int(random(-cNoise, cNoise)), y-int(random(-cNoise, cNoise)))
    const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`


    let h = hue(rgb)
    const isRed = h < 20 || h > 340

    h = (
      isRed
        ? 0
        : h + noise(x/colorNoiseDivisor, y/colorNoiseDivisor) * 360
    )

    // h = h + (random() < 0.5 ? 50 : -50)
    const s = saturation(rgb)
    const l = lightness(rgb)

    const c_ = color(
      hfix(h),
      s + noise(x/colorNoiseDivisor, y/colorNoiseDivisor) * 40,
      l + noise(x/colorNoiseDivisor, y/colorNoiseDivisor) * 40,
    )
    fill(c_)

    let [_x, _y] = [x, y]
    beginShape()
    for (let i=0; i<20; i++) {
      curveVertex(_x, _y)
      const out = getXYRotation(
        noise(
          _x/noiseDivisor,
          _y/noiseDivisor
        ) * TWO_PI * 2,
        5,
        _x,
        _y
      )
      _x = out[0]
      _y = out[1]
    }
    endShape()
    // circle(
    //   x+random(-size, size),
    //   y+random(-size, size),
    //   size
    // )

    // rect(x, y, size, size)
  }
}

function dither3(img) {
  colorMode(HSB, 360, 100, 100, 100)
  img.loadPixels()
  strokeWeight(8)

  const maxDist = dist(width/2, height/2, 0,0)
  const size = 3
  const quantRound = 200
  const noiseDivisor = 9000
  for (let x = 0; x < img.width; x+=size)
  for (let y = 0; y < img.height; y+=size) {
    const cNoise = size
    const c =  img.get(x-int(random(-cNoise, cNoise)), y-int(random(-cNoise, cNoise)))
    const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`


    let h = hue(rgb)
    const isRed = h < 20 || h > 340

    h = (
      isRed
        ? 0
        : h + noise(x/150, y/150) * 360
    )

    // h = h + (random() < 0.5 ? 50 : -50)
    const s = saturation(rgb)
    const l = lightness(rgb)

    const c_ = color(
      hfix(h),
      isRed ? 100 : s,
      isRed ? 100 : l,
    )
    fill(c_)

    circle(
      x+random(-size, size),
      y+random(-size, size),
      size
    )

  }
}

function dither2(img) {
  img.loadPixels()
  strokeWeight(8)

  const maxDist = dist(width/2, height/2, 0,0)
  const size = 3
  const quantRound = 200
  const noiseDivisor = 9000
  for (let x = 0; x < img.width; x+=size)
  for (let y = 0; y < img.height; y+=size) {
    const cNoise = size
    const c =  img.get(x-int(random(-cNoise, cNoise)), y-int(random(-cNoise, cNoise)))
    const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`


    let h = hue(rgb)
    const isRed = h < 20 || h > 340

    h = (
      isRed
        ? 0
        : h + noise(x/150, y/150) * 360
    )

    // h = h + (random() < 0.5 ? 50 : -50)
    const s = saturation(rgb)
    const l = lightness(rgb)

    const c_ = color(
      hfix(h),
      s + noise(x/150, y/150) * 60,
      l + noise(x/150, y/150) * 40,
    )
    fill(c_)

    let [_x, _y] = [x, y]
    beginShape()
    for (let i=0; i<20; i++) {
      curveVertex(_x, _y)
      const out = getXYRotation(
        noise(
          _x/noiseDivisor,
          _y/noiseDivisor
        ) * TWO_PI * 2,
        5,
        _x,
        _y
      )
      _x = out[0]
      _y = out[1]
    }
    endShape()
    circle(
      x+random(-size, size),
      y+random(-size, size),
      size
    )

    // rect(x, y, size, size)
  }
}

function dither1(img) {
  colorMode(HSB, 360, 100, 100, 100)
  img.loadPixels()
  strokeWeight(8)

  const maxDist = dist(width/2, height/2, 0,0)
  const size = 3
  const quantRound = 200
  const noiseDivisor = 9000
  for (let x = 0; x < img.width; x+=size)
  for (let y = 0; y < img.height; y+=size) {
    const cNoise = size
    const c =  img.get(x-int(random(-cNoise, cNoise)), y-int(random(-cNoise, cNoise)))
    const rgb = `rgb(${c[0]},${c[1]}, ${c[2]})`


    let h = hue(rgb)
    const isRed = h < 20 || h > 340

    h = (
      isRed
        ? 0
        : h + noise(x/150, y/150) * 360
    )

    // h = h + (random() < 0.5 ? 50 : -50)
    const s = saturation(rgb)
    const l = lightness(rgb)

    const c_ = color(
      hfix(h),
      s + noise(x/150, y/150) * 60,
      l + noise(x/150, y/150) * 40,
    )
    fill(c_)

    let [_x, _y] = [x, y]
    beginShape()
    for (let i=0; i<20; i++) {
      curveVertex(_x, _y)
      const out = getXYRotation(
        noise(
          _x/noiseDivisor,
          _y/noiseDivisor
        ) * TWO_PI * 2,
        5,
        _x,
        _y
      )
      _x = out[0]
      _y = out[1]
    }
    endShape()
    circle(
      x+random(-size, size),
      y+random(-size, size),
      size
    )

    // rect(x, y, size, size)
  }
}

function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    sin(deg) * radius + cx,
    cos(deg) * radius + cy,
  ]
}

const hfix = h => int((h + 360)) % 360

