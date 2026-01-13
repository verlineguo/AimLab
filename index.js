import * as THREE from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
cam.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(5, 10, 6);
dirLight.castShadow = true; 
scene.add(dirLight);

// lantai biar keliatan ruang 3d
const floorGeo = new THREE.PlaneGeometry(60, 60);
const floorMat = new THREE.MeshStandardMaterial({color: 0x1a1a1a, roughness: 0.85,});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3;
floor.receiveShadow = true;
scene.add(floor);

// bola target 3d
const targetGeo = new THREE.SphereGeometry(0.3, 32, 32);
const targets = [];

function randomizeBall(ball) {
  const z = Math.random() * -10;
  ball.position.set((Math.random()) * 8, (Math.random()) * 3, z);
}

// bikin beberapa bola
for (let i = 0; i < 4; i++) {
  const targetMat = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    roughness: 0.35,
    metalness: 0.1,
  });

  const ball = new THREE.Mesh(targetGeo, targetMat);
  ball.castShadow = true;
  randomizeBall(ball);
  
  scene.add(ball);
  targets.push(ball);
}


const albedo = new THREE.TextureLoader().load("./img/boulder/badlands-boulders_albedo.png");
const ao_tex = new THREE.TextureLoader().load("./img/boulder/badlands-boulders_ao.png.png");
const normal= new THREE.TextureLoader().load("./img/boulder/badlands-boulders_normal-dx.png");
const roughness = new THREE.TextureLoader().load("./img/boulder/badlands-boulders_roughness.png");
const metalness = new THREE.TextureLoader().load("./img/boulder/badlands-boulders_metallic.png");


let dindingGeo = new THREE.PlaneGeometry(60, 60);
let dindingMat = new THREE.MeshLambertMaterial({ color: 0xcfcfcf, side: THREE.DoubleSide, map: albedo, aoMap: ao_tex, normalMap: normal, roughnessMap: roughness, metalnessMap: metalness });
let dinding1 = new THREE.Mesh(dindingGeo, dindingMat);

dinding1.position.set(-20, 1, 0);
dinding1.rotation.y = Math.PI / 2;
scene.add(dinding1);

let dinding2 = new THREE.Mesh(dindingGeo, dindingMat);
dinding2.position.set(20, 1, 0);
dinding2.rotation.y = Math.PI / 2;
scene.add(dinding2);

let dinding3 = new THREE.Mesh(dindingGeo, dindingMat);
dinding3.position.set(0, 1, -20);
scene.add(dinding3);

let dinding4 = new THREE.Mesh(dindingGeo, dindingMat);
dinding4.position.set(0, 1, 20);
scene.add(dinding4);

let modelLoader = new GLTFLoader();
let modelScene = await modelLoader.loadAsync('/model/Bullpup.glb')

let model = modelScene.scene;
model.traverse((obj) => {
    if (obj.isMesh) {
        obj.castShadow = true;
    }
});

cam.add(model);
model.position.set(0.55, -0.5, -0.9);
model.rotation.y = Math.PI / 2;
model.scale.setScalar(0.3);
let hentak = 0;



// crosshair
const crosshairMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
const size = 0.01;

const crosshairGeo = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-size, 0, 0),
  new THREE.Vector3(size, 0, 0),
  new THREE.Vector3(0, -size, 0),
  new THREE.Vector3(0, size, 0),
]);

const crosshair = new THREE.LineSegments(crosshairGeo, crosshairMat);
crosshair.position.z = -0.8;
cam.add(crosshair);
scene.add(cam);

// fps camera control (ai)
const controls = new PointerLockControls(cam, document.body);
document.addEventListener('click', () => {controls.lock();});
controls.update();

// skor dan timer
let score = 0;
const divScore = document.getElementById("score");
let timeLeft = 30;
const divTimer = document.getElementById("timer");
const timerInterval = setInterval(() => {
  timeLeft = timeLeft - 1;
  divTimer.textContent = 'TIME: ' + timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    divTimer.textContent = 'TIME UP';
  }
}, 1000);

// tembak bola (ai)
const raycaster = new THREE.Raycaster();
function shoot() {
  if (timeLeft <= 0) return;
  raycaster.setFromCamera({ x: 0, y: 0 }, cam);
  const hit = raycaster.intersectObjects(targets);
  if (hit.length) {
    randomizeBall(hit[0].object);
    // end ai
    score += 100;
    divScore.textContent = 'SCORE: ' + score;
  }
  hentak += 0.3;
}

document.addEventListener("mousedown", shoot);

function animate() {
    hentak *= 0.8;
    if (model) model.rotation.x = hentak * 0.4;
  renderer.render(scene, cam);
  requestAnimationFrame(animate);
}
animate();
