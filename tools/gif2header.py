#!/usr/bin/env python3
"""
gif2header.py — пакетна конвертація GIF у C header з RLE стисненням.

Формат RLE: кожен байт = ((count-1) << 1) | pixel
  - pixel: 0=чорний, 1=білий
  - count: 1..128 однакових пікселів підряд
Пікселі йдуть зліва направо, зверху вниз.

Використання:
  python gif2header.py <папка_з_гіфками> <папка_для_хедерів> [опції]

Приклад:
  python gif2header.py ./input_gifs ./output_headers --invert --width 128 --height 64
"""

import argparse
import os
import sys
import glob

try:
    from PIL import Image
except ImportError:
    print("Встанови Pillow: pip install Pillow")
    sys.exit(1)


def scale_frame(img, target_w, target_h, mode):
    src_w, src_h = img.size
    if mode == "stretch":
        return img.resize((target_w, target_h), Image.LANCZOS)
    elif mode == "fit":
        ratio = min(target_w / src_w, target_h / src_h)
        new_w, new_h = int(src_w * ratio), int(src_h * ratio)
        resized = img.resize((new_w, new_h), Image.LANCZOS)
        result = Image.new("L", (target_w, target_h), 255)
        result.paste(resized, ((target_w - new_w) // 2, (target_h - new_h) // 2))
        return result
    return img.resize((target_w, target_h), Image.LANCZOS)


def frame_to_pixels(img_gray, threshold, invert, w, h):
    """Повертає список пікселів 0/1 (1=білий), зліва направо, зверху вниз."""
    pixels = []
    for y in range(h):
        for x in range(w):
            p = img_gray.getpixel((x, y))
            is_white = p >= threshold
            if invert:
                is_white = not is_white
            pixels.append(1 if is_white else 0)
    return pixels


def rle_encode(pixels):
    """
    RLE кодування: кожен байт = ((count-1) << 1) | pixel
    count від 1 до 128.
    """
    if not pixels:
        return []
    result = []
    current = pixels[0]
    count = 1
    for p in pixels[1:]:
        if p == current and count < 128:
            count += 1
        else:
            result.append(((count - 1) << 1) | current)
            current = p
            count = 1
    result.append(((count - 1) << 1) | current)
    return result


def gif_to_header(input_path, output_path, var_name, threshold, invert, scale_mode, target_w, target_h):
    img = Image.open(input_path)
    frames_rle = []
    delays = []

    try:
        while True:
            delays.append(int(img.info.get("duration", 100)))
            frame = img.convert("RGBA")
            bg = Image.new("RGBA", frame.size, (255, 255, 255, 255))
            bg.paste(frame, mask=frame.split()[3])
            gray = bg.convert("L")
            scaled = scale_frame(gray, target_w, target_h, scale_mode)
            pixels = frame_to_pixels(scaled, threshold, invert, target_w, target_h)
            rle = rle_encode(pixels)
            frames_rle.append(rle)
            img.seek(img.tell() + 1)
    except EOFError:
        pass

    frame_count = len(frames_rle)
    raw_size = frame_count * target_w * target_h // 8
    rle_size = sum(len(f) for f in frames_rle)
    ratio = raw_size / rle_size if rle_size else 0
    print(f"    XBM: {raw_size} B → RLE: {rle_size} B (x{ratio:.1f})")

    lines = [
        f"// Source: {os.path.basename(input_path)}",
        "#pragma once",
        "#include <pgmspace.h>",
        "",
        f"#define {var_name.upper()}_FRAME_COUNT {frame_count}",
        f"#define {var_name.upper()}_WIDTH        {target_w}",
        f"#define {var_name.upper()}_HEIGHT       {target_h}",
        "",
    ]

    # Масив затримок
    delay_vals = ", ".join(str(d) for d in delays)
    lines.append(f"const uint16_t {var_name}_delays[{frame_count}] PROGMEM = {{{delay_vals}}};")
    lines.append("")

    # Масиви RLE даних для кожного фрейму
    for i, rle in enumerate(frames_rle):
        hex_vals = [f"0x{b:02X}" for b in rle]
        rows = ["  " + ", ".join(hex_vals[k:k+16]) for k in range(0, len(hex_vals), 16)]
        size = len(rle)
        lines.append(f"const uint8_t {var_name}_frame{i:03d}[{size}] PROGMEM = {{")
        lines.append(",\n".join(rows))
        lines.append("};")

    lines.append("")

    # Масив розмірів фреймів (потрібен для декодера)
    size_vals = ", ".join(str(len(f)) for f in frames_rle)
    lines.append(f"const uint16_t {var_name}_sizes[{frame_count}] PROGMEM = {{{size_vals}}};")
    lines.append("")

    # Масив вказівників на фрейми
    ptr_list = [f"{var_name}_frame{i:03d}" for i in range(frame_count)]
    lines.append(f"const uint8_t* const {var_name}_frames[{frame_count}] PROGMEM = {{")
    for k in range(0, len(ptr_list), 4):
        chunk = ptr_list[k:k+4]
        comma = "," if k + 4 < frame_count else ""
        lines.append("  " + ", ".join(chunk) + comma)
    lines.append("};")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    parser = argparse.ArgumentParser(description="Пакетний GIF -> C header з RLE стисненням")
    parser.add_argument("src",  help="Папка з вихідними GIF")
    parser.add_argument("dest", help="Папка для збереження .h файлів")
    parser.add_argument("--threshold", type=int, default=128)
    parser.add_argument("--invert",    action="store_true")
    parser.add_argument("--scale",     default="fit")
    parser.add_argument("--width",     type=int, default=128)
    parser.add_argument("--height",    type=int, default=64)
    args = parser.parse_args()

    if not os.path.exists(args.src):
        print(f"Помилка: папка не знайдена: {args.src}")
        return

    os.makedirs(args.dest, exist_ok=True)

    files = sorted(glob.glob(os.path.join(args.src, "*.gif")))
    if not files:
        print(f"У папці {args.src} не знайдено .gif файлів")
        return

    print(f"Знайдено файлів: {len(files)}")
    print("-" * 50)

    total_raw = 0
    total_rle = 0

    for input_path in files:
        base = os.path.basename(input_path)
        name = os.path.splitext(base)[0]
        var_name = name.replace("-", "_").replace(" ", "_").lower()
        output_path = os.path.join(args.dest, name + ".h")
        print(f"Обробка: {base}")
        try:
            gif_to_header(input_path, output_path, var_name,
                          args.threshold, args.invert, args.scale,
                          args.width, args.height)
            print(f"  [OK] -> {output_path}")
        except Exception as e:
            print(f"  [Error] {base}: {e}")

    print("-" * 50)
    print("Конвертація завершена!")


if __name__ == "__main__":
    main()