export const DUMMY_VOXEL_DOG_CODE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; overflow: hidden; background: transparent; user-select: none; }
        canvas { display: block; outline: none; }
        #mood-icon {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 40px;
            filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
            z-index: 10;
        }
    </style>
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
                "@tweenjs/tween.js": "https://unpkg.com/@tweenjs/tween.js@23.1.1/dist/tween.esm.js"
            }
        }
    </script>
</head>
<body>
<div id="mood-icon">😊</div>
<script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import * as TWEEN from '@tweenjs/tween.js';

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = null; // Transparent

    // Camera adjusted to fit frame better
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 8); // Further back and higher
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.target.set(0, 0.5, 0);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // --- Helper: Voxel Builder ---
    const voxelGeo = new THREE.BoxGeometry(1, 1, 1);
    function createVoxel(color, x, y, z, scaleX, scaleY, scaleZ, parent) {
        const mat = new THREE.MeshStandardMaterial({ color });
        const mesh = new THREE.Mesh(voxelGeo, mat);
        mesh.position.set(x, y, z);
        mesh.scale.set(scaleX, scaleY, scaleZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (parent) parent.add(mesh);
        return mesh;
    }

    // --- Dog Character ---
    const dogGroup = new THREE.Group();
    scene.add(dogGroup);

    // Scale down the whole dog so it fits nicely
    const DOG_SCALE = 0.5;
    dogGroup.scale.setScalar(DOG_SCALE);

    // Colors
    const C_FUR = 0xD2B48C;
    const C_EAR = 0x8B4513;
    const C_NOSE = 0x333333;
    const C_EYE = 0x111111;

    // Body container (for lying down rotation center)
    const bodyContainer = new THREE.Group();
    bodyContainer.position.set(0, 1, 0); // Pivot point at feet/ground approx
    dogGroup.add(bodyContainer);

    // Torso
    const torso = createVoxel(C_FUR, 0, 0.75, 0, 1.8, 1.4, 2.5, bodyContainer);
    
    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2, 1.2); // Relative to body pivot
    bodyContainer.add(headGroup);

    // Head Meshes
    const headMain = createVoxel(C_FUR, 0, 0, 0, 1.6, 1.6, 1.6, headGroup);
    const snout = createVoxel(C_FUR, 0, -0.4, 1.0, 0.8, 0.6, 0.6, headGroup);
    const nose = createVoxel(C_NOSE, 0, -0.3, 1.35, 0.3, 0.2, 0.2, headGroup);
    
    // Eyes
    const eyeL = createVoxel(C_EYE, 0.4, 0.2, 0.85, 0.2, 0.2, 0.1, headGroup);
    const eyeR = createVoxel(C_EYE, -0.4, 0.2, 0.85, 0.2, 0.2, 0.1, headGroup);

    // Ears
    const earL = createVoxel(C_EAR, 0.8, 0.6, -0.2, 0.4, 0.8, 0.5, headGroup);
    const earR = createVoxel(C_EAR, -0.8, 0.6, -0.2, 0.4, 0.8, 0.5, headGroup);

    // Legs (Directly on dogGroup so body can rotate independently for lying down, OR attach to bodyContainer?)
    // Better to attach to bodyContainer to move with it, but we need to animate them for running.
    // Let's attach to bodyContainer but animate their rotation.
    const legL_F = createVoxel(C_FUR, 0.6, 0, 1, 0.5, 1.2, 0.5, bodyContainer);
    const legR_F = createVoxel(C_FUR, -0.6, 0, 1, 0.5, 1.2, 0.5, bodyContainer);
    const legL_B = createVoxel(C_FUR, 0.6, 0, -1, 0.5, 1.2, 0.5, bodyContainer);
    const legR_B = createVoxel(C_FUR, -0.6, 0, -1, 0.5, 1.2, 0.5, bodyContainer);

    // Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 1.2, -1.2);
    bodyContainer.add(tailGroup);
    const tailMesh = createVoxel(C_EAR, 0, 0.5, 0.5, 0.3, 1.5, 0.3, tailGroup);
    tailMesh.rotation.x = -Math.PI / 4;


    // --- Props ---

    // 1. Apple
    const appleGroup = new THREE.Group();
    scene.add(appleGroup);
    appleGroup.visible = false;
    
    // Apple Mesh
    const apple = createVoxel(0xFF0000, 0, 0, 0, 0.6, 0.6, 0.6, appleGroup);
    // Stem
    createVoxel(0x654321, 0, 0.4, 0, 0.1, 0.3, 0.1, appleGroup);
    // Leaf
    createVoxel(0x00FF00, 0.2, 0.4, 0, 0.3, 0.1, 0.1, appleGroup);


    // 2. Hand (Creating a cute voxel glove)
    const handGroup = new THREE.Group();
    scene.add(handGroup);
    handGroup.visible = false;
    
    // Palm
    const palm = createVoxel(0xFFFFFF, 0, 0, 0, 1, 0.8, 0.3, handGroup);
    // Fingers (simplified block)
    const fingers = createVoxel(0xFFFFFF, 0, -0.6, 0, 0.9, 0.6, 0.25, handGroup);
    // Thumb
    const thumb = createVoxel(0xFFFFFF, 0.6, -0.2, 0, 0.3, 0.5, 0.25, handGroup);
    thumb.rotation.z = -0.5;


    // --- Animations State ---
    let state = 'IDLE'; // IDLE, EATING, RUNNING, TRAIN, PETTING, LYING
    let mixer = null;
    let clock = new THREE.Clock();

    // Interaction Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Tweens
    const animations = {
        lieDown: () => {
             if (state === 'LYING') return;
             state = 'LYING';
             document.getElementById('mood-icon').innerText = '😴';
             
             // Hand Patting Logic triggered separately, but this is the pose
             new TWEEN.Tween(bodyContainer.position)
                .to({ y: 0.5 }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

             new TWEEN.Tween(bodyContainer.rotation)
                .to({ x: 0, z: 0 }, 500)
                .start();
            
             // Rotate Legs to look like lying
             new TWEEN.Tween(legL_F.rotation).to({ x: -1.5 }, 500).start();
             new TWEEN.Tween(legR_F.rotation).to({ x: -1.5 }, 500).start();
             new TWEEN.Tween(legL_B.rotation).to({ x: 1.5 }, 500).start();
             new TWEEN.Tween(legR_B.rotation).to({ x: 1.5 }, 500).start();
        },
        standUp: () => {
             if (state === 'IDLE') return;
             state = 'IDLE';
             document.getElementById('mood-icon').innerText = '😊';

             new TWEEN.Tween(bodyContainer.position).to({ y: 1 }, 500).start();
             new TWEEN.Tween(legL_F.rotation).to({ x: 0 }, 500).start();
             new TWEEN.Tween(legR_F.rotation).to({ x: 0 }, 500).start();
             new TWEEN.Tween(legL_B.rotation).to({ x: 0 }, 500).start();
             new TWEEN.Tween(legR_B.rotation).to({ x: 0 }, 500).start();
             
             // Stop running if running
             dogGroup.position.set(0, 0, 0);
             dogGroup.rotation.y = 0;
        },
        eatApple: () => {
            if (state === 'EATING') return;
            state = 'EATING';
            document.getElementById('mood-icon').innerText = '😋';
            
            // Reset transforms
            animations.standUp();

            // 1. Show Apple
            appleGroup.visible = true;
            appleGroup.position.set(3, 1, 3); // Start pos
            appleGroup.scale.setScalar(0.01);

            // 2. Animate Apple to Mouth
            new TWEEN.Tween(appleGroup.scale).to({ x: 1, y: 1, z: 1 }, 500).start();
            
            new TWEEN.Tween(appleGroup.position)
                .to({ x: 0, y: 2, z: 2 }, 1000) // Near mouth
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    // Apple reached mouth
                    appleGroup.visible = false;
                    
                    // Chewing animation
                    let chews = 0;
                    const chewInt = setInterval(() => {
                        headGroup.rotation.x = chews % 2 === 0 ? 0.2 : 0;
                        chews++;
                        if (chews > 6) {
                             clearInterval(chewInt);
                             state = 'IDLE';
                             headGroup.rotation.x = 0;
                        }
                    }, 150);
                })
                .start();
        },
        petting: () => {
            // "Display small hand rubbing on head and lie down"
            animations.lieDown();
            
            // Show Hand
            handGroup.visible = true;
            // Position hand above head. Note: Head moves when lying down.
            // Simplified: Hardcode hand position for "lying" state
            handGroup.rotation.x = -Math.PI / 2;
            handGroup.position.set(0, 2.5, 0.5);

            // Rubbing motion
            const rubRight = new TWEEN.Tween(handGroup.position)
                .to({ x: 0.5 }, 300)
                .easing(TWEEN.Easing.Sinusoidal.InOut);
            
            const rubLeft = new TWEEN.Tween(handGroup.position)
                .to({ x: -0.5 }, 300)
                .easing(TWEEN.Easing.Sinusoidal.InOut);

            rubRight.chain(rubLeft);
            rubLeft.chain(rubRight);
            rubRight.start();

            // End petting after 3 seconds
            setTimeout(() => {
                rubRight.stop();
                handGroup.visible = false;
                animations.standUp();
            }, 3000);
        },
        startRunning: () => {
            state = 'RUNNING';
            document.getElementById('mood-icon').innerText = '🤩';
            animations.standUp();
            // Reset position for loop
            dogGroup.position.set(0,0,0);
            dogGroup.rotation.y = 0;
        }
    };


    // --- Game Loop ---
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
        controls.update();

        const delta = clock.getDelta();
        const now = clock.getElapsedTime();

        // Idle Breathing
        if (state === 'IDLE' || state === 'EATING') {
            bodyContainer.scale.y = 1 + Math.sin(now * 3) * 0.02;
            tailGroup.rotation.z = Math.sin(now * 5) * 0.2;
        }


        // Running Logic (Now Jump & Wiggle)
        if (state === 'RUNNING') {
            const jumpSpeed = 10;
            
            // Stay in place
            dogGroup.position.x = 0;
            dogGroup.position.z = 0;
            dogGroup.rotation.y = 0;

            // Fast Tail Wiggle
            tailGroup.rotation.z = Math.sin(now * 20) * 0.8;

            // Legs kick out (Happy Jump)
            legL_F.rotation.x = -0.5 + Math.sin(now * jumpSpeed) * 0.5;
            legR_F.rotation.x = -0.5 + Math.sin(now * jumpSpeed) * 0.5;
            legL_B.rotation.x = 0.5 + Math.sin(now * jumpSpeed) * 0.5;
            legR_B.rotation.x = 0.5 + Math.sin(now * jumpSpeed) * 0.5;
            
            // Bob body (Jump up and down)
            bodyContainer.position.y = 1 + Math.abs(Math.sin(now * jumpSpeed / 2)) * 1.5; 
        }

        renderer.render(scene, camera);
    }
    animate();


    // --- Event Listeners ---

    // 1. Mouse Clicks (Patting)
    window.addEventListener('pointerdown', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        // Intersect recursive
        const intersects = raycaster.intersectObjects(dogGroup.children, true);
        if (intersects.length > 0) {
            // Clicked the dog!
            animations.petting();
        }
    });

    // 2. React Messages
    window.addEventListener('message', (event) => {
        const { type, mood } = event.data;
        if (type === 'CHANGE_MOOD') {
            console.log("Command received:", mood);
            if (mood === 'happy') { // Feed -> happy
                animations.eatApple();
            } else if (mood === 'excited') { // Train -> excited
                animations.startRunning();
            } else if (mood === 'sleepy') { // Rest -> sleepy
                animations.lieDown();
            }
        }
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

</script>
</body>
</html>
`;
