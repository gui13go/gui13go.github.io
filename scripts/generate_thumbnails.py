#!/usr/bin/env python3
"""
Generate optimized thumbnail images (360x360 WebP) for personalities and agents.
Retains original images in frontend/public/images/{personalities,agents} for full-screen / zoom lightbox.
Outputs thumbnails to frontend/public/images/{personalities_thumbs,agents_thumbs}.
"""

import os
import sys
import glob
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(REPO_ROOT, 'frontend', 'public')

TARGETS = [
    {
        'src_dir': os.path.join(PUBLIC_DIR, 'images', 'personalities'),
        'out_dir': os.path.join(PUBLIC_DIR, 'images', 'personalities_thumbs'),
        'size': (360, 360),
        'quality': 82
    },
    {
        'src_dir': os.path.join(PUBLIC_DIR, 'images', 'agents'),
        'out_dir': os.path.join(PUBLIC_DIR, 'images', 'agents_thumbs'),
        'size': (360, 360),
        'quality': 82
    }
]

def process_file(task):
    src_path, out_dir, target_size, quality = task
    filename = os.path.basename(src_path)
    base_name, _ = os.path.splitext(filename)
    
    out_path = os.path.join(out_dir, f"{base_name}.webp")
    
    try:
        src_mtime = os.path.getmtime(src_path)
        if os.path.exists(out_path) and os.path.getmtime(out_path) >= src_mtime:
            return None
            
        with Image.open(src_path) as im:
            has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
            im_copy = im.convert('RGBA') if has_alpha else im.convert('RGB')
            
            im_copy.thumbnail(target_size, Image.Resampling.LANCZOS)
            im_copy.save(out_path, format='WEBP', quality=quality, method=4)
            
        orig_sz = os.path.getsize(src_path)
        thumb_sz = os.path.getsize(out_path)
        return (filename, orig_sz, thumb_sz)
    except Exception as e:
        return (filename, 0, 0, str(e))

def main():
    total_orig = 0
    total_thumb = 0
    total_processed = 0

    for target in TARGETS:
        src_dir = target['src_dir']
        out_dir = target['out_dir']
        os.makedirs(out_dir, exist_ok=True)
        
        all_files = glob.glob(os.path.join(src_dir, '*'))
        image_files = [f for f in all_files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
        
        base_map = {}
        for f in image_files:
            bname = os.path.splitext(os.path.basename(f))[0]
            ext = os.path.splitext(f)[1].lower()
            if bname not in base_map or ext in ('.png', '.jpg', '.jpeg'):
                base_map[bname] = f
                
        tasks = [
            (f_path, out_dir, target['size'], target['quality'])
            for f_path in base_map.values()
        ]
        
        print(f"Generating thumbnails for {os.path.basename(src_dir)}: {len(tasks)} images...")
        with ProcessPoolExecutor() as executor:
            for res in executor.map(process_file, tasks):
                if res:
                    if len(res) == 4:
                        print(f"Error {res[0]}: {res[3]}", file=sys.stderr)
                    else:
                        fname, orig_sz, thumb_sz = res
                        total_orig += orig_sz
                        total_thumb += thumb_sz
                        total_processed += 1

    print(f"\nFinished generating thumbnails!")
    print(f"Processed: {total_processed} images")
    if total_orig > 0:
        print(f"Original size sum: {total_orig / (1024*1024):.2f} MB")
        print(f"Thumbnail size sum: {total_thumb / (1024*1024):.2f} MB")
        print(f"Compression ratio: {100.0 * (1.0 - (total_thumb / total_orig)):.1f}% reduction!")

if __name__ == '__main__':
    main()
