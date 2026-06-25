from __future__ import annotations

import math
import os
import random
from dataclasses import dataclass

from PIL import Image, ImageDraw, ImageFilter


OUT = os.path.join("public", "overlays", "rain-alpha-preview.png")
WIDTH = 960
HEIGHT = 540
FRAMES = 144
FPS_MS = 150
SEED = 3270304625


def randomish(seed: float, low: float, high: float) -> float:
    unit = (math.sin(seed * 12.9898) * 43758.5453) % 1
    return low + unit * (high - low)


@dataclass
class Drop:
    x: float
    y: float
    r: float
    sx: float
    sy: float
    speed: float
    alpha: int
    phase: float
    trail: float
    kind: str
    delay: float
    drift: float
    accel: float
    mobility: float


def subject_clearance(x: float, y: float) -> float:
    face = ((x - WIDTH * 0.67) / (WIDTH * 0.17)) ** 2 + ((y - HEIGHT * 0.42) / (HEIGHT * 0.28)) ** 2
    torso = ((x - WIDTH * 0.69) / (WIDTH * 0.27)) ** 2 + ((y - HEIGHT * 0.68) / (HEIGHT * 0.3)) ** 2
    glass = ((x - WIDTH * 0.86) / (WIDTH * 0.13)) ** 2 + ((y - HEIGHT * 0.75) / (HEIGHT * 0.22)) ** 2
    minimum = min(face, torso, glass)
    if minimum < 0.62:
        return 0.18
    if minimum < 1.0:
        return 0.38
    if minimum < 1.45:
        return 0.68
    return 1.0


def attenuate_subject_area(drop: Drop) -> Drop:
    factor = subject_clearance(drop.x, drop.y)
    drop.alpha = int(drop.alpha * factor)
    drop.r *= 0.82 + factor * 0.18
    if factor < 0.5 and drop.kind == "run":
        drop.kind = "bead"
        drop.trail *= 0.25
        drop.speed *= 0.12
        drop.mobility = 0.0
    return drop


def make_drops() -> list[Drop]:
    random.seed(SEED)
    drops: list[Drop] = []

    for _ in range(520):
        drops.append(
            attenuate_subject_area(Drop(
                x=random.uniform(0, WIDTH),
                y=random.uniform(0, HEIGHT),
                r=random.uniform(0.55, 1.45),
                sx=random.uniform(0.8, 1.25),
                sy=random.uniform(0.75, 1.2),
                speed=random.uniform(0.004, 0.018),
                alpha=random.randint(24, 68),
                phase=random.uniform(0, math.tau),
                trail=random.uniform(0, 5),
                kind="mist",
                delay=random.uniform(0, FRAMES),
                drift=random.uniform(0.02, 0.12),
                accel=random.uniform(0.75, 1.18),
                mobility=random.uniform(0.0, 0.12),
            ))
        )

    for _ in range(118):
        drops.append(
            attenuate_subject_area(Drop(
                x=random.uniform(0, WIDTH),
                y=random.uniform(0, HEIGHT),
                r=random.uniform(1.7, 4.8),
                sx=random.uniform(0.72, 1.18),
                sy=random.uniform(0.95, 1.7),
                speed=random.uniform(0.0, 0.045),
                alpha=random.randint(54, 132),
                phase=random.uniform(0, math.tau),
                trail=random.uniform(6, 32),
                kind="bead",
                delay=random.uniform(0, FRAMES),
                drift=random.uniform(0.02, 0.32),
                accel=random.uniform(0.62, 1.42),
                mobility=random.choice([0.0, 0.0, 0.02, 0.06, 0.14]),
            ))
        )

    for _ in range(14):
        drops.append(
            attenuate_subject_area(Drop(
                x=random.uniform(0, WIDTH),
                y=random.uniform(0, HEIGHT),
                r=random.uniform(2.4, 5.6),
                sx=random.uniform(0.65, 0.95),
                sy=random.uniform(1.55, 2.5),
                speed=random.uniform(0.18, 0.52),
                alpha=random.randint(72, 150),
                phase=random.uniform(0, math.tau),
                trail=random.uniform(58, 190),
                kind="run",
                delay=random.uniform(0, FRAMES),
                drift=random.uniform(0.55, 2.4),
                accel=random.uniform(0.75, 1.65),
                mobility=random.uniform(0.72, 1.0),
            ))
        )

    return drops


