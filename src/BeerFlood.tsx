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
function character(role:'brewer'|'woman'|'watchman'){
 const c=document.createElement('canvas');c.width=512;c.height=800;const g=c.getContext('2d')!;
 const skin=role==='woman'?'#efc9a7':'#f0c6a2',hair=role==='woman'?'#79412c':role==='watchman'?'#77716a':'#4b3027',coat=role==='woman'?'#496c55':role==='watchman'?'#344e69':'#78513b',ink='#241b22';
 g.lineWidth=13;g.lineJoin='round';g.lineCap='round';g.fillStyle='#302f38';g.strokeStyle=ink;
 g.beginPath();g.moveTo(204,585);g.lineTo(184,735);g.lineTo(244,735);g.lineTo(262,590);g.closePath();g.fill();g.stroke();
 g.beginPath();g.moveTo(285,585);g.lineTo(292,735);g.lineTo(350,735);g.lineTo(342,580);g.closePath();g.fill();g.stroke();
 g.fillStyle='#47352f';g.beginPath();g.roundRect(164,710,100,52,18);g.fill();g.stroke();g.beginPath();g.roundRect(282,710,95,52,18);g.fill();g.stroke();
 g.fillStyle=coat;g.beginPath();g.moveTo(160,330);g.quadraticCurveTo(256,295,355,332);g.lineTo(391,590);g.quadraticCurveTo(260,628,128,590);g.closePath();g.fill();g.stroke();
 g.fillStyle='#f0e4cf';g.beginPath();g.moveTo(219,320);g.lineTo(256,403);g.lineTo(294,320);g.closePath();g.fill();g.stroke();
 g.strokeStyle=ink;g.lineWidth=52;g.beginPath();g.moveTo(155,370);g.quadraticCurveTo(108,465,135,530);g.stroke();g.beginPath();g.moveTo(360,370);g.quadraticCurveTo(414,450,375,515);g.stroke();
 g.strokeStyle=skin;g.lineWidth=31;g.beginPath();g.moveTo(155,370);g.quadraticCurveTo(108,465,135,530);g.stroke();g.beginPath();g.moveTo(360,370);g.quadraticCurveTo(414,450,375,515);g.stroke();
 g.fillStyle=skin;g.strokeStyle=ink;g.lineWidth=12;g.beginPath();g.ellipse(256,213,118,142,0,0,Math.PI*2);g.fill();g.stroke();
 g.fillStyle=hair;g.beginPath();g.moveTo(137,206);g.quadraticCurveTo(129,63,254,49);g.quadraticCurveTo(375,56,376,206);g.quadraticCurveTo(318,150,260,161);g.quadraticCurveTo(192,145,137,206);g.closePath();g.fill();g.stroke();
 g.strokeStyle=ink;g.lineWidth=10;g.beginPath();g.moveTo(190,206);g.lineTo(224,199);g.moveTo(288,199);g.lineTo(322,206);g.stroke();
 g.fillStyle='#fff7ec';for(const x of [208,306]){g.beginPath();g.ellipse(x,235,15,19,0,0,Math.PI*2);g.fill();g.stroke();}
 g.fillStyle='#2c2929';for(const x of [211,309]){g.beginPath();g.arc(x,237,7,0,Math.PI*2);g.fill();}
 if(role==='watchman'){g.fillStyle='#272c36';g.beginPath();g.roundRect(157,5,198,66,13);g.fill();g.stroke();}
 if(role==='brewer'){g.fillStyle='#d7c2a1';g.beginPath();g.moveTo(194,385);g.lineTo(318,385);g.lineTo(344,580);g.lineTo(172,580);g.closePath();g.fill();g.stroke();}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(2,3.15,1);return s;
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
