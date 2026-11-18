export const FPS = 30;
export const DURATION = 900;
export type Vec3 = [number, number, number];
export const SHOTS = [
 {id:'establish',a:0,b:120,camera:[0,11,27] as Vec3,look:[0,5,-8] as Vec3,fov:43},
 {id:'brewery',a:120,b:255,camera:[-4,10,16] as Vec3,look:[-8,9,-10] as Vec3,fov:39},
 {id:'failure',a:255,b:405,camera:[-6,14,8] as Vec3,look:[-8,12,-11] as Vec3,fov:36},
 {id:'flood',a:405,b:630,camera:[1,7,12] as Vec3,look:[0,3,-10] as Vec3,fov:42},
 {id:'aftermath',a:630,b:780,camera:[4,6,10] as Vec3,look:[0,3,-12] as Vec3,fov:46},
 {id:'today',a:780,b:900,camera:[7,8,16] as Vec3,look:[0,7,-7] as Vec3,fov:44}
];
export const smooth01=(x:number)=>{const t=Math.min(1,Math.max(0,x));return t*t*(3-2*t)};
export const cameraAt=(frame:number)=>{
 const shot=SHOTS.find(s=>frame>=s.a&&frame<s.b)??SHOTS[SHOTS.length-1];
 const u=smooth01((frame-shot.a)/Math.max(1,shot.b-shot.a));
 const push=1-.018*u;
 return {position:[shot.camera[0]*push,shot.camera[1]*push,shot.camera[2]*push] as Vec3,look:shot.look,fov:shot.fov};
};
