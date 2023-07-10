import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import bg from './bg.jpg'
import earthTexture from './src/imgs/earth.jpg'
import jupiterTexture from './src/imgs/jupiter.jpg'
import marsTexture from './src/imgs/mars.jpg'
import mercuryTexture from './src/imgs/mercury.jpg'
import neptuneTexture from './src/imgs/neptune.jpg'
import plutoTexture from './src/imgs/pluto.jpg'
import saturnRingTexture from './src/imgs/saturn ring.png'
import saturnTexture from './src/imgs/saturn.jpg'
import starsTexture from './src/imgs/stars.jpg'
import sunTexture from './src/imgs/sun.jpg'
import uranusRingTexture from './src/imgs/uranus ring.png'
import uranusTexture from './src/imgs/uranus.jpg'
import venusTexture from './src/imgs/venus.jpg'

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true // включить тени
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( -90, 140, 140 );
camera.lookAt( 0, 0, 0 );


// -- LIGHT START --

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)



const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
	bg,bg,bg,bg,bg,bg
]) // 3d фон


// -- HELPERS START --

const orbit = new OrbitControls(camera, renderer.domElement) // перемещение в пространстве
orbit.update()

// const axesHelper = new THREE.AxesHelper(5); // линии координат
// const gridHelper = new THREE.GridHelper(30, 30); // координатная сетка
// scene.add(axesHelper, gridHelper)

// -- HELPERS END --


const sunGeo = new THREE.SphereGeometry(16, 40, 40)
const sunMat = new THREE.MeshBasicMaterial({
	map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)


function createPlanet(size, texture, position, ring, axis=false){
	const obj = new THREE.Object3D();
	scene.add(obj)

	const axisRotateObj = new THREE.Object3D();
	if(axis){
		obj.add(axisRotateObj)
		axisRotateObj.position.x = position;
		
	}

	const geo = new THREE.SphereGeometry(size, 20, 20)
	const mat = new THREE.MeshStandardMaterial({
		map: textureLoader.load(texture)
	})
	const mesh = new THREE.Mesh(geo, mat)
	mesh.castShadow = true
	mesh.receiveShadow = true
	if(!axis){
		mesh.position.x = position;
		obj.add(mesh)
	}else{
		axisRotateObj.add(mesh)
		mesh.rotation.x = axis * Math.PI;
	}
	
	if(ring){
		const ringGeo = new THREE.RingGeometry(ring.ringInRadius, ring.ringOutRadius, 32)
		const ringMat = new THREE.MeshStandardMaterial({
			map: textureLoader.load(ring.ringTexture),
			side: THREE.DoubleSide
		})
		const ringMesh = new THREE.Mesh(ringGeo, ringMat)
		ringMesh.castShadow = true
		ringMesh.receiveShadow = true

		if(!axis){ mesh.add(ringMesh) 
		}else{axisRotateObj.add(ringMesh)}

		ringMesh.rotation.x = (-0.5 + axis) * Math.PI;
	}
	
	return {mesh, obj, axisRotateObj: axisRotateObj}
}


const mercury = createPlanet(3.2, mercuryTexture, 28)
const venus = createPlanet(5.8, venusTexture, 44, false, 0.99)
const earth = createPlanet(6, earthTexture, 62, false, 0.13)
const mars = createPlanet(4, marsTexture, 78, false, 0.14)
const jupiter = createPlanet(12, jupiterTexture, 100, false, 0.01)
const saturn = createPlanet(10, saturnTexture, 138, 
	{ringTexture: saturnRingTexture,
	ringInRadius: 10,
	ringOutRadius: 20}, 0.15)
const uranus = createPlanet(7, uranusTexture, 176, 
	{ringTexture: uranusRingTexture,
	ringInRadius: 7,
	ringOutRadius: 12}, 0.54)
const neptune = createPlanet(7, neptuneTexture, 200, false, 0.16)
const pluto = createPlanet(2.8, plutoTexture, 226, false, 0.01)
pluto.obj.rotation.x = 0.15 * Math.PI
pluto.obj.position.x = 20

const pointLight = new THREE.PointLight(0xF7F0E2, 2, 300)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1980
pointLight.shadow.mapSize.height  = 1980
scene.add(pointLight)

let step = 0

function animate(time) {

	// self-rotation
	sun.rotateY(0.004)
	uranus.mesh.rotateY(-0.0055)

	// around axis rotation
	mercury.axisRotateObj.rotateY(0.004)
	venus.axisRotateObj.rotateY(0.002)
	earth.axisRotateObj.rotateY(0.02)
	mars.axisRotateObj.rotateY(0.018)
	jupiter.axisRotateObj.rotateY(0.04)
	saturn.axisRotateObj.rotateY(0.038)
	uranus.axisRotateObj.rotateY(0.03)
	neptune.axisRotateObj.rotateY(0.032)
	pluto.axisRotateObj.rotateY(0.008)

	// around sun rotation
	mercury.obj.rotateY(0.02)
	venus.obj.rotateY(0.007)
	earth.obj.rotateY(0.005)
	mars.obj.rotateY(0.004)
	jupiter.obj.rotateY(0.001)
	saturn.obj.rotateY(0.00045)
	uranus.obj.rotateY(0.0002)
	neptune.obj.rotateY(0.0001)
	pluto.obj.rotateY(0.00007)


	renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate)


// canvas media resize

window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight, )
})






