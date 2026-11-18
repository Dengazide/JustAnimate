"""Procedural reusable prop and character GLB library. Run with Blender 4.2+:
blender -b -t 8 --python blender/build_asset_library.py
"""
from pathlib import Path
import bpy, math
ROOT=Path(__file__).resolve().parents[1]
GLB=ROOT/'public/assets/generated/justanimate-library.glb'
BLEND=ROOT/'assets/generated/JustAnimate_Library.blend'
GLB.parent.mkdir(parents=True,exist_ok=True); BLEND.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(n,c,metal=0):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=.78
 return m
wood=mat('Oak',(0.25,.13,.07)); light=mat('Oak light',(.43,.25,.13)); iron=mat('Wrought iron',(.07,.09,.11),.78)
brick=mat('Georgian brick',(.39,.19,.14)); stone=mat('Limestone',(.65,.56,.43)); roof=mat('Slate',(.12,.15,.19))
skin=mat('Light skin',(.78,.58,.45)); coat=mat('Indigo coat',(.10,.17,.26)); green=mat('Leaf green',(.16,.28,.15)); glass=mat('Blue glass',(.13,.24,.31))
def root(n,loc):
 o=bpy.data.objects.new(n,None);bpy.context.collection.objects.link(o);o.location=loc;return o
def add_cube(n,loc,dim,m,p=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if p:o.parent=p;o.matrix_parent_inverse=p.matrix_world.inverted()
 b=o.modifiers.new('Soft edges','BEVEL');b.width=.025;b.segments=2;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL');return o
def cyl(n,loc,r,d,m,p=None,v=32):
 bpy.ops.mesh.primitive_cylinder_add(vertices=v,radius=r,depth=d,location=loc);o=bpy.context.object;o.name=n;o.data.materials.append(m)
 if p:o.parent=p;o.matrix_parent_inverse=p.matrix_world.inverted()
 return o
def tor(n,loc,r,t,m,p=None):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=40,minor_segments=8,location=loc);o=bpy.context.object;o.name=n;o.data.materials.append(m)
 if p:o.parent=p;o.matrix_parent_inverse=p.matrix_world.inverted()
 return o
def sphere(n,loc,scale,m,p=None):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,radius=1,location=loc);o=bpy.context.object;o.name=n;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if p:o.parent=p;o.matrix_parent_inverse=p.matrix_world.inverted()
 return o
# Barrel
p=root('ASSET_Barrel',(0,0,0));cyl('Barrel body',(0,.76,0),.46,1.5,wood,p);cyl('Barrel lid',(0,1.53,0),.44,.06,light,p)
for y in (.18,.72,1.34):tor('Barrel iron hoop',(0,y,0),.465,.035,iron,p)
# Vat
p=root('ASSET_Vat',(8,0,0));cyl('Vat body',(8,3.45,0),2.55,6.9,wood,p);cyl('Vat rim',(8,6.94,0),2.58,.12,light,p)
for y in (.55,2.1,4,6.35):tor('Vat hoop',(8,y,0),2.58,.105,iron,p)
for i in range(20):
 a=i*math.tau/20;x=8+math.sin(a)*2.55;z=math.cos(a)*2.55
 o=add_cube('Vat stave',(x,3.45,z),(.07,6.75,.13),light,p);o.rotation_euler[1]=a
# Crate, lantern, cart, cobble tile
p=root('ASSET_Crate',(16,0,0));add_cube('Crate body',(16,.55,0),(1.1,1.1,1.1),wood,p)
for i in range(4):add_cube('Crate slat',(15.58+i*.28,.56,.57),(.18,1.04,.04),light,p)
p=root('ASSET_Lantern',(22,0,0));add_cube('Lantern frame',(22,1.1,0),(.34,.65,.34),iron,p);add_cube('Lantern glass',(22,1.1,0),(.22,.48,.22),glass,p);cyl('Lantern cap',(22,1.48,0),.25,.12,iron,p)
p=root('ASSET_HandCart',(48,0,0));add_cube('Cart bed',(48,.85,0),(2.1,.22,1.25),wood,p)
for x in (47.05,48.95):tor('Cart wheel',(x,.68,0),.62,.08,iron,p)
p=root('ASSET_CobblestoneTile',(54,0,0));add_cube('Cobble base',(54,-.08,0),(4,.16,4),stone,p)
for i in range(4):
 for j in range(4):add_cube('Cobble',(52.5+i,-.02,-1.5+j),(.88,.12,.88),stone if (i+j)%2 else brick,p)
# Georgian townhouse
p=root('ASSET_GeorgianTownhouse',(34,0,0));add_cube('Townhouse brick',(34,5,0),(9,10,5.5),brick,p);add_cube('Townhouse cornice',(34,10.05,0),(9.4,.28,5.8),stone,p)
for floor in range(3):
 for col in (-1,0,1):
  x=34+col*2.55;y=2.1+floor*3
  add_cube('Window recess',(x,y,2.78),(1,1.45,.12),iron,p);add_cube('Window glass',(x,y,2.87),(.76,1.18,.05),glass,p)
# Street tree
p=root('ASSET_StreetTree',(70,0,0));cyl('Tree trunk',(70,1.5,0),.22,3,wood,p)
for i,(x,y,z,r) in enumerate(((-.65,2.7,0,1),(.55,3,.1,1.15),(0,3.35,.55,1),(0,2.8,-.55,.9))):sphere('Tree canopy',(70+x,y,z),(r,r*.8,r),green,p)
# Three original generic light-skin character starter meshes, with individually named parts
for name,cm,hm in [('Brewer',wood,light),('Woman',green,light),('Watchman',coat,iron)]:
 p=root('ASSET_Character_'+name+'_LightSkin',(78+6*['Brewer','Woman','Watchman'].index(name),0,0))
 for side in (-1,1):
  cyl('Character leg',(p.location.x+side*.17,.38,0),.12,.72,coat,p,12)
  cyl('Character arm',(p.location.x+side*.48,1.25,0),.10,.86,skin,p,12)
  sphere('Character eye',(p.location.x+side*.125,2.25,-.296),(.045,.025,.065),iron,p)
 add_cube('Character torso',(p.location.x,1.35,0),(.92,1.05,.52),cm,p)
 sphere('Character head',(p.location.x,2.22,-.015),(.34,.42,.30),skin,p)
 sphere('Character hair',(p.location.x,2.47,.035),(.355,.19,.305),hm,p)
 if name=='Watchman':cyl('Watchman cap',(p.location.x,2.7,0),.34,.22,iron,p)
 if name=='Brewer':add_cube('Brewer apron',(p.location.x,1.28,-.29),(.55,.72,.05),stone,p)
 if name=='Woman':sphere('Woman hair bun',(p.location.x+.28,2.55,.02),(.18,.18,.18),hm,p)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(GLB),export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_materials='EXPORT')
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
print('Saved',GLB,'and',BLEND)
