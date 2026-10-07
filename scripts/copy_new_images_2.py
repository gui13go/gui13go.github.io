import os
import glob
import shutil

artifact_dir = "/home/guigo/.gemini/antigravity-ide/brain/ba8270b4-0790-4a1e-9c31-f9593833a9cf"
dest_dir = "../frontend/public/images/personalities"

mapping = {
    "jackie_chan": "jackie_chan",
    "gustavo_kuerten": "gustavo_kuerten"
}

images = glob.glob(os.path.join(artifact_dir, "*_portrait_*.jpg"))
for img_path in images:
    filename = os.path.basename(img_path)
    for key, val in mapping.items():
        if filename.startswith(key + "_portrait"):
            dest_name = val + "_portrait.jpg"
            dest_path = os.path.join(dest_dir, dest_name)
            print(f"Copying {filename} to {dest_name}")
            shutil.copy(img_path, dest_path)
