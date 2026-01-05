import os
from PIL import Image

path = os.path.dirname(os.path.abspath(__file__))

for i in range(1, 5):
    src_name = f"screenshot-{i}-light.png" if i < 4 else f"screenshot-{i}.png"
    try:
        src = os.path.join(path, src_name)
        dst = os.path.join(path, f"screenshot-{i}.jpg")
        Image.open(src).convert("RGB").save(dst, quality=95, subsampling=0)
    except:
        pass
