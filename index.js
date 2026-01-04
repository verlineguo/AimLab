import * as THREE from "three";

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
cam.position.z = 10;

// buat lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);

const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1.5);
light2.position.set(-5, -5, 5);
scene.add(light2);


// bola target biru
const targetGeo = new THREE.SphereGeometry(0.18, 16, 16);
const targetMat = new THREE.MeshStandardMaterial({
    color: 0x0077ff
});
const ball = new THREE.Mesh(targetGeo, targetMat);

// posisi random
ball.position.x = (Math.random() - 0.5) * 6;
ball.position.y = (Math.random() - 0.5) * 4;
ball.position.z = Math.random() * -6;
scene.add(ball);

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

function animate() {
    renderer.render(scene, cam);
    requestAnimationFrame(animate);
}
animate();