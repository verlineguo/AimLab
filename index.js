import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
cam.position.z = 10;


let light = new THREE.PointLight(0xffffff, 30);
light.position.set(0, 4, 2);
scene.add(light);

let light2 = new THREE.PointLight(0xffffff, 30);
light2.position.set(0, -4, 2);
scene.add(light2);



const plane = new THREE.PlaneGeometry(10,10);
const mat = new THREE.MeshBasicMaterial({color : 0xffffff});
const mesh = new THREE.Mesh(plane, mat);
scene.add(mesh);
mesh.position.set(0, 0, -1);

let control = new OrbitControls(cam, renderer.domElement);
scene.add(control);


function draw() {
    control.update();    
    renderer.render(scene, cam);
    requestAnimationFrame(draw);
}
draw();