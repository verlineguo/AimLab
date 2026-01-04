import * as THREE from "three";

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
cam.position.z = 10;
scene.background = new THREE.Color(0xffffff);
const scoreDiv = document.getElementById("score");
let score = 0


class Ball {
    constructor(scene) {
        const geo = new THREE.SphereGeometry(0.18, 16, 16);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        this.mesh = new THREE.Mesh(geo, mat);

        this.randomize();
        scene.add(this.mesh);

    
    }

    randomize() {
        this.mesh.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            Math.random() * -6
        );
    }

}


// buat lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1.5);
light2.position.set(-5, -5, 5);
scene.add(light2);


const balls = []
const jumlah_bola = 20;

for (let i = 0; i < jumlah_bola; i++) {
    const b = new Ball(scene);
    balls.push(b);
}


const geoRuangan = new THREE.BoxGeometry(5, 5);
const matRuangan = new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.BackSide });
const ruangan = new THREE.Mesh(geoRuangan, matRuangan);
scene.add(ruangan);


// crosshair
const crosshairMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
const size = 0.01;

const crosshairPoints = [
    new THREE.Vector3(-size, 0, 0),
    new THREE.Vector3(size, 0, 0),
    new THREE.Vector3(0, -size, 0),
    new THREE.Vector3(0, size, 0)
];

const crosshairGeo = new THREE.BufferGeometry().setFromPoints(crosshairPoints);
const crosshair = new THREE.LineSegments(crosshairGeo, crosshairMat);

crosshair.position.z = -1;
cam.add(crosshair);
scene.add(cam);

// fps camera control (ai)
let yaw = 0;
let pitch = 0;
const sensitivity = 0.002;

document.body.requestPointerLock =
    document.body.requestPointerLock ||
    document.body.mozRequestPointerLock;

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

// tembak bola (ai)
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

document.addEventListener("mousedown", () => {
    raycaster.setFromCamera(center, cam);
    const hit = raycaster.intersectObjects(balls.map(b => b.mesh));

    if (hit.length > 0) {
        score++;
        scoreDiv.innerText = `Score: ${score}`;
        const hitBall = balls.find(b => b.mesh === hit[0].object);
        hitBall.randomize();
    }
});

function animate() {
    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
animate();



