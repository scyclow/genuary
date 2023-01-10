

document.getElementById('start').onclick = generateMusicLayer

const BASE_FREQ = rnd(400, 1000)
const OFFSYNC = sample([0.005, 0.0075, 0.01, 0.0125, 0.015])

console.log(BASE_FREQ, OFFSYNC)

const upOrDown = arr => [...arr, ...arr.map(a => 1/a)]


const majorScale = upOrDown([1, 1.125, 1.333333, 1.5, 1.666666, 1.75, 1.875, 2])
const minorScale = [1, 1.125, 1.2, 1.5, 1.666666, 1.75, 1.875, 2]





const majorChord = upOrDown([1, 1.25, 1.5, 2])
const minorChord = upOrDown([1, 1.2, 1.5, 2])

const waveType = sample(['square', 'sine', 'triangle'])

let layers = 0
function generateMusicLayer() {
  layers++

  // const shift = sample([0.25, 0.5, 0.3333333, 1.25, 1.5, 2])

  const shift = layers === 1 ? 1 : sample(minorScale)//sample([1, 1.125, 1.33333])


  console.log(shift)
  const startingFreq = BASE_FREQ * shift

  let currentFreq = startingFreq

  const chordNotes = minorChord//sample([majorChord, minorChord])

  createSource(2, 1, 0, 8)

  const startNote = (f, gain) => {
    const a = createSource(f, 1, 0, gain)
    const b = createSource(f, 1, OFFSYNC, gain)
    const c = createSource(f, 1, OFFSYNC/2, gain)

    return {
      smoothFreq(f, t) {
        a.smoothFreq(f, t)
        b.smoothFreq(f * (1+b.offsync), t)
        c.smoothFreq(f * (1+c.offsync), t)
      }
    }
  }

  const startChord = f => {
    const a = startNote(f*chordNotes[0], 0.75)
    const b = startNote(f*chordNotes[1], 0.75)
    // const c = startNote(f*chordNotes[2], 0.75)
    // const d = startNote(f*chordNotes[3], 0.75)

    return {
      smoothFreq(f, t) {
        console.log(f*chordNotes[0], f*chordNotes[1])
        a.smoothFreq(f*chordNotes[0], t)
        // b.smoothFreq(f*chordNotes[1], t)
        // c.smoothFreq(f*chordNotes[2], t)
        // d.smoothFreq(f*chordNotes[3], t)
      }
    }
  }

  const chord = startChord(currentFreq/2)






  // const progression1 = [1, ...times(7, () => sample(minorScale.slice(1)))]

  const progression1a = [1, ...times(3, () => sample(minorScale.slice(1)))]
  const progression1b = [1, ...times(3, () => sample(minorScale.slice(1)))]
  const progression1c = [1, ...times(3, () => sample(minorScale.slice(1)))]
  const progression2 = [
    ...progression1a,
    ...progression1b,
    ...progression1a,
    ...progression1b,
    ...progression1a,
    ...progression1b,
    ...progression1a,
    ...progression1c,
  ]
  const progression3 = [1, ...times(3, () => sample([1.125, 1.2]))]

  // const note1 = startNote(currentFreq)
  const note2 = startNote(currentFreq, 0.4)
  // const note3 = startNote(currentFreq*sample(minorScale.slice(1)), 0.25)



  // let i1 = 0
  // setInterval(() => {
  //   note1.smoothFreq(currentFreq*progression1[i1%progression1.length], 0.25)
  //   i1++
  // }, 1500)

  let i2 = 0
  setInterval(() => {
    note2.smoothFreq(currentFreq*progression2[i2%progression2.length], 0.1)
    // note3.smoothFreq(currentFreq*sample(minorScale.slice(1))*progression2[i2%progression2.length], 0.1)
    i2++
  }, 250)


  // let i3 = 0
  // setInterval(() => {
  //   currentFreq = startingFreq*progression3[i3%progression3.length]
  //   chord.smoothFreq(currentFreq/2, 1.5)
  //   i3++
  // }, 6000)



  // const soundDuration = rnd(750, 1500)

  // const vMin = rnd(5, 450)
  // const vMax = vMin + rnd(5, 450)
  // const v1 = rnd(vMin, vMax)
  // const v2 = rnd(vMin, vMax)
  // const v3 = rnd(vMin, vMax)

  // const t1 = rnd(0.5, 1)
  // const t2 = rnd(0.5, 1)
  // const t3 = rnd(0.5, 1)

  // const dur2 = rnd(0.1, 0.5)
  // const dur3 = rnd(0.5, 1)

  // const durOffset = prb(0.25) ? rnd : () => 1



  // const MAX_VOLUME = 0.01;
  // const { source: source1, gain: gain1, ctx: ctx1 } = createSource(1, 0.00000001)
  // const { source: source2, gain: gain2, ctx: ctx2 } = createSource(1, 0.00000001)
  // const { source: source3, gain: gain3, ctx: ctx3 } = createSource(1, 0.00000001)

  // function triggerOscillator() {
  //   const v = rnd(vMin, vMax)
  //   const t = rnd(0.5, 1)
  //   const dur = rnd(0.1, 0.5)


  //   const { source, gain, ctx } = createSource(0, 0.00000001)

  //   const smoothGain = smoothTo(gain.gain, ctx)
  //   const smoothFreq = smoothTo(source.frequency, ctx)
  //   smoothGain(MAX_VOLUME, 0.15)
  //   const setFreq = () => {
  //     smoothFreq(source.frequency.value * 2 || startingFreq, rnd(0.1, 0.3))
  //     setTimeout(() => smoothFreq(v, t))
  //   }

  //   setTimeout(() => {
  //     setFreq()
  //     setInterval(setFreq, soundDuration)
  //   }, soundDuration * dur)
  // }

  // times(rndint(1, 5), triggerOscillator)

  // const smoothGain1 = smoothTo(gain1.gain, ctx1)
  // const smoothFreq1 = smoothTo(source1.frequency, ctx1)

  // const smoothGain2 = smoothTo(gain2.gain, ctx2)
  // const smoothFreq2 = smoothTo(source2.frequency, ctx2)

  // const smoothGain3 = smoothTo(gain3.gain, ctx3)
  // const smoothFreq3 = smoothTo(source3.frequency, ctx3)

  // smoothGain1(MAX_VOLUME, 0.15)
  // smoothGain2(MAX_VOLUME, 0.15)
  // smoothGain3(MAX_VOLUME, 0.15)


  // const setFreq1 = () => {
  //   smoothFreq1(source3.frequency.value * 2 || startingFreq, rnd(0.1, 0.3))
  //   setTimeout(() => smoothFreq1(v1, t1))
  // }

  // const setFreq2 = () => {
  //   smoothFreq2(source1.frequency.value * 2 || startingFreq, rnd(0.1, 0.3))
  //   setTimeout(() => smoothFreq2(v2, t2))
  // }

  // const setFreq3 = () => {
  //   smoothFreq3(source2.frequency.value * 2 || startingFreq, rnd(0.1, 0.3))
  //   setTimeout(() => smoothFreq3(v3, t3))
  // }




  // setFreq1()
  // setInterval(setFreq1, soundDuration * durOffset())

  // setTimeout(() => {
  //   setFreq2()
  //   setInterval(setFreq2, soundDuration * durOffset())
  // }, soundDuration * dur2)

  // setTimeout(() => {
  //   setFreq3()
  //   setInterval(setFreq3, soundDuration * durOffset())
  // }, soundDuration * dur3)
}









const MAX_VOLUME = 0.008;

function createSource(startingFreq = 500, fadein = 0.15, offsync=0, volX=1) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  const source = ctx.createOscillator();
  const gain = ctx.createGain();

  source.connect(gain)
  gain.connect(ctx.destination)

  gain.gain.value = 0.00000001
  source.type = waveType
  source.frequency.value = startingFreq * (1+offsync)
  source.start()

  const smoothGain = smoothTo(gain.gain, ctx)
  const smoothFreq = smoothTo(source.frequency, ctx)


  smoothGain(MAX_VOLUME*volX, fadein)

  return {
    offsync,
    source,
    gain,
    ctx,
    smoothGain,
    smoothFreq,
  }
}

const smoothTo = (obj, ctx) => (value, timeInSeconds) => {
  obj.exponentialRampToValueAtTime(value, ctx.currentTime + timeInSeconds)
}

