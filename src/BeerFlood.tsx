import React,{useMemo,useRef,useState,useEffect} from 'react';
import * as THREE from 'three';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useFrame,useThree} from '@react-three/fiber';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {cameraAt,FPS,smooth01} from './story/beerFlood';
const wood=new THREE.MeshStandardMaterial({color:'#81563d',roughness:.88});
const iron=new THREE.MeshStandardMaterial({color:'#29333a',metalness:.78,roughness:.33});
const beer=new THREE.MeshPhysicalMaterial({color:'#5a2d16',roughness:.24,clearcoat:.25});
// Skill-conformant 2D hand-drawn character cards: 600x1000 design space,
// ~3.5 head-heights, bean torso, fine stick limbs, asymmetrical bean head,
// plum weighted ink, clean pale faces, lidded deadpan eyes; never emoji-like.
function character(role:'brewer'|'woman'|'watchman'){
 const c=document.createElement('canvas');c.width=600;c.height=1000;const g=c.getContext('2d')!;
 const ink='#241726',skin='#ffe2c2',skinShade='#f5c2a3';
 const coat=role==='woman'?'#7b5ac9':role==='watchman'?'#3a4e73':'#357650';
 const pants=role==='woman'?'#3b3f52':'#3d4440',hair=role==='woman'?'#70432f':role==='watchman'?'#51443b':'#4a3024';
 const stroke=(pts:[number,number][],colour:string,width:number)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle=colour;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.stroke();};
 const path=(pts:[number,number][],fill:string,outline=true)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(outline){g.strokeStyle=ink;g.lineWidth=11;g.lineJoin='round';g.stroke();}};
 // legs: single narrow strokes; feet are short ink strokes, not oversized boots.
 stroke([[255,646],[246,790],[229,944]],ink,19);stroke([[345,646],[357,790],[377,944]],ink,19);
 stroke([[255,650],[246,790],[229,944]],pants,11);stroke([[345,650],[357,790],[377,944]],pants,11);
 stroke([[229,944],[192,951]],ink,21);stroke([[377,944],[414,951]],ink,21);
 // back arm first, then torso, then front arm
 stroke([[207,397],[159,493],[145,589]],ink,20);stroke([[207,397],[159,493],[145,589]],coat,11);
 // bean torso, narrower shoulders and round lower edge
 const torso:[number,number][]=[[208,375],[237,353],[280,348],[323,355],[365,381],[377,470],[366,588],[334,641],[266,650],[211,625],[190,567],[190,459]];
 path(torso,coat);
 // torso gradient, broad shadow on far side
 g.save();g.beginPath();torso.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.clip();
 const tg=g.createLinearGradient(190,0,390,0);tg.addColorStop(0,'rgba(20,20,42,.38)');tg.addColorStop(.42,'rgba(20,20,42,.08)');tg.addColorStop(1,'rgba(255,220,175,.06)');g.fillStyle=tg;g.fillRect(180,340,220,330);g.restore();
 // period clothing detail
 path([[267,365],[300,365],[317,430],[284,452],[251,430]],'#f1efe6');
 for(const y of [472,515,558]){g.beginPath();g.arc(281,y,7,0,Math.PI*2);g.fillStyle=role==='watchman'?'#e8c45a':'#d9dde0';g.fill();}
 // front arm and ink-dot hand
 stroke([[365,401],[407,482],[430,557]],ink,20);stroke([[365,401],[407,482],[430,557]],coat,11);
 g.beginPath();g.arc(430,557,12,0,Math.PI*2);g.fillStyle=ink;g.fill();
 g.beginPath();g.arc(145,589,12,0,Math.PI*2);g.fillStyle=ink;g.fill();
 // head: wider-than-tall hand-drawn bean, slightly asymmetric with tapered chin.
 const head:[number,number][]=[[166,230],[166,166],[194,112],[245,82],[307,78],[361,101],[407,145],[424,201],[413,259],[386,307],[343,337],[287,350],[233,337],[190,306],[166,270]];
 g.beginPath();head.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
 const hg=g.createRadialGradient(280,160,10,280,205,190);hg.addColorStop(0,skin);hg.addColorStop(.78,skin);hg.addColorStop(1,skinShade);g.fillStyle=hg;g.fill();
 g.strokeStyle=ink;g.lineWidth=11;g.lineJoin='round';g.stroke();
 // heavier lower/shadow-side ink contour
 stroke([[410,235],[397,282],[365,319],[322,341],[278,348]],ink,17);
 // hair wraps the crown and rear of the skull
 path([[165,221],[161,156],[190,103],[243,67],[309,64],[365,91],[407,140],[411,190],[379,161],[343,139],[297,131],[249,143],[206,173]],hair);
 // deadpan lidded eyes: close-set, no white highlights, no blush
 stroke([[238,218],[258,215]],ink,10);stroke([[300,215],[320,218]],ink,10);
 g.fillStyle=ink;g.beginPath();g.ellipse(249,229,10,13,0,0,Math.PI*2);g.ellipse(311,229,10,13,0,0,Math.PI*2);g.fill();
 // small asymmetric brows
 stroke([[230,190],[252,184]],ink,7);stroke([[302,185],[324,192]],ink,7);
 // small dry smirk
 stroke([[270,278],[286,281],[299,276]],'#5a1e28',7);
 // role-specific headwear / costume silhouette
 if(role==='brewer'){
  path([[157,139],[180,83],[236,55],[337,57],[392,91],[409,145],[378,126],[337,109],[248,110],[193,139]],'#d4c3a3');
  path([[194,375],[300,375],[330,625],[184,625]],'#d4c3a3');
 } else if(role==='watchman'){
  path([[157,130],[178,83],[234,55],[333,57],[394,91],[409,139],[157,139]],'#303641');
  path([[145,125],[421,125],[413,151],[153,151]],'#252a34');
 } else {
  path([[161,173],[170,110],[218,61],[310,54],[385,96],[423,180],[396,164],[365,125],[307,111],[245,124],[199,158]],hair);
  // bonnet rim and tied ribbon
  stroke([[169,164],[214,142],[276,137],[344,150],[397,181]],'#e5d7c4',18);
 }
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
 s.scale.set(1.8,3,1);return s;
}
const Building:React.FC<{pos:[number,number,number];w:number;h:number;colour:string}>=({pos,w,h,colour})=><group position={pos}>
 <mesh position={[0,h/2,0]} castShadow><boxGeometry args={[w,h,5]}/><meshStandardMaterial color={colour}/></mesh>
 <mesh position={[0,h+2,-.3]} rotation={[0,0,Math.PI/2]}><coneGeometry args={[w*.62,5.6,4]}/><meshStandardMaterial color="#454c59"/></mesh>
 {[-1,1].map(side=>[0,1,2].map(i=><mesh key={side+':'+i} position={[side*w*.25,1.8+i*(h-3)/3,2.54]}><boxGeometry args={[1,1.5,.08]}/><meshStandardMaterial color={i===2?'#efc27d':'#587487'}/></mesh>))}
