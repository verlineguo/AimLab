import * as THREE from "three";

let score = 0;
const divScore = document.getElementById("score");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 6, 22); // biar ada depth (jauh-deket)

const cam = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
cam.position.z = 5;

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // penting biar 3d
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
const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.85
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3;
floor.receiveShadow = true;
scene.add(floor);

// bola target (3d beneran)
const targetGeo = new THREE.SphereGeometry(0.3, 32, 32);
const targets = [];

function randomizeBall(ball) {
    const z = -Math.random() * 14 - 3;

    ball.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        z
    );

    // makin jauh makin kecil (kerasa 3d)
    const scale = 1 + Math.abs(z) * 0.04;
    ball.scale.setScalar(scale);
}

// bikin beberapa bola
for (let i = 0; i < 7; i++) {
    const targetMat = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        roughness: 0.35,
        metalness: 0.1
    });

    const ball = new THREE.Mesh(targetGeo, targetMat);
    ball.castShadow = true;
    randomizeBall(ball);

    scene.add(ball);
    targets.push(ball);
}

// crosshair
const crosshairMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
const size = 0.015;

const crosshairGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-size, 0, 0),
    new THREE.Vector3(size, 0, 0),
    new THREE.Vector3(0, -size, 0),
    new THREE.Vector3(0, size, 0)
]);

const crosshair = new THREE.LineSegments(crosshairGeo, crosshairMat);
crosshair.position.z = -0.8;
cam.add(crosshair);
scene.add(cam);

// fps camera control
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;

document.addEventListener("click", () => {
    document.body.requestPointerLock();
});

document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement !== document.body) return;

    yaw -= e.movementX * sensitivity;
    pitch -= e.movementY * sensitivity;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    cam.rotation.set(pitch, yaw, 0);
});

// tembak bola
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

document.addEventListener("mousedown", () => {
    raycaster.setFromCamera(center, cam);
    const hit = raycaster.intersectObjects(targets);

    if (hit.length > 0) {
        randomizeBall(hit[0].object);
        score++;
        divScore.textContent = 'score: '+ score;

    }
});


function animate() {
    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
animate();
