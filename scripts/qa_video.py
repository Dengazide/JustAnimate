#!/usr/bin/env python3
"""Check runtime, dimensions, fps, audio and every decoded frame; emit 2s contact sheets."""
import argparse,json,subprocess
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
def run(a,b=True):
 p=subprocess.run(a,capture_output=True,text=b)
 if p.returncode:raise RuntimeError(p.stderr)
 return p.stdout
def main():
 p=argparse.ArgumentParser();p.add_argument('video');p.add_argument('--out-dir',default='out/qa');p.add_argument('--shots',default='story/beer-flood/shots.json');a=p.parse_args()
 out=Path(a.out_dir);out.mkdir(parents=True,exist_ok=True)
 meta=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',a.video]));v=next(x for x in meta['streams'] if x['codec_type']=='video');aud=[x for x in meta['streams'] if x['codec_type']=='audio'];dur=float(meta['format']['duration'])
 w,h=180,320;raw=run(['ffmpeg','-v','error','-i',a.video,'-vf',f'scale={w}:{h}','-f','rawvideo','-pix_fmt','rgb24','-'],False);sz=w*h*3;n=len(raw)//sz
 mean=[];diff=[];prev=None
 for i in range(n):
  f=np.frombuffer(raw[i*sz:(i+1)*sz],np.uint8).reshape(h,w,3);mean.append(float((f@np.array([.2126,.7152,.0722])).mean()/255))
  if prev is not None:diff.append(float(np.abs(f.astype(np.int16)-prev.astype(np.int16)).mean()))
  prev=f.copy()
  if i%60==59 or i==n-1:
   start=i//60*60;sheet=Image.new('RGB',(1080,1152),'black');d=ImageDraw.Draw(sheet)
   for j in range(min(60,n-start)):
    q=np.frombuffer(raw[(start+j)*sz:(start+j+1)*sz],np.uint8).reshape(h,w,3)
    x,y=j%10*108,j//10*192;sheet.paste(Image.fromarray(q).resize((108,192)),(x,y));d.text((x+2,y+2),str(start+j),fill='yellow')
   sheet.save(out/f'sheet_{start:04d}.jpg',quality=88)
 black=[i for i,x in enumerate(mean) if x<.035];white=[i for i,x in enumerate(mean) if x>.96]
 frozen=[];st=None
 for i,x in enumerate(diff):
  if x<.02:st=i if st is None else st
  elif st is not None:
   if i-st>=12:frozen.append([st,i])
   st=None
 checks={'duration_30s':abs(dur-30)<.08,'fps_30':v['r_frame_rate']=='30/1','vertical':int(v['width'])*16==int(v['height'])*9,'1080x1920':int(v['width'])>=1080 and int(v['height'])>=1920,'audio':bool(aud),'frames_900':n==900,'no_black':not black,'no_white':not white,'no_freeze':not frozen}
 loud='not measured'
 if aud:
  e=run(['ffmpeg','-hide_banner','-i',a.video,'-map','0:a:0','-af','ebur128=peak=true','-f','null','-'],False).stderr.decode(errors='replace');tail=e[e.rfind('Summary:'):];loud=' | '.join(x.strip() for x in tail.splitlines() if x.strip().startswith(('I:','LRA:','Peak:')))
 lines=['# QA report',f'Duration: {dur:.3f}s',f'Video: {v["width"]}x{v["height"]} @ {v["r_frame_rate"]}',f'Audio: {aud[0].get("sample_rate")} Hz' if aud else 'Audio missing',f'Loudness: {loud}','## Checks']+[f"- [{'x' if ok else ' '}] {k}" for k,ok in checks.items()]+[f'Black frames: {black[:30]}',f'White frames: {white[:30]}',f'Frozen spans: {frozen[:30]}']
 (out/'report.md').write_text('\n'.join(lines)+'\n');print('\n'.join(lines))
if __name__=='__main__':main()
