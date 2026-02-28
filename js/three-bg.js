// ================================================
// THEMATIC EMOTIONS: THREE.JS WEBGL BACKGROUND
// ================================================

// We define a global object so emotions.js can speak to the 3D scene
window.ThemeScene = {
    changeEmotion: function (emotion) { }
};

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    // Render setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,           // transparent background 
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // The Object holding our main geometry
    const parent = new THREE.Group();
    scene.add(parent);

    // Material (Wireframe looks technical/architectural and takes colors well)
    const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    // Setup the base geometries we mix between
    const geometryJoy = new THREE.TorusKnotGeometry(6, 1.5, 100, 16);     // Smooth, rounded, bouncy
    const geometryAnger = new THREE.OctahedronGeometry(8, 0);             // Sharp, jagged, minimal
    const geometrySadness = new THREE.SphereGeometry(7, 32, 32);          // Heavy, slow, round
    const geometryFear = new THREE.TorusGeometry(8, 2, 16, 100);          // Tunnel-like, unsettling
    const geometrySurprise = new THREE.IcosahedronGeometry(7, 1);         // Complex, electric shapes
    const geometryDisgust = new THREE.ConeGeometry(6, 14, 8);             // Pointy, weird, asymmetrical

    // The active mesh
    let mesh = new THREE.Mesh(geometryJoy, material);
    parent.add(mesh);

    // Base physics state
    let currentEmotion = document.documentElement.getAttribute('data-theme') || 'joy';
    let rotationSpeedX = 0.002;
    let rotationSpeedY = 0.003;
    let bounceAmplitude = 0.5;
    let bounceSpeed = 1;
    let time = 0;

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01 * bounceSpeed;

        // Continuous rotation
        parent.rotation.x += rotationSpeedX;
        parent.rotation.y += rotationSpeedY;

        // Organic hover bounce
        parent.position.y = Math.sin(time) * bounceAmplitude;

        // Extra modifiers based on emotion
        if (currentEmotion === 'anger') {
            mesh.rotation.z += 0.02; // erratic spin
            parent.position.x = (Math.random() - 0.5) * 0.2; // slight shake
        }
        else if (currentEmotion === 'sadness') {
            mesh.rotation.x += 0.001; // slow sink
        }

        renderer.render(scene, camera);
    }

    // Bind the global function so GSAP/emotions.js can trigger the change
    window.ThemeScene.changeEmotion = function (emotion) {
        currentEmotion = emotion;

        let targetColor = 0xcccccc;
        let targetSpeedX = 0.002;
        let targetSpeedY = 0.003;
        let targetBncAmp = 0.5;
        let targetBncSpd = 1;
        let newGeo = geometryJoy;
        let targetOpacity = 0.15;

        switch (emotion) {
            case 'joy':
                targetColor = 0xfbbf24; // Amber
                targetSpeedX = 0.005;
                targetSpeedY = 0.006;
                targetBncAmp = 1.2;
                targetBncSpd = 3;
                newGeo = geometryJoy;
                targetOpacity = 0.2;
                break;
            case 'sadness':
                targetColor = 0x3b82f6; // Blue
                targetSpeedX = 0.001;
                targetSpeedY = 0.001;
                targetBncAmp = 0.2;
                targetBncSpd = 0.5;
                newGeo = geometrySadness;
                targetOpacity = 0.1;
                break;
            case 'anger':
                targetColor = 0xdc2626; // Red
                targetSpeedX = 0.03;
                targetSpeedY = 0.02;
                targetBncAmp = 0.1;
                targetBncSpd = 5;
                newGeo = geometryAnger;
                targetOpacity = 0.3;
                break;
            case 'fear':
                targetColor = 0x9333ea; // Purple
                targetSpeedX = -0.008;
                targetSpeedY = 0.005;
                targetBncAmp = 0.8;
                targetBncSpd = 1.5;
                newGeo = geometryFear;
                targetOpacity = 0.15;
                break;
            case 'surprise':
                targetColor = 0xd946ef; // Fuchsia
                targetSpeedX = 0.015;
                targetSpeedY = 0.015;
                targetBncAmp = 2.0;
                targetBncSpd = 4;
                newGeo = geometrySurprise;
                targetOpacity = 0.25;
                break;
            case 'disgust':
                targetColor = 0x65a30d; // Lime/Mud
                targetSpeedX = 0.004;
                targetSpeedY = -0.003;
                targetBncAmp = 0.4;
                targetBncSpd = 0.8;
                newGeo = geometryDisgust;
                targetOpacity = 0.2;
                break;
        }

        // Morph the shape abruptly
        mesh.geometry = newGeo;

        // Use GSAP (which is already loaded globally) to smoothly animate the physical properties
        gsap.to(material.color, {
            r: new THREE.Color(targetColor).r,
            g: new THREE.Color(targetColor).g,
            b: new THREE.Color(targetColor).b,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to(material, {
            opacity: targetOpacity,
            duration: 1
        });

        // Tween numeric physics configs
        gsap.to(window, {
            rotationSpeedX: targetSpeedX,
            rotationSpeedY: targetSpeedY,
            bounceAmplitude: targetBncAmp,
            bounceSpeed: targetBncSpd,
            duration: 2,
            onUpdate: () => {
                rotationSpeedX = window.rotationSpeedX;
                rotationSpeedY = window.rotationSpeedY;
                bounceAmplitude = window.bounceAmplitude;
                bounceSpeed = window.bounceSpeed;
            }
        });

        // Add a dramatic "burst" zoom effect when switching
        gsap.fromTo(camera.position,
            { z: 10 },
            { z: 15, duration: 1.5, ease: "elastic.out(1, 0.4)" }
        );
    };

    // Kickoff
    window.ThemeScene.changeEmotion(currentEmotion);
    animate();
});
