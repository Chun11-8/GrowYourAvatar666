export const VOXEL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>
body { margin:0; overflow:hidden; background:transparent; }
canvas { display:block; }
#mood-icon{
  position:absolute;
  left:16px;
  top:16px;
  font-size:40px;
  z-index:10;
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

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(45,innerWidth/innerHeight,0.1,1000);
camera.position.set(6,6,8);

const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true;
controls.target.set(0,1,0);

scene.add(new THREE.AmbientLight(0xffffff,0.7));

const dir = new THREE.DirectionalLight(0xffffff,1.1);
dir.position.set(6,10,6);
dir.castShadow = true;
scene.add(dir);

const voxelGeo = new THREE.BoxGeometry(1,1,1);

function createVoxel(color,x,y,z,sx=1,sy=1,sz=1,parent){
  const mat = new THREE.MeshStandardMaterial({color});
  const m = new THREE.Mesh(voxelGeo,mat);
  m.position.set(x,y,z);
  m.scale.set(sx,sy,sz);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* -------------------------
   Character root & rig
--------------------------*/

const character = new THREE.Group();
scene.add(character);
character.scale.setScalar(0.5);

/*
  rig is the ONLY contract between template and Gemini code
*/
const rig = {
  root: character,
  body: new THREE.Group(),
  head: new THREE.Group(),
  leftArm: new THREE.Group(),
  rightArm: new THREE.Group(),
  leftLeg: new THREE.Group(),
  rightLeg: new THREE.Group(),
  tail: new THREE.Group(),
  mouth: new THREE.Object3D() // optional attachment point
};

character.add(rig.body);
rig.body.add(rig.head);
rig.body.add(rig.leftArm);
rig.body.add(rig.rightArm);
rig.body.add(rig.leftLeg);
rig.body.add(rig.rightLeg);
rig.body.add(rig.tail);
rig.head.add(rig.mouth);

rig.body.position.set(0,1,0);

/* =======================================================
   >>>>>>>>>>>  GENERATED PART (Gemini fills) <<<<<<<<<<<
=======================================================*/

function buildCharacter(createVoxel, rig){
/*__GEMINI_CHARACTER_CODE__*/ 
}

/* ===================================================== */

buildCharacter(createVoxel, rig);


/* -------------------------
   Props (generic)
--------------------------*/

const propGroup = new THREE.Group();
scene.add(propGroup);
propGroup.visible = false;

const propMain = createVoxel(0xff4444,0,0,0,0.6,0.6,0.6,propGroup);


/* -------------------------
   States & animations
--------------------------*/

let state = 'IDLE';
const moodIcon = document.getElementById('mood-icon');

const animations = {

  petting(){
    if(state==='PET') return;
    state='PET';
    moodIcon.textContent='❤️';

    new TWEEN.Tween(rig.head.rotation)
      .to({y:0.6},200).yoyo(true).repeat(3).start();

    new TWEEN.Tween(rig.body.position)
      .to({y:1.3},200).yoyo(true).repeat(1)
      .onComplete(()=>{ state='IDLE'; moodIcon.textContent='😊'; })
      .start();
  },

  eatApple(){
    state='EATING';
    moodIcon.textContent='😋';

    propGroup.visible=true;

    rig.mouth.getWorldPosition(propGroup.position);
    propGroup.position.add(new THREE.Vector3(2,1,2));
    propGroup.scale.setScalar(0.01);

    const mouthWorld = new THREE.Vector3();
    rig.mouth.getWorldPosition(mouthWorld);

    new TWEEN.Tween(propGroup.scale)
      .to({x:1,y:1,z:1},300).start();

    new TWEEN.Tween(propGroup.position)
      .to(mouthWorld,800)
      .onComplete(()=>{
        propGroup.visible=false;
        state='IDLE';
        moodIcon.textContent='😊';
      })
      .start();
  },

  startRunning(){
    state='RUNNING';
    moodIcon.textContent='🤩';
  },

  lieDown(){
    state='SLEEP';
    moodIcon.textContent='😴';

    new TWEEN.Tween(rig.body.rotation)
      .to({x:-1.2},500).start();

    new TWEEN.Tween(rig.body.position)
      .to({y:0.5},500).start();
  }

};


/* -------------------------
   Raycaster
--------------------------*/

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown',e=>{
  mouse.x = e.clientX / innerWidth * 2 - 1;
  mouse.y = -e.clientY / innerHeight * 2 + 1;

  raycaster.setFromCamera(mouse,camera);
  const hits = raycaster.intersectObject(character,true);
  if(hits.length){
    animations.petting();
  }
});


/* -------------------------
   Message API
--------------------------*/

window.addEventListener('message',e=>{
  const {type,mood} = e.data || {};
  if(type!=='CHANGE_MOOD') return;

  if(mood==='happy') animations.eatApple();
  if(mood==='excited') animations.startRunning();
  if(mood==='sleepy') animations.lieDown();
});


/* -------------------------
   Loop
--------------------------*/

const clock = new THREE.Clock();

function loop(t){
  requestAnimationFrame(loop);
  TWEEN.update(t);
  controls.update();

  const time = clock.getElapsedTime();

  if(state==='RUNNING'){
    rig.leftLeg.rotation.x = Math.sin(time*10)*0.8;
    rig.rightLeg.rotation.x = -Math.sin(time*10)*0.8;
    rig.leftArm.rotation.x = -rig.leftLeg.rotation.x;
    rig.rightArm.rotation.x = -rig.rightLeg.rotation.x;
    rig.body.position.y = 1 + Math.abs(Math.sin(time*5))*0.6;
  }

  renderer.render(scene,camera);
}
loop();


window.addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

</script>
</body>
</html>
`;
