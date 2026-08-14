import os
from PIL import Image

ROOT = "/app/frontend/public/images"
# max long-edge per folder for sensible display sizes
LIMITS = {"treatments": 900, "heroes": 1500, "backgrounds": 1600}
QUALITY = 68

total_before = 0
total_after = 0
for folder, max_edge in LIMITS.items():
    d = os.path.join(ROOT, folder)
    for f in os.listdir(d):
        if not f.lower().endswith(".jpg"):
            continue
        p = os.path.join(d, f)
        total_before += os.path.getsize(p)
        im = Image.open(p).convert("RGB")
        w, h = im.size
        scale = min(1.0, max_edge / max(w, h))
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        im.save(p, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        total_after += os.path.getsize(p)

print(f"before={total_before/1e6:.1f}MB after={total_after/1e6:.1f}MB")
