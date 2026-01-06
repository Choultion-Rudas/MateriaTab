import os
from PIL import Image, ImageFilter

path = os.path.dirname(os.path.abspath(__file__))
files = {
    "screenshot-1-light.png": "screenshot-1-store.png",
    "screenshot-2-light.png": "screenshot-2-store.png",
    "screenshot-3-light.png": "screenshot-3-store.png",
    "screenshot-4.png": "screenshot-4-store.png",
}
for src, dst in files.items():
    src_path = os.path.join(path, src)
    if os.path.exists(src_path):
        img = Image.open(src_path).convert("RGB")
        w, h = img.size
        new_w = h * 1.6
        left = (w - new_w) / 2
        img = img.crop((left, 0, w - left, h))
        img = img.resize((1280, 800), Image.Resampling.LANCZOS)
        img.save(os.path.join(path, dst), "PNG", optimize=True)
