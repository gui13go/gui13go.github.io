import json
import os
import re

img_dir = '../frontend/public/images/personalities'
available_files = set(os.listdir(img_dir))

unique_bases = set()
for f in available_files:
    if '_portrait' in f:
        # e.g., gwf_hegel_portrait_1769434211862.png -> gwf_hegel
        base = f.split('_portrait')[0]
        unique_bases.add(base)

print(f"Unique portrait bases: {len(unique_bases)}")