def draw_drop(layer: Image.Image, drop: Drop, frame_index: int) -> None:
    draw = ImageDraw.Draw(layer, "RGBA")
    t = frame_index / FRAMES
    local_frame = (frame_index + drop.delay) % FRAMES
    local_t = local_frame / FRAMES
    ease = 0.72 + 0.28 * math.sin(drop.phase + local_t * math.tau)
    fall = drop.speed * local_frame * 4.4 * drop.accel * ease * drop.mobility
    y = (drop.y + fall) % (HEIGHT + drop.trail + 36) - drop.trail - 18
    x = drop.x + math.sin(drop.phase + t * math.tau * 0.34) * drop.drift * max(0.25, drop.mobility)
    rx = drop.r * drop.sx
    ry = drop.r * drop.sy

    if drop.kind == "run":
        gx = x + math.sin(drop.phase) * 4
        points = [
            (x, y + ry),
            (gx, y + drop.trail * randomish(drop.phase, 0.28, 0.38)),
            (x - math.cos(drop.phase) * 3, y + drop.trail * randomish(drop.phase + 1.7, 0.64, 0.8)),
            (x + math.sin(drop.phase) * 2, y + drop.trail),
        ]
        for width, alpha in [(3, int(drop.alpha * 0.14)), (1, int(drop.alpha * 0.42))]:
            draw.line(points, fill=(255, 255, 255, alpha), width=width, joint="curve")
        draw.line(points, fill=(42, 48, 45, int(drop.alpha * 0.18)), width=1)

    bbox = (x - rx, y - ry, x + rx, y + ry)
    shadow_bbox = (x - rx * 0.92 + 0.8, y - ry * 0.78 + 0.8, x + rx * 1.04 + 0.8, y + ry * 1.08 + 0.8)

    draw.ellipse(shadow_bbox, fill=(28, 34, 30, int(drop.alpha * 0.13)))
    draw.ellipse(bbox, fill=(255, 255, 255, int(drop.alpha * 0.1)))
    draw.arc(bbox, start=18, end=154, fill=(255, 255, 255, min(210, int(drop.alpha * 1.15))), width=1)
    draw.arc(bbox, start=185, end=326, fill=(26, 32, 28, int(drop.alpha * 0.22)), width=1)

    highlight = (
        x - rx * 0.48,
        y - ry * 0.48,
        x - rx * 0.1,
        y - ry * 0.12,
    )
    draw.ellipse(highlight, fill=(255, 255, 255, min(190, int(drop.alpha * 1.25))))

    if drop.r > 2.2:
        inner = (x + rx * 0.1, y + ry * 0.18, x + rx * 0.58, y + ry * 0.58)
        draw.arc(inner, start=220, end=330, fill=(255, 255, 255, int(drop.alpha * 0.42)), width=1)


def make_frame(drops: list[Drop], frame_index: int) -> Image.Image:
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))

    soft = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    soft_draw = ImageDraw.Draw(soft, "RGBA")
    for drop in drops:
        draw_drop(soft, drop, frame_index)

    blur = soft.filter(ImageFilter.GaussianBlur(0.25))
    layer.alpha_composite(blur)
    return layer


def main() -> None:
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    drops = make_drops()
    frames = [make_frame(drops, i) for i in range(FRAMES)]
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=FPS_MS,
        loop=0,
        disposal=2,
        optimize=True,
    )
    print(OUT)


if __name__ == "__main__":
    main()
