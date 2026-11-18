#!/usr/bin/env python3
"""Named GLB fallback asset library; Blender script remains the editable canonical source."""
from pathlib import Path
import math,numpy as np,trimesh
out=Path('public/assets/generated/justanimate-library.glb');out.parent.mkdir(parents=True,exist_ok=True);scene=trimesh.Scene()
C={'wood':[112,70,43,255],'light':[158,106,64,255],'iron':[48,57,64,255],'brick':[146,79,62,255],'stone':[198,181,150,255],'roof':[61,69,82,255],'glass':[111,145,164,255],'skin':[239,196,160,255],'coat':[65,83,105,255],'green':[75,117,69,255],'dark':[38,33,35,255]}
def root(n):scene.graph.update(frame_to=n,matrix=np.eye(4),geometry=None,parent_node_name='world')
def add(r,n,m,pos,c):
 m.visual.face_colors=np.array(C[c] if isinstance(c,str) else c,dtype=np.uint8);M=np.eye(4);M[:3,3]=pos;scene.add_geometry(m,geom_name=n,node_name=n,transform=M,parent_node_name=r)
def box(r,n,p,s,c):add(r,n,trimesh.creation.box(extents=s),p,c)
def cyl(r,n,p,rad,h,c):
 m=trimesh.creation.cylinder(radius=rad,height=h,sections=32);m.apply_transform(trimesh.transformations.rotation_matrix(-math.pi/2,[1,0,0]));add(r,n,m,p,c)
def tor(r,n,p,rad,t,c='iron'):
 m=trimesh.creation.torus(major_radius=rad,minor_radius=t,major_sections=40,minor_sections=8);m.apply_transform(trimesh.transformations.rotation_matrix(-math.pi/2,[1,0,0]));add(r,n,m,p,c)
def sph(r,n,p,sc,c):
 m=trimesh.creation.icosphere(subdivisions=2);m.apply_scale(sc);add(r,n,m,p,c)
r='ASSET_Barrel';root(r);cyl(r,'Body',(0,.76,0),.46,1.5,'wood');cyl(r,'Lid',(0,1.53,0),.44,.06,'light')
for y in [.18,.72,1.34]:tor(r,'Hoop',(0,y,0),.465,.035)
r='ASSET_Vat';root(r);cyl(r,'Body',(0,3.45,0),2.55,6.9,'wood');cyl(r,'Rim',(0,6.94,0),2.58,.13,'light')
for y in [.55,2.1,4,6.35]:tor(r,'Hoop',(0,y,0),2.58,.105)
for i in range(20):
 a=i*math.tau/20;m=trimesh.creation.box(extents=(.1,6.7,.12));m.apply_transform(trimesh.transformations.rotation_matrix(-a,[0,1,0]));add(r,'Stave',m,(math.sin(a)*2.53,3.45,math.cos(a)*2.53),'light')
for name in ['ASSET_Crate','ASSET_Lantern','ASSET_HandCart','ASSET_CobblestoneTile','ASSET_GeorgianTownhouse','ASSET_StreetTree','ASSET_Character_Brewer_LightSkin','ASSET_Character_Woman_LightSkin','ASSET_Character_Watchman_LightSkin']:root(name)
r='ASSET_Crate';box(r,'Body',(0,.5,0),(1.1,1.1,1.1),'wood')
r='ASSET_Lantern';box(r,'Frame',(0,1,0),(.35,.7,.35),'iron');box(r,'Glass',(0,1,0),(.22,.48,.22),[230,180,100,220])
r='ASSET_HandCart';box(r,'Bed',(0,.8,0),(2,.2,1.2),'wood')
r='ASSET_CobblestoneTile';box(r,'Base',(0,0,0),(4,.16,4),'stone')
r='ASSET_GeorgianTownhouse';box(r,'BrickBody',(0,5,0),(9,10,5.5),'brick');box(r,'Cornice',(0,10,0),(9.4,.3,5.8),'stone')
r='ASSET_StreetTree';cyl(r,'Trunk',(0,1.5,0),.22,3,'wood');sph(r,'Canopy',(0,3,0),(1.2,1,1.2),'green')
for name,coat,hair in [('Brewer','wood','light'),('Woman','green','light'),('Watchman','coat','dark')]:
 r='ASSET_Character_'+name+'_LightSkin';box(r,'Torso',(0,1.35,0),(.9,1,.5),coat);sph(r,'Head',(0,2.2,0),(.34,.42,.3),'skin');sph(r,'Hair',(0,2.47,.03),(.36,.19,.31),hair)
 for side in [-1,1]:
  cyl(r,'Leg',(side*.18,.45,0),.11,.8,coat);cyl(r,'Arm',(side*.5,1.4,0),.1,.8,'skin')
scene.export(file_type='glb');out.write_bytes(scene.export(file_type='glb'));print('Wrote',out)
