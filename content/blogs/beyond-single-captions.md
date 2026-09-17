---
title: "Beyond Single Captions: Stacking Multiple Subtitles and Enhancing Media on GNU/Linux"
date: 2026-09-14T19:00:00Z
draft: true
url: "/blogs/beyond-single-captions"
description: "A masterclass in multi-subtitle engineering on GNU/Linux: stacking English, Chinese, and German captions, playback with mpv, export options, and video/audio quality enhancement."
tags: ["Linux", "Subtitles", "FFmpeg", "MPV", "Media Engineering", "Automation", "Open Source", "Whisper"]
categories: ["Linux", "Media Engineering"]
cover:
  image: "/images/beyond-single-captions-cover.jpg"
  alt: "Beyond Single Captions: Stacking Multiple Subtitles and Enhancing Media on GNU/Linux"
  caption: "Multi-Language Subtitle Engineering and Media Enhancement on GNU/Linux"
  relative: false
---

When watching foreign cinema, technical lectures, or historical documentaries, the standard media player experience is stubbornly restrictive. Mainstream video players typically limit viewers to a single subtitle track pinned to the bottom of the screen, or at best, two awkward tracks overlapping in an unreadable jumble.

On GNU/Linux, you possess complete sovereignty over your media stack. Assuming you already have your video file on disk—obtained from whatever source or personal archive—you can use open-source command-line utilities to fetch or generate subtitle streams across multiple languages, synthesize them into a unified multi-tiered canvas using Advanced SubStation Alpha (`.ass`), interactively navigate sentence-by-sentence with `mpv`, hardcode or soft-mux the result using `ffmpeg`, and apply filtering pipelines to dramatically upgrade video sharpness and dialogue clarity.

In this guide, we use the quintessential open-source documentary **_Revolution OS_ (2001)**—which chronicles the birth of Linux, GNU, and the open-source movement through interviews with Linus Torvalds, Richard Stallman, Eric S. Raymond, and Bruce Perens—as our end-to-end case study (e.g., `Revolution_OS_2001.mkv`). However, this workflow applies universally to any video file in your collection.

---

## 1. Automated Subtitle Retrieval Across Multiple Languages

If your video file lacks subtitles in your target study or reference languages, manual web searching is tedious and frequently leads to out-of-sync releases with mismatched frame rates (e.g. 23.976 fps vs. 25 fps PAL).

### 1.1 Automated Hash Matching with Subliminal

