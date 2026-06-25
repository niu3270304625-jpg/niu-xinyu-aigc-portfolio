from __future__ import annotations

import os
import subprocess
from pathlib import Path

import imageio_ffmpeg


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "videos"
OUT = ROOT / "public" / "videos-publish"

VIDEOS = {
    "spirit-pet-trailer.mov": "spirit-pet-trailer.mp4",
    "virtual-flowering.mp4": "virtual-flowering.mp4",
    "after-school-crow.mp4": "after-school-crow.mp4",
    "human-world-episode-01.mp4": "human-world-episode-01.mp4",
    "costume-trailer.mov": "costume-trailer.mp4",
    "qingqiu.mov": "qingqiu.mp4",
    "loch-ness-landscape.mp4": "loch-ness-landscape.mp4",
    "loch-ness-monster.mp4": "loch-ness-monster.mp4",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    for src_name, out_name in VIDEOS.items():
        src = SRC / src_name
        out = OUT / out_name
        if not src.exists():
            print(f"missing {src}")
            continue

        command = [
            ffmpeg,
            "-y",
            "-i",
            str(src),
            "-t",
            "45",
            "-vf",
            "scale='min(960,iw)':-2",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "35",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            str(out),
        ]
        print(f"compress {src.name} -> {out.name}")
        subprocess.run(command, check=True)


if __name__ == "__main__":
    main()
