#!/usr/bin/env python3
"""Generate transparent narrator PNGs with rembg isnet-anime."""

from __future__ import annotations

import argparse
import os
import tempfile
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Remove narrator image backgrounds with rembg.")
    parser.add_argument("--repo-root", required=True, help="Repository root path.")
    parser.add_argument("--model", default="isnet-anime", help="rembg model name.")
    parser.add_argument("--character", help="Only process one narrator folder.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing clear PNGs.")
    return parser.parse_args()


def iter_sources(repo_root: Path, character: str | None, force: bool):
    narrators_root = repo_root / "public" / "assets" / "images" / "narrators"
    folders = [narrators_root / character] if character else sorted(
        path for path in narrators_root.iterdir() if path.is_dir()
    )

    for folder in folders:
        if not folder.is_dir():
            raise FileNotFoundError(f"Missing narrator folder: {folder}")

        stem = folder.name
        for suffix in ("", "_standing"):
            source = folder / f"{stem}{suffix}.webp"
            output = folder / f"{stem}{suffix}_clear.png"
            if not source.exists():
                continue
            if output.exists() and not force:
                yield source, output, "skip-existing"
                continue
            yield source, output, "process"


def ensure_rembg():
    try:
        from PIL import Image
        from rembg import new_session, remove
    except ModuleNotFoundError as error:
        missing = error.name or "rembg"
        raise RuntimeError(f"Missing Python package '{missing}'. Use a rembg virtualenv first.") from error

    return Image, new_session, remove


def write_removed_background(source: Path, output: Path, session, Image, remove) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as input_image:
        input_size = input_image.size
        result_image = remove(input_image.convert("RGBA"), session=session)

    if result_image.mode != "RGBA":
        result_image = result_image.convert("RGBA")

    if result_image.size != input_size:
        raise RuntimeError(
            f"Output size mismatch for {source}: expected {input_size}, got {result_image.size}"
        )

    fd, temp_name = tempfile.mkstemp(prefix=f".{output.stem}-", suffix=".png", dir=output.parent)
    os.close(fd)
    temp_path = Path(temp_name)
    try:
        result_image.save(temp_path, format="PNG", optimize=True)
        temp_path.replace(output)
    finally:
        if temp_path.exists():
            temp_path.unlink()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()

    work = []
    skipped = 0
    for source, output, action in iter_sources(repo_root, args.character, args.force):
        if action == "skip-existing":
            skipped += 1
            continue
        work.append((source, output))

    if not work:
        print("No narrator clear PNGs to generate.")
        if skipped:
            print(f"Skipped existing outputs: {skipped}")
        return 0

    Image, new_session, remove = ensure_rembg()
    print(f"Loading rembg model: {args.model}")
    session = new_session(args.model)

    for index, (source, output) in enumerate(work, start=1):
        print(f"[{index}/{len(work)}] {source.relative_to(repo_root)} -> {output.relative_to(repo_root)}", flush=True)
        write_removed_background(source, output, session, Image, remove)

    print(f"Generated {len(work)} narrator clear PNG(s).")
    if skipped:
        print(f"Skipped existing outputs: {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
