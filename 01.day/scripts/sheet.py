import sys
from PIL import Image
files = sys.argv[2:]; out = sys.argv[1]
ims = [Image.open(f).convert("RGB").resize((540, 540)) for f in files]
cols = 3 if len(ims) > 2 else len(ims); rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (540 * cols, 540 * rows), "white")
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * 540, (i // cols) * 540))
sheet.save(out)
