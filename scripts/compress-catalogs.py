"""
Recompress brand catalog PDFs before uploading them to Sanity.

The catalogs arrive as print-resolution files — several are page scans at one
JPEG per page — which makes them far too heavy to serve to a customer on a
phone. This downsamples the embedded images to a screen-appropriate DPI and
re-encodes them, leaving any text layer intact.

Note: saving with `deflate=True` alone does almost nothing to these files.
Their bulk is already-compressed JPEG data, so the images themselves have to
be rewritten. That is what `rewrite_images` does.

Usage:
    python scripts/compress-catalogs.py [--src DIR] [--out DIR]
                                        [--dpi 120] [--threshold 140]
                                        [--quality 75] [--force]
"""

import argparse
import pathlib
import sys

import pymupdf

DEFAULT_SRC = pathlib.Path("Hardware Collection/brands catlogs")
DEFAULT_OUT = pathlib.Path("Hardware Collection/compressed-catalogs")


def mb(n: int) -> float:
    return n / 1_000_000


def compress(
    src: pathlib.Path, dst: pathlib.Path, dpi: int, threshold: int, quality: int
) -> dict:
    before = src.stat().st_size
    doc = pymupdf.open(src)
    pages = doc.page_count
    try:
        doc.rewrite_images(
            dpi_threshold=threshold,
            dpi_target=dpi,
            quality=quality,
        )
        doc.subset_fonts()
        doc.save(dst, garbage=4, deflate=True, clean=True)
    finally:
        doc.close()

    after = dst.stat().st_size

    # An already-optimised file can come out larger. Keep whichever is smaller.
    if after >= before:
        dst.write_bytes(src.read_bytes())
        after = before
        note = "kept original (no gain)"
    else:
        note = ""

    # Confirm the result is readable and no pages were lost.
    check = pymupdf.open(dst)
    out_pages = check.page_count
    check.close()
    if out_pages != pages:
        raise RuntimeError(f"page count changed: {pages} -> {out_pages}")

    return {"before": before, "after": after, "pages": pages, "note": note}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", type=pathlib.Path, default=DEFAULT_SRC)
    ap.add_argument("--out", type=pathlib.Path, default=DEFAULT_OUT)
    ap.add_argument("--dpi", type=int, default=120, help="downsample target DPI")
    ap.add_argument(
        "--threshold",
        type=int,
        default=140,
        help="only touch images above this DPI; must exceed --dpi",
    )
    ap.add_argument("--quality", type=int, default=75)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only", nargs="*", help="filenames to process")
    args = ap.parse_args()

    if args.threshold <= args.dpi:
        print("--threshold must be greater than --dpi", file=sys.stderr)
        return 1
    if not args.src.is_dir():
        print(f"source folder not found: {args.src}", file=sys.stderr)
        return 1
    args.out.mkdir(parents=True, exist_ok=True)

    files = sorted(args.src.glob("*.pdf"))
    if args.only:
        wanted = {n.lower() for n in args.only}
        files = [f for f in files if f.name.lower() in wanted]
    if not files:
        print("no PDFs matched", file=sys.stderr)
        return 1

    print(f"{'file':30}{'before':>9}{'after':>9}{'saved':>8}   note")
    print("-" * 68)
    tot_before = tot_after = 0
    failed = []

    for src in files:
        dst = args.out / src.name
        if dst.exists() and not args.force:
            after = dst.stat().st_size
            before = src.stat().st_size
            tot_before += before
            tot_after += after
            print(f"{src.name:30}{mb(before):8.1f}M{mb(after):8.1f}M{'':>8}   already done")
            continue
        try:
            r = compress(src, dst, args.dpi, args.threshold, args.quality)
        except Exception as exc:  # noqa: BLE001 - report and continue
            failed.append((src.name, str(exc)))
            print(f"{src.name:30}{'':>26}   FAILED: {exc}")
            continue
        tot_before += r["before"]
        tot_after += r["after"]
        pct = 100 * (1 - r["after"] / r["before"]) if r["before"] else 0
        print(
            f"{src.name:30}{mb(r['before']):8.1f}M{mb(r['after']):8.1f}M"
            f"{pct:7.0f}%   {r['note']}"
        )

    print("-" * 68)
    pct = 100 * (1 - tot_after / tot_before) if tot_before else 0
    print(f"{'TOTAL':30}{mb(tot_before):8.1f}M{mb(tot_after):8.1f}M{pct:7.0f}%")
    print(f"\noutput: {args.out}")

    if failed:
        print(f"\n{len(failed)} file(s) failed:", file=sys.stderr)
        for name, err in failed:
            print(f"  {name}: {err}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
