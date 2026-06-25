from __future__ import annotations

import os
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / ".sites-source"

EXCLUDED_DIRS = {
    ".git",
    ".sites-source",
    ".vinext",
    ".wrangler",
    "node_modules",
    "dist",
    "build",
    "work",
}

EXCLUDED_SUFFIXES = {
    ".log",
}

INCLUDED_TOP_LEVEL = {
    ".openai",
    "app",
    "db",
    "drizzle",
    "examples",
    "public",
    "scripts",
    "tests",
    "worker",
}

INCLUDED_FILES = {
    ".gitignore",
    "drizzle.config.ts",
    "eslint.config.mjs",
    "next.config.ts",
    "package-lock.json",
    "package.json",
    "postcss.config.mjs",
    "README.md",
    "tsconfig.json",
    "vite.config.ts",
}


def should_copy(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    first = rel.parts[0]
    if first in EXCLUDED_DIRS:
        return False
    if path.is_file() and path.suffix in EXCLUDED_SUFFIXES:
        return False
    return first in INCLUDED_TOP_LEVEL or str(rel) in INCLUDED_FILES


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()

    for child in ROOT.iterdir():
        if not should_copy(child):
            continue
        target = OUT / child.name
        if child.is_dir():
            ignore_patterns = [
                "__pycache__",
                "*.pyc",
                ".DS_Store",
                "*.log",
            ]
            if child.name == "public":
                ignore_patterns.append("*")
            shutil.copytree(
                child,
                target,
                ignore=shutil.ignore_patterns(*ignore_patterns),
            )
        else:
            shutil.copy2(child, target)

    print(OUT)


if __name__ == "__main__":
    main()