[`subliminal`](https://github.com/Diaoul/subliminal) automates subtitle discovery directly from the terminal. Instead of relying purely on file names, `subliminal` calculates a cryptographic 64-bit checksum of the video binary and queries databases such as OpenSubtitles, Podnapisi, and Addic7ed to retrieve frame-perfect subtitles matched to your exact cut.

```bash
# Install subliminal
pip install --user subliminal

# Fetch English, German, and Chinese subtitles in one step
VIDEO="Revolution_OS_2001.mkv"
subliminal download -l eng -l deu -l zho "$VIDEO"
```

This creates matching SubRip files in the same directory:
- `Revolution_OS_2001.en.srt` (English)
- `Revolution_OS_2001.de.srt` (German)
- `Revolution_OS_2001.zh.srt` (Chinese)

#### Available Languages

Because `subliminal` and modern subtitle repositories use ISO 639-2 / ISO 639-1 language codes, you can request virtually any language in the global catalog:
- **Spanish** (`spa` / `es`), **Portuguese** (`por` / `pt`)
- **French** (`fra` / `fr`), **Italian** (`ita` / `it`)
- **Japanese** (`jpn` / `ja`), **Korean** (`kor` / `ko`)
- **Russian** (`rus` / `ru`), **Arabic** (`ara` / `ar`)
- **Dutch** (`nld` / `nl`), **Swedish** (`swe` / `sv`)

To fetch an alternative language pairing—for instance, Portuguese, French, and English:
```bash
subliminal download -l por -l fra -l eng "$VIDEO"
```

---

### 1.2 Generating Missing Subtitles Locally with Whisper (AI Fallback)

If a niche language subtitle does not exist online, you can leverage local neural speech-to-text engines like [`whisper.cpp`](https://github.com/ggerganov/whisper.cpp) or [`whisper-ctranslate2`](https://github.com/Softcatala/whisper-ctranslate2) directly on your local GPU or CPU to transcribe or translate the soundtrack into `.srt`:

```bash
# Transcribe spoken English dialogue directly into a timestamped SRT file
whisper-ctranslate2 --model large-v3 --language en --output_format srt \
  --output_dir . "Revolution_OS_2001.mkv"

# Translate spoken audio directly into German or Chinese SRT locally
whisper-ctranslate2 --model large-v3 --task translate --target_language de \
  --output_format srt --output_dir . "Revolution_OS_2001.mkv"
```

---

## 2. The Multi-Subtitle Challenge & Spatial Layout

Standard video players only display one subtitle track at a time. While `mpv` allows a secondary track via `--secondary-sid`, rendering **three or more simultaneous languages** (crucial for polyglots, linguistics students, translation verification, or multilingual households) causes standard players to overlap lines into an illegible visual knot.

When studying a technical film or historical documentary like *Revolution OS*, a tri-lingual configuration provides an optimal cognitive balance:
1. **Target Learning Language** (e.g., German): Active vocabulary expansion and grammar observation.
2. **Native / Semantic Anchor** (e.g., Chinese, Portuguese, or Spanish): Instant conceptual grounding.
3. **Verbatim Spoken Dialogue** (English): Accurate phonetic, syntactic, and technical terminology reference.

### The Cognitive Spatial Layout

```
+-------------------------------------------------------------+
|                [ German: Top Center (Yellow) ]              |
|                                                             |
|                         VIDEO CANVAS                        |
|                                                             |
|             [ Chinese: Bottom Center - High (White) ]       |
|             [ English: Bottom Center - Low (Sky Blue) ]     |
+-------------------------------------------------------------+
```

1. **Top Center (`Alignment 8`, Warm Yellow `#FFE066`)**:
   Placing the target study language at the top turns it into an intentional reference. You glance up deliberately when you want to see how an English concept ("copyleft", "kernel", "general public license") is formulated in German.
2. **Bottom Center Raised (`Alignment 2`, Pure White `#FFFFFF`, `marginv=95`)**:
   Reading your native tongue is automatic and rapid. Elevating it above the baseline ensures it doesn't obscure the verbatim spoken transcript below.
3. **Bottom Center Baseline (`Alignment 2`, Sky Blue `#78E1FF`, `marginv=25`)**:
   The verbatim spoken English transcript sits right at the natural eye-line with high contrast and a distinct dark outline for effortless readability across varied scenes.
4. **Clean Sightlines**:
   Distributing text between the top ceiling and the floor avoids cluttering the lower half of the frame and prevents covering interviewees' faces or title cards.

---

## 3. Subtitle Synthesis Engine (`merge_subtitles.py`)

Using Python and [`pysubs2`](https://pypi.org/project/pysubs2/), we merge the distinct `.srt` files into an **Advanced SubStation Alpha (`.ass`)** master file. The ASS standard allows pixel-perfect coordinate placement, margin offsets, custom fonts, layer priorities, and distinct color codes per track.

Install the prerequisite:
```bash
pip install --user pysubs2
```

Save the following script as `merge_subtitles.py`:

```python
#!/usr/bin/env python3
"""
merge_subtitles.py - Universal Multi-Language ASS Subtitle Synthesizer
Combines separate SRT subtitle files into a unified, multi-tiered ASS file.
Supports English, Chinese, German, Portuguese, Spanish, French, Russian, Japanese, etc.
"""

import sys
import argparse
from pathlib import Path
import pysubs2
from pysubs2 import SSAFile, SSAStyle, Color

LANG_ALIASES = {
    "de": "de", "deu": "de", "ger": "de", "german": "de",
    "zh": "zh", "zho": "zh", "chi": "zh", "chinese": "zh",
    "en": "en", "eng": "en", "english": "en",
    "pt": "pt", "por": "pt", "portuguese": "pt",
    "es": "es", "spa": "es", "spanish": "es",
    "fr": "fr", "fra": "fr", "french": "fr",
    "it": "it", "ita": "it", "italian": "it",
    "ja": "ja", "jpn": "ja", "japanese": "ja",
    "ru": "ru", "rus": "ru", "russian": "ru",
}

def normalize_lang(code: str) -> str:
    return LANG_ALIASES.get(code.strip().lower(), code.strip().lower())

def find_sub(base_dir: Path, stem: str, lang: str) -> Path | None:
    norm = normalize_lang(lang)
    candidates = [
        base_dir / f"{stem}.{norm}.srt",
        base_dir / f"{stem}.{lang}.srt",
        base_dir / f"{stem}_{norm}.srt",
        base_dir / f"{stem}_{lang}.srt",
        base_dir / f"{norm}.srt",
        base_dir / f"{lang}.srt",
    ]
    for c in candidates:
        if c.exists():
            return c
    matches = sorted(base_dir.glob(f"{stem}*.{norm}.srt"))
    return matches[0] if matches else None

def get_font_for_lang(lang: str) -> str:
    norm = normalize_lang(lang)
    if norm == "zh":
        return "Noto Sans CJK SC"
    if norm == "ja":
        return "Noto Sans CJK JP"
    if norm == "ru":
        return "DejaVu Sans"
    return "DejaVu Sans"

def merge_subtitles(
    video_path: str | Path,
    languages: list[str] = ["de", "zh", "en"],
    output_path: str | Path | None = None
) -> Path:
    video_path = Path(video_path)
    base_dir = video_path.parent.resolve() if video_path.parent != Path("") else Path(".").resolve()
    video_stem = video_path.stem

    requested_langs = [normalize_lang(l) for l in languages]
    lang_files = {}

    for lang in requested_langs:
        sub_file = find_sub(base_dir, video_stem, lang)
        if not sub_file or not sub_file.exists():
            raise FileNotFoundError(
                f"Subtitle file for language '{lang}' not found for '{video_stem}'. "
                f"Expected: {base_dir / f'{video_stem}.{lang}.srt'}"
            )
        lang_files[lang] = sub_file

    combined = SSAFile()
    combined.info["PlayResX"] = 1920
    combined.info["PlayResY"] = 1080
    combined.info["ScaledBorderAndShadow"] = "yes"

    # Multi-tier style configurations (Top, Middle, Bottom)
    style_configs = [
        {"suffix": "Top", "alignment": 8, "marginv": 35, "color": Color(255, 235, 130), "size": 38.0, "outline": 2.5, "layer": 0},
        {"suffix": "Mid", "alignment": 2, "marginv": 95, "color": Color(255, 255, 255), "size": 46.0, "outline": 3.0, "layer": 1},
        {"suffix": "Bot", "alignment": 2, "marginv": 25, "color": Color(120, 225, 255), "size": 36.0, "outline": 2.5, "layer": 2},
    ]

    for idx, lang in enumerate(requested_langs):
        cfg = style_configs[idx] if idx < len(style_configs) else style_configs[-1]
        style_name = f"{lang.title()}{cfg['suffix']}"

        style = SSAStyle(
            fontname=get_font_for_lang(lang),
            fontsize=cfg["size"],
            primarycolor=cfg["color"],
            outlinecolor=Color(0, 0, 0),
            backcolor=Color(0, 0, 0, 128),
            bold=True,
            alignment=cfg["alignment"],
            marginl=30, marginr=30, marginv=cfg["marginv"],
            outline=cfg["outline"], shadow=1.0,
        )
        combined.styles[style_name] = style

        subs = pysubs2.load(str(lang_files[lang]), encoding="utf-8")
        for ev in subs:
            if ev.text.strip():
                ev.style = style_name
                ev.layer = cfg["layer"]
                combined.events.append(ev)

    combined.events.sort(key=lambda x: (x.start, x.end))
    if output_path:
        dest = Path(output_path)
    else:
        tag = "trio" if len(requested_langs) == 3 else "multi"
        dest = base_dir / f"{video_stem}.{tag}.ass"

    combined.save(str(dest))
    print(f"Successfully generated: {dest.name}")
    return dest

def main():
    parser = argparse.ArgumentParser(description="Merge multiple SRT subtitles into an ASS file.")
    parser.add_argument("video", nargs="?", default=None, help="Video file or stem")
    parser.add_argument(
        "-l", "--languages", nargs="+", default=["de", "zh", "en"],
        help="Ordered list of languages (default: de zh en). E.g. -l de zh en, or -l de pt en"
    )
    parser.add_argument("-o", "--output", default=None, help="Custom output .ass filename")
    args = parser.parse_args()

    if args.video:
        target_video = args.video
    else:
        videos = list(Path(".").glob("*.mkv")) + list(Path(".").glob("*.mp4"))
        if videos:
            target_video = videos[0]
        else:
            print("Error: No video found in current folder.", file=sys.stderr)
            sys.exit(1)

    merge_subtitles(target_video, languages=args.languages, output_path=args.output)

if __name__ == "__main__":
    main()
```

### Executing the Synthesis

```bash
# Default combination: German (top), Chinese (middle), English (bottom)
python3 merge_subtitles.py Revolution_OS_2001.mkv

# Custom combination: German (top), Portuguese (middle), English (bottom)
python3 merge_subtitles.py Revolution_OS_2001.mkv -l de pt en

# Quadruple stack: German (top), Spanish (mid), English (bot)
python3 merge_subtitles.py Revolution_OS_2001.mkv -l de es en
```

---

## 4. Seeing the Movie: Interactive Playback with `mpv`

[`mpv`](https://mpv.io) is a high-performance, scriptable media player that renders Advanced SubStation Alpha typography natively using `libass`.

### The Recommended Playback Command

```bash
VIDEO="Revolution_OS_2001.mkv"
STEM="${VIDEO%.*}"

mpv \
  --fs \
  --speed=0.90 \
  --af=loudnorm \
  --save-position-on-quit \
  --sub-file="${STEM}.trio.ass" \
  "$VIDEO"
```

### Key Technical Parameters:
1. **`--af=loudnorm` (Dynamic Speech Normalization)**:
   Documentaries frequently feature quiet interview recordings alternating with loud transitional soundtrack cues. On laptop or monitor stereo speakers, dialogue can be easily masked. FFmpeg's `loudnorm` filter performs real-time **EBU R128 loudness normalization**, leveling speech without audible compression pumping or distortion.
2. **`--speed=0.90` (Pitch-Preserved Pace Control)**:
   Slows down rapid speech by 10% to allow your eyes to cross-reference the spoken dialogue and multiple translation tiers comfortably. Audio pitch is maintained naturally without the chipmunk effect.
3. **`--save-position-on-quit`**:
   Saves your exact playback timestamp so you can pick up where you left off.
4. **`--sub-file="${STEM}.trio.ass"`**:
   Loads the multi-tier subtitle script on top of the original video without altering the underlying container file.

### Essential Keyboard Shortcuts for Study:
- `Ctrl + Left` / `Ctrl + Right`: Jump backward or forward **by exact subtitle sentence boundaries**.
- `[` / `]`: Decrease or increase playback speed in 10% steps.
- `Backspace`: Instantly reset speed back to `1.0x`.
- `z` / `Z`: Shift subtitle timing by ±100ms in real time to correct audio sync drift.
- `l`: Set A-B loop points to continuously replay complex speech segments.
- `s`: Capture a screenshot with all rendered multi-language subtitles intact.

---

## 5. Exporting the Movie with Subtitles

Once you are satisfied with the subtitle layout, you may want to export a standalone file—either to load onto an iPad, stream to a smart TV, or share with friends. You have two primary packaging strategies:

### Option A: Soft-Muxing with Matroska (`.mkv`)

If you want to keep subtitle tracks selectable, searchable, and preserve the original video streams without re-encoding, mux the `.ass` file directly into an MKV container:

```bash
ffmpeg -y -i "Revolution_OS_2001.mkv" -i "Revolution_OS_2001.trio.ass" \
  -c copy \
  -disposition:s:0 default \
  -metadata:s:s:0 title="Tri-Lingual Stack (DE/ZH/EN)" \
  "Revolution_OS_2001_softmuxed.mkv"
```

- **`-c copy`**: Copies video, audio, and subtitle streams directly with zero CPU encoding overhead in seconds.
- **`-disposition:s:0 default`**: Sets the multi-tier track as the default active track in modern players like VLC and MPV.

### Option B: Hardcoding (Burning-In) for Universal Compatibility

Most smart TV players, web video players, and budget streaming dongles fail to parse multi-layer ASS styling properly, collapsing all lines into overlapping white text. Hardcoding renders the subtitles directly into the video pixels using FFmpeg's `libass` rasterizer:

```bash
ffmpeg -y -i "Revolution_OS_2001.mkv" \
  -vf "ass=Revolution_OS_2001.trio.ass" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a copy \
  "Revolution_OS_2001_burned_subs.mp4"
```

- **`-vf "ass=..."`**: Invokes the `libass` rasterizer filter to burn the styled ASS layers directly into the video canvas.
- **`-c:v libx264 -crf 18`**: Encodes high-fidelity H.264 video with visually lossless quality.
- **`-c:a copy`**: Leaves the original audio bitstream untouched.

---

## 6. Improving Video and Audio Quality

Archival documentaries and vintage web rips often suffer from low resolution (e.g. 480p/576p DVD transfers), washed-out contrast, interlace combing artifacts, dull colors, and muffled or unbalanced audio.

While you cannot magically create information that was never captured, FFmpeg provides powerful, battle-tested filters to significantly enhance perceptual quality.

### 6.1 Enhancing Video: Denoising, Sharpening, and Color Grading

```bash
ffmpeg -y -i "Revolution_OS_2001.mkv" \
  -vf "hqdn3d=1.5:1.5:6:6,unsharp=5:5:0.8:5:5:0.4,eq=contrast=1.08:brightness=0.01:saturation=1.12,scale=1920:1080:flags=lanczos,ass=Revolution_OS_2001.trio.ass" \
  -c:v libx264 -crf 18 -preset slow \
  -c:a copy \
  "Revolution_OS_2001_enhanced.mp4"
```

#### Breakdown of the Enhancement Filtergraph:
1. **`hqdn3d=1.5:1.5:6:6` (High-Quality 3D Denoising)**:
   Separates static content from temporal motion, smoothing out digital compression noise and sensor grain in dark backgrounds without smearing facial features.
2. **`unsharp=5:5:0.8:5:5:0.4` (Unsharp Masking)**:
   Accentuates high-frequency image details such as facial outlines and text on computer monitors, countering softness introduced by older camera lenses.
3. **`eq=contrast=1.08:brightness=0.01:saturation=1.12`**:
   Re-energizes dull, washed-out early-2000s video transfers by restoring punchy contrast and healthy color depth.
4. **`scale=1920:1080:flags=lanczos`**:
   Upscales SD/720p footage to 1080p using high-order Lanczos interpolation, which prevents the ringing artifacts common to bilinear scaling.
5. **`ass=...`**:
   Renders the multi-language captions on top of the newly filtered, crisp 1080p canvas.

---

### 6.2 Enhancing Audio: Dynamic Range Compression, EQ, and Loudness Normalization

Archival documentaries frequently feature uneven audio: quiet speech from interviewees sitting far from the microphone, followed by loud musical transitions. We can remaster the audio track using FFmpeg's audio filters:

```bash
ffmpeg -y -i "Revolution_OS_2001.mkv" \
  -af "highpass=f=80,lowpass=f=12000,equalizer=f=3000:width_type=q:width=1.5:g=3,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v copy \
  -c:a aac -b:a 192k \
  "Revolution_OS_2001_clean_audio.mkv"
```

#### Breakdown of the Audio Enhancement Chain:
1. **`highpass=f=80`**: Cuts out sub-audible low-frequency room rumble, HVAC hum, and mic-handling thuds below 80 Hz.
2. **`lowpass=f=12000`**: Tames high-frequency hiss and tape noise above 12 kHz.
3. **`equalizer=f=3000:width_type=q:width=1.5:g=3`**: Adds a gentle 3 dB boost at 3 kHz to bring human vocal presence and consonants forward in the mix.
4. **`loudnorm=I=-16:TP=-1.5:LRA=11`**: Delivers broadcast-grade EBU R128 loudness normalization, lifting whisper-quiet lines while preventing harsh clipping peaks.

---

### 6.3 The All-in-One Master Mastering Pipeline

Combining video upscaling, sharpening, color correction, audio remastering, and multi-language ASS subtitle burning into a single production pass:

```bash
ffmpeg -y -i "Revolution_OS_2001.mkv" \
  -vf "hqdn3d=1.2:1.2:4:4,unsharp=5:5:0.7:5:5:0.3,eq=contrast=1.06:saturation=1.1,scale=1920:1080:flags=lanczos,ass=Revolution_OS_2001.trio.ass" \
  -af "highpass=f=80,equalizer=f=3000:width_type=q:width=1.5:g=2.5,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v libx264 -crf 18 -preset medium \
  -c:a aac -b:a 192k \
  "Revolution_OS_2001_remastered_trio.mp4"
```

---

## 7. The Complete Automation Script (`pipeline_revolution_os.sh`)

You can assemble every phase of this guide into a single, automated Bash script:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Input video file (defaults to Revolution_OS_2001.mkv if present)
VIDEO="${1:-Revolution_OS_2001.mkv}"
STEM="${VIDEO%.*}"

echo "=== Stage 1: Verifying Local Video File ==="
if [ ! -f "$VIDEO" ]; then
  echo "Error: Video file '$VIDEO' not found in current directory."
  echo "Ensure your video is placed here before running the pipeline."
  exit 1
fi

echo "=== Stage 2: Fetching Subtitles (English, German, Chinese) ==="
subliminal download -l eng -l deu -l zho "$VIDEO" || true

echo "=== Stage 3: Synthesizing Multi-Language ASS Subtitles ==="
python3 merge_subtitles.py "$VIDEO" -l de zh en

echo "=== Stage 4: Launching Interactive Study Session in mpv ==="
echo "Press 'q' in mpv when done watching to proceed to export."
mpv \
  --fs \
  --speed=0.90 \
  --af=loudnorm \
  --save-position-on-quit \
  --sub-file="${STEM}.trio.ass" \
  "$VIDEO"

echo "=== Stage 5: Exporting Remastered Quality MP4 with Burned-In Subtitles ==="
OUTPUT_MP4="${STEM}_remastered_subtitled.mp4"

ffmpeg -y -i "$VIDEO" \
  -vf "hqdn3d=1.2:1.2:4:4,unsharp=5:5:0.7:5:5:0.3,eq=contrast=1.06:saturation=1.1,ass=${STEM}.trio.ass" \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a aac -b:a 192k \
  "$OUTPUT_MP4"

echo "=== Workflow Complete! ==="
echo "Generated: ${OUTPUT_MP4}"
```

Make the script executable and run it whenever you have a new film release:
```bash
chmod +x pipeline_revolution_os.sh
./pipeline_revolution_os.sh Revolution_OS_2001.mkv
```

---

## Conclusion

The GNU/Linux command line liberates you from the arbitrary constraints of off-the-shelf media players. By uniting `subliminal`, `pysubs2`, `mpv`, and `ffmpeg`, you transform media consumption from passive viewing into an immersive, multi-lingual learning platform.

Whether dissecting the philosophical and licensing debates of *Revolution OS* or exploring world cinema in multiple languages simultaneously, you command every pixel, every subtitle tier, and every audio frequency.

