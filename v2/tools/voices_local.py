"""Make voices/<ep>/pack.wav + pack.json locally with Kokoro-82M v1.0 (kokoro-onnx, same model + voice names
as the Kokoro web page). Use this when the browser WAV can't be moved into the workspace.

Setup (once per session):
  pip install --break-system-packages kokoro-onnx soundfile
  curl -sSL -o ~/kokoro/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  curl -sSL -o ~/kokoro/voices-v1.0.bin   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
Usage: python3 tools/voices_local.py ep002 [model_dir]
Speed/FX are NOT applied here (build.py does it from cast.json), same as the web-page pack.
"""
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = sys.argv[1]
MD = sys.argv[2] if len(sys.argv) > 2 else os.path.expanduser('~/kokoro')
ep = json.load(open(f'{ROOT}/episodes/{EP}.json'))
cast = json.load(open(f'{ROOT}/cast.json'))['characters']
k = Kokoro(f'{MD}/kokoro-v1.0.onnx', f'{MD}/voices-v1.0.bin')

out, meta, pos, SR = [], {}, 0, 24000
for i, e in enumerate(ep['events']):
    if not e.get('say'):
        continue
    x, sr = k.create(e['say'], voice=cast[e['who']]['voice'], speed=1.0, lang='en-us')
    assert sr == SR
    meta[str(i)] = {'who': e['who'], 'start': round(pos / SR, 3), 'dur': round(len(x) / SR, 3)}
    out += [x, np.zeros(SR // 2)]
    pos += len(x) + SR // 2
    print(i, e['who'], meta[str(i)]['dur'])
os.makedirs(f'{ROOT}/voices/{EP}', exist_ok=True)
sf.write(f'{ROOT}/voices/{EP}/pack.wav', np.concatenate(out), SR, subtype='PCM_16')
json.dump(meta, open(f'{ROOT}/voices/{EP}/pack.json', 'w'))
print('pack ok', round(pos / SR, 2), 's')