</group>;
const Barrel:React.FC<{pos:[number,number,number];scale:number}>=({pos,scale})=><group position={pos} scale={scale}>
 <mesh position={[0,.8,0]}><cylinderGeometry args={[.48,.42,1.6,16]}/><primitive object={wood} attach="material"/></mesh>
 {[.2,.75,1.38].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.46,.055,8,18]}/><primitive object={iron} attach="material"/></mesh>)}
</group>;
const VatFallback=()=> <group position={[0,8.6,0]}>
 <mesh><cylinderGeometry args={[3.05,2.8,7.4,28]}/><primitive object={wood} attach="material"/></mesh>
 {[-2.9,-1.2,1.2,2.9].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[3,.12,10,32]}/><primitive object={iron} attach="material"/></mesh>)}
</group>;
const World:React.FC<{frame:number}>=({frame})=>{
 const wave=useRef<THREE.Mesh>(null),vat=useRef<THREE.Group>(null),debris=useRef<THREE.Group>(null);
 const {camera,scene}=useThree();const cast=useMemo(()=>[character('brewer'),character('woman'),character('watchman')],[]);
 const temp=useMemo(()=>new THREE.Vector3(),[]);const [glb,setGlb]=useState<THREE.Object3D|null>(null);
 useEffect(()=>{new GLTFLoader().load('/assets/generated/justanimate-library.glb',g=>{const a=g.scene.getObjectByName('ASSET_Vat');if(a){const c=a.clone(true);c.position.set(0,4.9,0);setGlb(c);}},undefined,()=>{});},[]);
 useFrame(()=>{
  const cam=camera as THREE.PerspectiveCamera,p=cameraAt(frame);cam.position.lerp(temp.set(...p.position),.055);cam.lookAt(...p.look);cam.fov+=(p.fov-cam.fov)*.08;cam.updateProjectionMatrix();
  const t=frame/FPS,b=smooth01((frame-286)/22)*(1-smooth01((frame-420)/65));
  if(vat.current){vat.current.rotation.z=b*.11;vat.current.position.y=-b*.4;}
  if(wave.current){wave.current.visible=frame>370&&frame<790;wave.current.position.z=24-smooth01((frame-370)/70)*34;wave.current.scale.set(1,1,.9+.15*Math.sin(t*2.7));}
  if(debris.current){debris.current.visible=frame>286&&frame<520;debris.current.children.forEach((o,i)=>{o.position.y=11+Math.sin(t*6+i)*1.8+b*4;o.rotation.x+=.009+i*.0005;o.rotation.z+=.014;});}
  cast[0].position.set(-3.2+Math.sin(t*2)*.15,1.6+Math.abs(Math.sin(t*6))*.1,-1.4);
  cast[1].position.set(1.6+Math.max(0,frame-400)/160,1.5+Math.abs(Math.sin(t*7+1))*.12,-3.3);
  cast[2].position.set(4.4-Math.max(0,frame-420)/150*.9,1.6+Math.abs(Math.sin(t*5+2))*.09,-5.4);
  cast.forEach(a=>a.visible=frame>100&&frame<720);
  const fog=scene.fog as THREE.FogExp2;fog.color.set(frame>630?'#8c8b8c':'#d0b39a');fog.density=frame>630?.009:.006;
 });
 return <>
  <color attach="background" args={['#a9c1cb']}/><fogExp2 attach="fog" args={['#c7b5a3',.006]}/>
  <ambientLight intensity={1.2} color="#d6e1ec"/><directionalLight position={[-18,25,12]} intensity={2.2} color="#ffd7a0" castShadow/><hemisphereLight args={['#b6d5ed','#4c3b34',.75]}/>
  <mesh position={[0,-.3,-10]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[70,100]}/><meshStandardMaterial color="#554a44"/></mesh>
  <Building pos={[-17,0,-14]} w={12} h={15} colour="#925745"/><Building pos={[15,0,-19]} w={14} h={16} colour="#bb8a62"/><Building pos={[-29,0,-32]} w={12} h={13} colour="#9b6758"/><Building pos={[29,0,-36]} w={13} h={14} colour="#c69a73"/><Building pos={[-8.4,0,-12]} w={17} h={18} colour="#895140"/>
  <group ref={vat} position={[-8.2,0,-11]}>{glb?<primitive object={glb}/>:<VatFallback/>}</group>
  <Barrel pos={[-4.6,0,-4]} scale={1.05}/><Barrel pos={[-1.5,0,-7]} scale={.84}/><Barrel pos={[2.4,0,-8]} scale={.95}/>
  <mesh position={[0,.65,-10]} rotation={[-Math.PI/2,0,0]} ref={wave}><planeGeometry args={[22,38,48,80]}/><primitive object={beer} attach="material"/></mesh>
  <group ref={debris}>{Array.from({length:18},(_,i)=><mesh key={i} position={[-8+(i%6)*2.3,11,-11+Math.floor(i/6)*2]}><boxGeometry args={[.15+(i%3)*.08,.7,.12]}/><primitive object={wood} attach="material"/></mesh>)}</group>
  {cast.map((a,i)=><primitive key={i} object={a}/>)}
 </>;
};
export const BeerFloodShort:React.FC=()=> <AbsoluteFill style={{background:'#c7b5a3'}}>
 <ThreeCanvas width={1080} height={1920} shadows gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping}} camera={{position:[0,11,27],fov:43,near:.1,far:500}}>
  <World frame={useCurrentFrame()}/>
 </ThreeCanvas><Audio src={staticFile('audio/beer-flood-mix.wav')}/>
</AbsoluteFill>;
