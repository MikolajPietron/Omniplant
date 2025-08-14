// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Optimize the renderer's pixel ratio to prevent performance issues on high-DDPI screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting to the scene
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);
// Main directional light (like the sun)
const dirLight1 = new THREE.DirectionalLight(0xffffff, 10);
dirLight1.position.set(5, 5, 5);
scene.add(dirLight1);

// Directional light from the opposite side to fill in shadows
const dirLight2 = new THREE.DirectionalLight(0xffffff, 10);
dirLight2.position.set(-5, -5, 5);
scene.add(dirLight2);

// Additional directional light from a different angle
const dirLight3 = new THREE.DirectionalLight(0xffffff, 10);
dirLight3.position.set(0, 5, -5);
scene.add(dirLight3);

// Load the GLB model
const loader = new THREE.GLTFLoader();
loader.load(
    'modelDecimated.glb',
    function (gltf) {
        const model = gltf.scene;

        // Center the model in the scene
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        scene.add(model);

        // Position the camera to get a good view of the model
        camera.position.z = box.getSize(new THREE.Vector3()).length() * 1.5;

        // Set up OrbitControls to allow the user to move the model
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;

        // Define a render function
        const render = () => {
            renderer.render(scene, camera);
        };

        // Render the scene only when the controls are changed
        controls.addEventListener('change', render);

        // Initial render to display the model
        render();

        // Animate the controls continuously if damping is enabled
        const animate = () => {
            controls.update();
            requestAnimationFrame(animate);
        };
        animate();
    },
    // Optional: a function to track loading progress
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Optional: a function to handle loading errors
    function (error) {
        console.error('An error occurred during loading:', error);
    }
);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});