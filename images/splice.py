import os
from PIL import Image

path = os.path.dirname(os.path.abspath(__file__))

for i in range(1, 5):
    try:
        l_path = os.path.join(path, f"screenshot-{i}-light.png")
        d_path = os.path.join(path, f"screenshot-{i}-dark.png")
        l = Image.open(l_path)
        d = Image.open(d_path)
        w, h = l.size
        split_x = int(w * 0.5)
        l.paste(d.crop((split_x, 0, w, h)), (split_x, 0))
        l.save(os.path.join(path, f"screenshot-{i}.png"))

    except:
        pass
