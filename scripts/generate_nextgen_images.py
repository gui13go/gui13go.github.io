#!/usr/bin/env python3
"""
Next-Gen Image Format Generator (AVIF & WebP)
Converts PNG and JPG images in frontend/public to both WebP and AVIF formats
for HTML5 <picture> element content negotiation.
"""

import os
import sys
import subprocess
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
from PIL import Image

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(REPO_ROOT, 'frontend', 'public')

def convert_single_image(img_path):
    base, ext = os.path.splitext(img_path)
    ext_lower = ext.lower()
    if ext_lower not in ('.jpg', '.jpeg', '.png'):
        return None

    webp_path = base + '.webp'
    avif_path = base + '.avif'
    
    orig_mtime = os.path.getmtime(img_path)
    orig_size = os.path.getsize(img_path)
    
    webp_generated = False
    avif_generated = False

    # 1. Generate WebP via Pillow
    if not os.path.exists(webp_path) or os.path.getmtime(webp_path) < orig_mtime:
        try:
            with Image.open(img_path) as im:
                if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                    im.save(webp_path, format='WEBP', quality=85, method=4)
                else:
                    im.convert('RGB').save(webp_path, format='WEBP', quality=85, method=4)
            webp_generated = True
        except Exception as e:
            print(f"Error WebP {img_path}: {e}", file=sys.stderr)

    # 2. Generate AVIF via ffmpeg with SVT-AV1
    if not os.path.exists(avif_path) or os.path.getsize(avif_path) == 0 or os.path.getmtime(avif_path) < orig_mtime:
        try:
            cmd = [
                'ffmpeg', '-y', '-i', img_path,
                '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
                '-c:v', 'libsvtav1',
                '-crf', '32',
                '-preset', '8',
                '-pix_fmt', 'yuv420p',
                avif_path
            ]
            res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if res.returncode == 0 and os.path.exists(avif_path) and os.path.getsize(avif_path) > 0:
                avif_generated = True
            elif os.path.exists(avif_path) and os.path.getsize(avif_path) == 0:
                os.remove(avif_path)
        except Exception as e:
            print(f"Error AVIF {img_path}: {e}", file=sys.stderr)

    webp_size = os.path.getsize(webp_path) if os.path.exists(webp_path) else orig_size
    avif_size = os.path.getsize(avif_path) if os.path.exists(avif_path) else orig_size

    return {
        'path': os.path.relpath(img_path, PUBLIC_DIR),
        'orig_size': orig_size,
        'webp_size': webp_size,
        'avif_size': avif_size,
        'webp_generated': webp_generated,
        'avif_generated': avif_generated
    }

def main():
    target_dirs = [
        os.path.join(PUBLIC_DIR, 'images'),
        os.path.join(PUBLIC_DIR, 'photos')
    ]
    
    image_paths = []
    for t_dir in target_dirs:
        if not os.path.exists(t_dir):
            continue
        for root, _, files in os.walk(t_dir):
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in ('.jpg', '.jpeg', '.png'):
                    image_paths.append(os.path.join(root, f))
                    
    print(f"Found {len(image_paths)} source images to inspect across {PUBLIC_DIR}...")
    
    start_time = time.time()
    total_orig = 0
    total_webp = 0
    total_avif = 0
    converted_count = 0
    
    # Run in parallel across CPU workers
    workers = min(12, os.cpu_count() or 4)
    print(f"Executing conversion with {workers} parallel worker processes...")
    
    with ProcessPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(convert_single_image, p): p for p in image_paths}
        for future in as_completed(futures):
            res = future.result()
            if res:
                total_orig += res['orig_size']
                total_webp += res['webp_size']
                total_avif += res['avif_size']
                if res['webp_generated'] or res['avif_generated']:
                    converted_count += 1
                    if converted_count % 50 == 0 or converted_count <= 5:
                        print(f"  [{converted_count}] Processed {res['path']}: {res['orig_size']//1024}KB -> WebP {res['webp_size']//1024}KB -> AVIF {res['avif_size']//1024}KB")

    elapsed = time.time() - start_time
    print("\n" + "="*60)
    print(f"Conversion Complete in {elapsed:.2f}s!")
    print(f"Total Source Images: {len(image_paths)}")
    print(f"Images newly converted/updated: {converted_count}")
    print(f"Original total payload: {total_orig / (1024*1024):.2f} MB")
    print(f"WebP total payload:     {total_webp / (1024*1024):.2f} MB ({(total_orig-total_webp)*100/max(1, total_orig):.1f}% reduction)")
    print(f"AVIF total payload:     {total_avif / (1024*1024):.2f} MB ({(total_orig-total_avif)*100/max(1, total_orig):.1f}% reduction)")
    print("="*60)

if __name__ == '__main__':
    main()
