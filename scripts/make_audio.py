#!/usr/bin/env python3
"""Generate 30s British English voice + original procedural music and effects."""
import argparse,math,re,shutil,subprocess,tempfile,wave
from pathlib import Path
import numpy as np
SR=48000;DUR=30
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out-dir',default='public/audio');ap.add_argument('--script',default='story/beer-flood/script.md');ap.add_argument('--voice-rate',type=int,default=245);a=ap.parse_args()
 out=Path(a.out_dir);out.mkdir(parents=True,exist_ok=True);s=Path(a.script).read_text()
 narration=' '.join(x.strip() for x in re.search(r'## Narration\s*(.*?)(?:\n## |\Z)',s,re.S).group(1).splitlines() if x.strip())
 voice=shutil.which('espeak-ng') or shutil.which('espeak')
 if not voice:raise SystemExit('Install espeak-ng or espeak.')
 with tempfile.TemporaryDirectory() as td:
  raw=Path(td)/'voice.wav';fit=Path(td)/'fit.wav'
  subprocess.run([voice,'-v','en-gb','-s',str(a.voice_rate),'-w',str(raw),narration],check=True)
  dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
  speed=dur/DUR
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',f'atempo={speed:.6f},aresample=48000,apad,atrim=0:30','-ac','1','-c:a','pcm_s16le',str(fit)],check=True)
  with wave.open(str(fit),'rb') as w:v=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768
 n=SR*DUR;v=np.pad(v,(0,max(0,n-len(v))))[:n];v*=.82/(np.max(np.abs(v))+1e-8)
 t=np.arange(n,dtype=np.float32)/SR;rng=np.random.default_rng(1814)
 music=.04*np.sin(2*np.pi*110*t)+.025*np.sin(2*np.pi*165*t)+.018*np.sin(2*np.pi*220*t)
 music*=.7+.3*np.sin(2*np.pi*.45*t);music*=np.minimum(1,t)*np.minimum(1,(DUR-t)/1.5)
 noise=rng.normal(0,1,n).astype(np.float32);music+=np.convolve(noise,np.ones(240,dtype=np.float32)/240,'same')*.18
 sfx=np.zeros(n,dtype=np.float32)
 for at,dur,amp in [(8.65,.75,.12),(9.8,1.7,.16),(13.9,4.8,.13),(20.4,1.6,.08),(23.2,.9,.05)]:
  i=int(at*SR);j=min(n,int((at+dur)*SR));q=np.arange(j-i)/SR
  sfx[i:j]+=rng.normal(0,1,j-i)*amp*np.exp(-q*5)
 mix=v*.88+music*.2+sfx*.35;mix*=min(1,.92/(np.max(np.abs(mix))+1e-8))
 stereo=np.column_stack((mix,np.roll(mix,288)*.96));tmp=out/'pre.wav';target=out/'beer-flood-mix.wav'
 with wave.open(str(tmp),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(stereo,-1,1)*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(tmp),'-af','loudnorm=I=-14:TP=-1:LRA=4','-ar','48000','-ac','2',str(target)],check=True);tmp.unlink()
 (out/'narration.txt').write_text(narration)
 print('Wrote',target,'30.0 seconds')
if __name__=='__main__':main()
