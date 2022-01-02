function keyPressed() {
  if (keyCode === 83) {
    saveCanvas(__canvas, 'genuary-' + Date.now(), 'png');
  }
}


let gears, OFFSET, BASE_HUE, HUE_CHANGE, HUE_COUNTER, __bgGraphic
const GRAPHIC_RESOLUTION = 4
const points = 100
const rotationMax = 15
const gearsN = 5


let ellapsed = 0
function setup() {
  __canvas = createCanvas(2500, 1600);
  colorMode(HSB, 360, 100, 100, 100)


  BASE_HUE = int(rnd(0,360))
  HUE_CHANGE = int(rnd(1, 20))
  HUE_COUNTER = int(rnd(60, 180))


  OFFSET = 4//int(rnd(4,9))

  HUE = int(rnd(0,360))
  DARK_C = color(HUE, 26, 25)
  LIGHT_C = color(hfix(HUE+288), 6, 91)
  PRIMARY_C = color(hfix(HUE), 36, 55)

  ACCENT1_C = color(hfix(HUE+40), 100, 75)
  ACCENT1_L_C = color(hfix(HUE+45), 95, 95)
  ACCENT1_D_C = color(hfix(HUE+35), 65, 25)

  ACCENT2_C = color(hfix(HUE+215), 100, 65)
  ACCENT2_L_C = color(hfix(HUE+220), 100, 85)
  ACCENT2_D_C = color(hfix(HUE+210), 100, 45)


  gears = generateGears()



}

function draw() {


  noLoop()



  noFill()
  colorMode(HSB, 360, 100, 100, 100)
  strokeWeight(2)

  background(color('white'))
  stroke(0)

  noiseSeed(rnd(1000000000))
  // translate(width/2, height/2)



  // gears.forEach((gear, i) => {

  //   const _i = (ellapsed + gear.ellapsedAdj)/6

  //   // constant growth
  //   // gear.radia += 1/1000//noise(ellapsed/50, i)/1000

  //   gear.radia = gear.radiaStart + sin(_i/10)/25
  //   // gear.radia = gear.radiaStart + noise(ellapsed/200, i*2)/10


  //   // lathe malfunction
  //   // gear.rotation = gear.rotation + noise(ellapsed/200, i*2)/10

  //   // gear.rotation = gear.rotationStart + noise(ellapsed/200, i*2)/10


  // })





  // noFill()

  const startHue = int(rnd(360))
  const getC1 = adj => l => color((startHue + adj + l + 360) % 360, 26, 91, rnd(20, 40))
  const getC2 = adj => l => color((startHue + adj + l + 360) % 360, 72, 84, rnd(20, 40))

  background(color(180, 20, 100))

  const rosetteSize = 20
  const rosetteRad = rosetteSize/2
  strokeWeight(.5)
  times(125, x => {
    times(80, y => {
      const yProgress = y/80
      // stroke(lerpColor(
      //   color(hfix(startHue + 120), 100, 50 + 50 * y/40),
      //   color(hfix(startHue + 240), 100, 100 - 50 * y/40),
      //   x/125
      // ))

      const n = noise(x/80, y/80)
      stroke(
        color(
          hfix(0 + (n * 80) - ((x%5) * y/7)),
          90,
          yProgress*45
          // 100
        )
      )


      drawShape(
        points, {
          drawFn: curveVertexFn,
          xyFn: createSpirographFn(rosetteRad + x*rosetteSize, rosetteRad + y*rosetteSize + 4 * (1 - yProgress), rosetteRad, rosetteRad*.8 , generateGears(n)),
          beforeFn(drawFn, xyFn, points, _o) {
            beginShape()
            drawFn(xyFn((-1+_o)/points))
          },
          afterFn(drawFn, xyFn, points, _o) {
            drawFn(xyFn((0+_o)/points))
            drawFn(xyFn((1+_o)/points))
            endShape()
          },
        },
        3,
      )
    })
  })

      // const x = width/2
      // const y = height/2
      // drawShape(
      //   points, {
      //     drawFn: curveVertexFn,
      //     xyFn: createSpirographFn(x,y, 250, 250, generateGears(0.19)),
      //     beforeFn(drawFn, xyFn, points, _o) {
      //       beginShape()
      //       drawFn(xyFn((-1+_o)/points))
      //     },
      //     afterFn(drawFn, xyFn, points, _o) {
      //       drawFn(xyFn((0+_o)/points))
      //       drawFn(xyFn((1+_o)/points))
      //       endShape()
      //     },
      //   },
      //   1,
      // )


}

