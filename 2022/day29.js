function getXYRotation (deg, radius, cx=0, cy=0) {
  return [
    Math.sin(deg) * radius + cx,
    Math.cos(deg) * radius + cy,
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




/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????
/////////////////////////////////////////////////////////////////?????




const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

const light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( -3, -2, -10 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );


const light2 = new THREE.DirectionalLight( 0xffff00, 1, 100 );
light2.position.set( -20,-20,20 ); //default; light2 shining from top
light2.castShadow = true; // default false
scene.add( light2 );



    // const skyColor = 0xB1E1FF;  // light blue
    // const groundColor = 0xB97A20;  // brownish orange
    // const intensity = 20;
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    // scene.add(light);



// const planeGeometry = new THREE.PlaneGeometry( 200, 20, 302, 302 );
// const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ffff } )
// const plane = new THREE.Mesh( planeGeometry, planeMaterial );
// plane.position.z = -4
// plane.receiveShadow = true;
// scene.add( plane );

// const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );








const cubes = times(200, i => {
  const cubeGeometry = new THREE.BoxGeometry(i**2+1, i**2+1, i**2+1)
  const cubeMaterial = new THREE.MeshStandardMaterial( { color: new THREE.Color(`hsl(${i*36}, 80%, 70%)`) } )
  const cube = new THREE.Mesh( cubeGeometry, cubeMaterial )
  cube.position.set(i**2,i**2,-1 * i**2)

  cube.castShadow = true
  cube.receiveShadow = true
  scene.add( cube )
  return cube
})


// const lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ffff } )

// const points = []
// points.push( new THREE.Vector3( -1, 0, 0 ) )
// points.push( new THREE.Vector3( 0, 1, 0 ) )
// points.push( new THREE.Vector3( 1, 0, 0 ) )
// points.push( new THREE.Vector3( 0, 0, -1 ) )

// const lineGeometry = new THREE.BufferGeometry().setFromPoints( points )

// const line = new THREE.Line( lineGeometry, lineMaterial )
// scene.add( line )

let f = 0

function animate() {
  f += 0.01
  requestAnimationFrame( animate )
  renderer.render( scene, camera )

  camera.position.set(
    // -3,-3,2
    // -20,-25,38
    -20,-20,20
  )

  // camera.position.x = Math.sin(f)*-5
  // camera.position.y = Math.cos(f)*-5
  // camera.position.z = Math.cos(f)*5

  camera.lookAt(0,0,0)
}
animate()























