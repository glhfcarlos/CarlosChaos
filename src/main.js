import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Music Vol
const audio = document.getElementById('backgroundMusic');
audio.volume = 0.4;

// Camera Position
camera.position.set(30, 20, 0);

// Button
const toggleButton = document.querySelector('#toggleRotation');
const resetButton = document.querySelector('#resetRotation');
let speedMultiplier = 1; // Multiplier to control speed of rotation

toggleButton.addEventListener('click', () => {
  speedMultiplier *= 2; // Double the speed multiplier each time the button is pressed
  console.log('Speed Multiplier:', speedMultiplier);
});

resetButton.addEventListener('click', () => {
  speedMultiplier = 1;
  console.log('Speed reset to normal.');
});

// Torus
const geometry = new THREE.TorusGeometry(10, 0.05, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);
torus.name = 'torus';
scene.add(torus);

// Torus 2
const geo2 = new THREE.TorusGeometry(10, 0.05, 16, 100);
const mat2 = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
const torus2 = new THREE.Mesh(geo2, mat2);
torus2.name = 'torus2';
scene.add(torus2);

// Carlos
const carlosTexture = new THREE.TextureLoader().load('./me.jpeg');
const carlos = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: carlosTexture })
);
carlos.name = 'carlos';
scene.add(carlos);

// Moon
const moonTexture = new THREE.TextureLoader().load('./space.jpg');
const normalTexture = new THREE.TextureLoader().load('./texture.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
moon.position.set(-10, 0, 30); // Position the moon
moon.name = 'moon'; // Give the moon a name
scene.add(moon);

// Planet
const planetTexture = new THREE.TextureLoader().load('./darkspace.jpg');
const planet = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
  })
);
planet.position.set(0, 10, -30);
planet.name = 'planet';
scene.add(planet);

// Lighting setup
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);
pointLight.intensity = 100;
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Store stars in an array
const stars = [];

// Function to add a single star
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
  
  star.position.set(x, y, z);
  scene.add(star);
  stars.push(star);
}

setInterval(addStar, 100);

// Window Resizer
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse Movement
let mouseX = 0;
let mouseY = 0;
const sensitivity = 0.05;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Camera wiggle with cursor
function updateCameraRotation() {
  // Adjust pitch (up/down) based on mouseY
  camera.rotation.y += -mouseY * sensitivity;
  camera.rotation.x += mouseX * sensitivity;
}

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Stars movement
  stars.forEach(star => {
    star.position.x += 0.1; 
    star.position.y += 0.05; 

    if (star.position.x > 100) {
      star.position.x = -100;
    }
  });

  // Rotate the torus
  torus.rotation.x += 0.01 * speedMultiplier;
  torus.rotation.y += 0.005 * speedMultiplier;
  torus.rotation.z += 0.01 * speedMultiplier;

  // Rotate the second torus
  torus2.rotation.x -= 0.01 * speedMultiplier;
  torus2.rotation.y += 0.005 * speedMultiplier;
  torus2.rotation.z -= 0.01 * speedMultiplier;

  // Rotate the Carlos
  carlos.rotation.x += 0.01 * speedMultiplier;
  carlos.rotation.y += 0.005 * speedMultiplier;
  carlos.rotation.z += 0.01 * speedMultiplier;

  // Rotate the moon
  moon.rotation.y += 0.002 * speedMultiplier;

  // Rotate the planet
  planet.rotation.y += 0.002 * speedMultiplier;

  // Camera focus at the center of the screen
  camera.lookAt(0, 0, 0);

  // Camera wiggle
  updateCameraRotation();


  renderer.render(scene, camera);
}

animate();