function generateGears(r) {
  const gears = [
    {
      rotation: 1,
      rotationStart: 1,
      radia: 1,
      radiaStart: 1,
      radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => i ? 1 : (p%2 ? 1 : prevRadius/baseRadius),
    },
    ...times(gearsN - 1, g => ({
      rotation: int(rnd(-rotationMax, rotationMax)),
      rotationStart: int(rnd(-rotationMax, rotationMax)),
      radia: r/8,
      radiaStart: r/8,
      radiaAdj: (p, i, _x, _y, baseRadius, prevRadius) => i ? 1 : (p%2 ? 1 : prevRadius/baseRadius),
    }))
  ]

  const totalRadia = gears.reduce((sum, g) => g.radia + sum, 0)
  return gears.map(g => ({
    ...g,
    radia: g.radia/totalRadia
  }))
}

function drawShape(points, fns, offset, start=0, finish=1) {
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

function createSpirographFn(x, y, baseRadius, prevRadius, gears) {
  return (progress, p) => gears.reduce(([_x, _y], gear, i) =>
    getXYRotation(
      progress * TWO_PI * gear.rotation,
      baseRadius * gear.radia * gear.radiaAdj(p, i, _x, _y, baseRadius, prevRadius),
      _x,
      _y
    ),
    [x, y]
  )
}


function outOfFocus() {

  const LAYERS = 15

  noFill()
  let radOutter = 300
  times(LAYERS, i => {
    radInner = radOutter * 0.75
    strokeWeight(max(2.5-i*0.5, 0.5))
    stroke((i*HUE_CHANGE+BASE_HUE)%360, 60, 80)
    // stroke(colors[i])
    drawShape(
      points, {
        drawFn: curveVertexFn,
        xyFn: createSpirographFn(0, 0, radOutter, radInner, gears),
        beforeFn(drawFn, xyFn, points, _o) {
          beginShape()
          drawFn(xyFn((-1+_o)/points))
        },
        afterFn(drawFn, xyFn, points, _o) {
          drawFn(xyFn((0+_o)/points))
          drawFn(xyFn((1+_o)/points))
          endShape()
        },
      },
      OFFSET,
    )
    radOutter = radOutter * 0.8

  })

  const xOff = 15
  const yOff = 15
  radOutter = 300

  times(LAYERS, i => {
    radInner = radOutter * 0.75

    // strokeWeight(max(2-i*0.5, 0.25))
    strokeWeight(max(2.5-i*0.5, 0.5))

    stroke((i*HUE_CHANGE+BASE_HUE+HUE_COUNTER)%360, 60, 80)
    // stroke(colors[i])
    drawShape(
      points, {
        drawFn: curveVertexFn,
        xyFn: createSpirographFn(xOff, yOff, radOutter, radInner, gears),
        beforeFn(drawFn, xyFn, points, _o) {
          beginShape()
          drawFn(xyFn((-1+_o)/points))
        },
        afterFn(drawFn, xyFn, points, _o) {
          drawFn(xyFn((0+_o)/points))
          drawFn(xyFn((1+_o)/points))
          endShape()
        },
      },
      OFFSET,
    )
    radOutter = radOutter * 0.8

  })
}








function sketches() {

  // scale(0.65)
  // scale(5)
  // translate(180, 150)





  // const rotations = [
  //   1,
  //   ...times(gears-1, g => int(rnd(-rotationMax, rotationMax)))
  // ]

  // const radia = [
  //   1,
  //   ...times(gears-1, g => rnd(0, 0.1))
  // ]




  // strokeWeight(10)
  // times(6, i => {
  //   stroke((i+5)*5, 60, 100)
  //   drawShape(
  //     points, {
  //       drawFn: pointFn,
  //       xyFn: createSpirographFn(0,0, rotations, [((i+5)*30), ...radia]),
  //         beforeFn(drawFn, xyFn, points) {
  //         beginShape()
  //         drawFn(xyFn(-1/points))
  //         // drawFn(xyFn(-1/points))
  //       },
  //       afterFn(drawFn, xyFn, points) {
  //         // drawFn(xyFn(0/points))
  //         drawFn(xyFn(0/points))
  //         endShape()
  //       },
  //     },
  //     3
  //   )
  // })



  // strokeWeight(6)
  // stroke(0)
  // times(6, i => {
  //   drawShape(
  //     points, {
  //       drawFn: pointFn,
  //       xyFn: createSpirographFn(0,0, rotations, [((i+5)*30),, ...radia]),
  //         beforeFn(drawFn, xyFn, points) {
  //         beginShape()
  //         drawFn(xyFn(-1/points))
  //         // drawFn(xyFn(-1/points))
  //       },
  //       afterFn(drawFn, xyFn, points) {
  //         // drawFn(xyFn(0/points))
  //         drawFn(xyFn(0/points))
  //         endShape()
  //       },
  //     },
  //     3
  //   )
  // })

  // (p+(2*o/OFFSET))/points


  // grafittiShit(gearsDirtyWide)
  // grafittiShit2(gearsDirty2)





  // strokeWeight(0)

  // DARK_C = color(0, 60, 80)
  // LIGHT_C = color(180, 60, 80)
  // const thickness = 50




  // const drawCurveShape = (startX, startY, xOffset, yOffset, thickness, changePoint, direction, change, startingRateOfChange, startAngle) => drawCurve(
  //   startX,
  //   startY,
  //   xOffset,
  //   yOffset,
  //   startAngle,
  //   1200,
  //   thickness,
  //   startingRateOfChange,
  //   (r, p) => {
  //     if (p > changePoint) {
  //       return direction*abs(r * change)
  //     }
  //     return r
  //   }
  // )

  // times(2, i => {
  //   const change1 = rnd(1.001, 1.015)
  //   const direction1 = rnd() < 0.5 ? 1 : -1
  //   const changePoint1 = rnd(10, 700)
  //   const change2 = rnd(1.001, 1.015)
  //   const direction2 = rnd() < 0.5 ? 1 : -1
  //   const changePoint2 = rnd(10, 700)
  //   const startAngle = HALF_PI//rnd(TWO_PI)
  //   const startX = rnd(-width*0.25, width*0.25)
  //   const startY = rnd(-height*0.25, height*0.25)
  //   const startingRateOfChange = TWO_PI/rnd(300, 1500)

  //   fill(DARK_C)
  //   drawCurveShape(startX, startY, -15, -15, thickness, changePoint1, direction1, change1, startingRateOfChange)
  //   drawCurveShape(startX, startY, -15, -15, thickness, changePoint2, direction2, change2, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, thickness, changePoint1, direction1, change1, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, thickness, changePoint2, direction2, change2, startingRateOfChange)

  //   drawCurveShape(startX, startY, 15, 15, thickness, changePoint1, direction1, -1*change1, startingRateOfChange, startAngle+PI)
  //   drawCurveShape(startX, startY, 15, 15, thickness, changePoint2, direction2, -1*change2, startingRateOfChange, startAngle+PI)
  //   drawCurveShape(startX, startY, 0, 0, thickness, changePoint1, direction1, -1*change1, startingRateOfChange, startAngle+PI)
  //   drawCurveShape(startX, startY, 0, 0, thickness, changePoint2, direction2, -1*change2, startingRateOfChange, startAngle+PI)

  //   fill(LIGHT_C)
  //   drawCurveShape(startX, startY, 0, 0, thickness-2, changePoint1, direction1, change1, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, thickness-2, changePoint2, direction2, change2, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, thickness-2, changePoint1, direction1, -1*change1, startingRateOfChange, startAngle+PI)
  //   drawCurveShape(startX, startY, 0, 0, thickness-2, changePoint2, direction2, -1*change2, startingRateOfChange, startAngle+PI)

  //   fill(DARK_C)
  //   drawCurveShape(startX, startY, 0, 0, 1, changePoint1, direction1, change1, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, 1, changePoint2, direction2, change2, startingRateOfChange)
  //   drawCurveShape(startX, startY, 0, 0, 1, changePoint1, direction1, -1*change1, startingRateOfChange, startAngle+PI)
  //   drawCurveShape(startX, startY, 0, 0, 1, changePoint2, direction2, -1*change2, startingRateOfChange, startAngle+PI)
  // })







  // actually looks kind of cool as a strobe


  // const colors = [
  //   LIGHT_C,
  //   ACCENT1_L_C,
  //   ACCENT2_L_C,
  //   ACCENT1_C,
  //   ACCENT2_C,
  //   PRIMARY_C,
  //   // ACCENT1_D_C,
  //   LIGHT_C,
  //   ACCENT2_D_C,
  // ]


  // times(8, i => {
  //   strokeWeight(0.5+i*0.25)
  //   stroke((i*20+135)%360, 60, 80)
  //   drawShape(
  //     points, {
  //       drawFn: curveVertexFn,
  //       xyFn: createSpirographFn(0, 0, (4+i)*30, (4+i-1)*30, gears),
  //       beforeFn(drawFn, xyFn, points, _o) {
  //         beginShape()
  //         drawFn(xyFn((-1+_o)/points))
  //       },
  //       afterFn(drawFn, xyFn, points, _o) {
  //         drawFn(xyFn((0+_o)/points))
  //         drawFn(xyFn((1+_o)/points))
  //         endShape()
  //       },
  //     },
  //     OFFSET
  //   )
  // })


  // times(8, i => {
  //   strokeWeight(0.5+i*0.25)
  //   stroke((i*20+90)%360, 60, 80)
  //   drawShape(
  //     points, {
  //       drawFn: curveVertexFn,
  //       xyFn: createSpirographFn(0, 0, (4+i)*30, (4+i-1)*30, gears),
  //       beforeFn(drawFn, xyFn, points, _o) {
  //         beginShape()
  //         drawFn(xyFn((-1+_o)/points))
  //       },
  //       afterFn(drawFn, xyFn, points, _o) {
  //         drawFn(xyFn((0+_o)/points))
  //         drawFn(xyFn((1+_o)/points))
  //         endShape()
  //       },
  //     },
  //     OFFSET
  //   )
  // })


  // times(8, i => {
  //   strokeWeight(0.5+i*0.25)
  //   stroke((i*20+45)%360, 60, 80)
  //   drawShape(
  //     points, {
  //       drawFn: curveVertexFn,
  //       xyFn: createSpirographFn(0, 0, (4+i)*30, (4+i-1)*30, gears),
  //       beforeFn(drawFn, xyFn, points, _o) {
  //         beginShape()
  //         drawFn(xyFn((-1+_o)/points))
  //       },
  //       afterFn(drawFn, xyFn, points, _o) {
  //         drawFn(xyFn((0+_o)/points))
  //         drawFn(xyFn((1+_o)/points))
  //         endShape()
  //       },
  //     },
  //     OFFSET
  //   )
  // })

  // times(8, i => {
  //   strokeWeight(0.5+i*0.25)
  //   stroke((i*20)%360, 60, 80)
  //   drawShape(
  //     points, {
  //       drawFn: curveVertexFn,
  //       xyFn: createSpirographFn(0, 0, (4+i)*30, (4+i-1)*30, gears),
  //       beforeFn(drawFn, xyFn, points, _o) {
  //         beginShape()
  //         drawFn(xyFn((-1+_o)/points))
  //       },
  //       afterFn(drawFn, xyFn, points, _o) {
  //         drawFn(xyFn((0+_o)/points))
  //         drawFn(xyFn((1+_o)/points))
  //         endShape()
  //       },
  //     },
  //     OFFSET
  //   )
  // })
}


function drawCurve(
   startX,
   startY,
   xOffset=0,
   yOffset=0,
   startAngle=HALF_PI,
   length=600,
   thickness=12,
   startingRateOfChange=TWO_PI/1200,
   modifyRateOfChange=(x)=>x
) {
  let x = startX
  let y = startY
  let angle = startAngle
  let rateOfChange = startingRateOfChange
  let distance = 1
  const maxThickness = thickness - 1

  for (let p = 0; p < length; p++) {
    const progress = p/length
    circle(
      x + (xOffset * progress),
      y + (yOffset * progress),
      1 + maxThickness * progress
    );
    ([x, y] = getXYRotation(angle, distance, x, y))

    rateOfChange = modifyRateOfChange(rateOfChange, p)
    if (abs(rateOfChange) > TWO_PI) return

    angle += rateOfChange
  }
}




function grafittiShit2(gears) {

  const hue = int(rnd(360))
  const rate = rnd(2, 40)



  // times(20, s => {
  //   radOutter = 300

  //   strokeWeight(rnd(0, 0.2))
  //   const start = rnd(-0.05, 1)
  //   const end = start + rnd(0, 0.5)
  //   times(12, i => {
  //     radInner = radOutter * 0.75

  //     stroke((i*rate+hue+180)%360, 60, 80)
  //     drawShape(
  //       points, {
  //         drawFn: curveVertexFn,
  //         xyFn: createSpirographFn(rnd(-4, 4), rnd(-4, 4), radOutter, radInner, gears),
  //         beforeFn(drawFn, xyFn, points, _o) {
  //           beginShape()
  //           drawFn(xyFn((-1+_o)/points))
  //         },
  //         afterFn(drawFn, xyFn, points, _o) {
  //           drawFn(xyFn((0+_o)/points))
  //           drawFn(xyFn((1+_o)/points))
  //           endShape()
  //         },
  //       },
  //       OFFSET,
  //     )
  //     radOutter = radOutter * 0.8

  //   })
  // })

  // erase()
  times(50, s => {
    strokeWeight(rnd(0, 0.2))
    const start = rnd(-0.05, 1)
    const end = start + rnd(0, 0.05)
    times(12, i => {
      stroke((i*rate+hue)%360, 60, 90)
      // fill(color('#000'))
      drawShape(
        points, {
          // drawFn: curveVertexFn,
          drawFn: pointFn,
          // drawFn: dollarFn,
          xyFn: createSpirographFn(0,0, i*30, i*25, gears),
          beforeFn(drawFn, xyFn, points, _o) {
            beginShape()
            // drawFn(xyFn((-1+_o)/points))
          },
          afterFn(drawFn, xyFn, points, _o) {
            // drawFn(xyFn((0+_o)/points))
            // drawFn(xyFn((1+_o)/points))
            endShape()
          },
        },
        4,

      )
    })
  })
  // noErase()
}

function grafittiShit(gears) {
  const hue = int(rnd(360))
  const rate = rnd(2, 40)

  const drift = 0.05

  // glitched out
  times(800, s => {
    strokeWeight(rnd(0, 0.2))
    const start = rnd(-0.05, 1)
    const end = start + rnd(0, 0.05)
    times(8, i => {
      stroke((i*rate+hue)%360, 60, 80)
      drawShape(
        points, {
          drawFn: curveVertexFn,
          // drawFn: pointFn,
          xyFn: createSpirographFn(rnd(-40, 40), rnd(-40, 40), (4+i)*30, (4+i)*30, gears),
          beforeFn(drawFn, xyFn, points, _o) {
            beginShape()
            // drawFn(xyFn((-1+_o)/points))
          },
          afterFn(drawFn, xyFn, points, _o) {
            // drawFn(xyFn((0+_o)/points))
            // drawFn(xyFn((1+_o)/points))
            endShape()
          },
        },
        OFFSET,
        start,
        end
      )
    })
  })


  // times(100, s => {
  //   strokeWeight(rnd(0, 0.2))
  //   const start = rnd(-0.05, 1)
  //   const end = start + rnd(0, 0.5)
  //   times(8, i => {
  //     stroke((i*rate+hue+180)%360, 60, 80)
  //     drawShape(
  //       points, {
  //         drawFn: curveVertexFn,
  //         xyFn: createSpirographFn(0,0, (4+i)*30, (4+i)*30, gears),
  //         beforeFn(drawFn, xyFn, points, _o) {
  //           beginShape()
  //           // drawFn(xyFn((-1+_o)/points))
  //         },
  //         afterFn(drawFn, xyFn, points, _o) {
  //           // drawFn(xyFn((0+_o)/points))
  //           // drawFn(xyFn((1+_o)/points))
  //           endShape()
  //         },
  //       },
  //       OFFSET,
  //       start,
  //       end
  //     )
  //   })
  // })

}











function createFlourishedGears() {
  return [
    {
      rotation: 1,
      rotationStart: 1,
      radia: 1,
      radiaStart: 1,
      radiaAdj: (p, i) => 1,
      ellapsedAdj: rnd(1000)
    },
    ...times(gearsN - 1, g => ({
      rotation: int(rnd(-rotationMax, rotationMax)),
      rotationStart: int(rnd(-rotationMax, rotationMax)),
      radia: rnd(0, 0.1),
      radiaStart: rnd(0, 0.1),
      radiaAdj: (p, i) => (i&& p%2 ? 1 : 0.5),
      ellapsedAdj: rnd(1000)

    }))
  ]
}






function dollarFn([x, y]) {
  text('$', x, y)
}

function pointFn([x, y]) {
  circle(x, y, 1)
}


function vertexFn([x, y]) {
  vertex(x, y)
}

function curveVertexFn([x, y]) {
  // circle(x, y, 6)
  curveVertex(x, y)
}

function createDotFn(rad, colorFn) {
  return ([x, y], p, points) => {
    const progress = p/points
    const radius = rad*abs(cos(progress*PI))/5+5

    fill(
      colorFn(progress)
    )
    circle(x, y, radius)
  }
}

function createCircleFn(x, y, radius) {
  return progress => getXYRotation(progress * TWO_PI, radius, x, y)
}



function createSpirographFn2(x, y, radius, gears=3, adjustments) {

  console.log(adjustments)

  return progress => {
    let lastX = x
    let lastY = y
    return times(gears, i => {
      const [_x, _y] = getXYRotation(progress * TWO_PI/adjustments[i], radius/(i+1), lastX, lastY)
      lastX = _x
      lastY = _y
      return [_x, _y]
    })
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
