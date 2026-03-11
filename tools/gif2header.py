#!/usr/bin/env python3
"""
gif2header.py — пакетна конвертація GIF у C header з вибором папок.

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

def frame_to_xbm_bytes(img_gray, threshold, invert, w, h):
    bytes_per_row = (w + 7) // 8
    result = []
    for y in range(h):
        for bx in range(bytes_per_row):
            byte = 0
            for bit in range(8):
                px = bx * 8 + bit
                if px >= w: break
                pixel = img_gray.getpixel((px, y))
                is_dark = pixel < threshold
                if invert: is_dark = not is_dark
                if is_dark: byte |= (1 << bit)
            result.append(byte)
    return result

def gif_to_header(input_path, output_path, var_name, threshold, invert, scale_mode, target_w, target_h):
    img = Image.open(input_path)
    frames, delays = [], []
    try:
        while True:
            delays.append(int(img.info.get("duration", 100)))
            frame = img.convert("RGBA")
            bg = Image.new("RGBA", frame.size, (255, 255, 255, 255))
            bg.paste(frame, mask=frame.split()[3])
            gray = bg.convert("L")
            scaled = scale_frame(gray, target_w, target_h, scale_mode)
            frames.append(frame_to_xbm_bytes(scaled, threshold, invert, target_w, target_h))
            img.seek(img.tell() + 1)
    except EOFError: pass

    frame_count = len(frames)
    lines = [
        f"// Джерело: {os.path.basename(input_path)}",
        "#pragma once", "#include <pgmspace.h>", "",
        f"#define {var_name.upper()}_FRAME_COUNT {frame_count}",
        f"#define {var_name.upper()}_WIDTH       {target_w}",
        f"#define {var_name.upper()}_HEIGHT      {target_h}", ""
    ]

    delay_vals = ", ".join(str(d) for d in delays)
    lines.append(f"const uint16_t {var_name}_delays[{frame_count}] PROGMEM = {{{delay_vals}}};")
    
    for i, frame in enumerate(frames):
        hex_vals = [f"0x{b:02X}" for b in frame]
        rows = ["  " + ", ".join(hex_vals[k:k+16]) for k in range(0, len(hex_vals), 16)]
        lines.append(f"const unsigned char {var_name}_frame{i:03d}[] PROGMEM = {{\n" + ",\n".join(rows) + "\n};")

    ptr_list = [f"{var_name}_frame{i:03d}" for i in range(frame_count)]
    lines.append(f"\nconst unsigned char* const {var_name}_frames[{frame_count}] PROGMEM = {{")
    for k in range(0, len(ptr_list), 4):
        lines.append("  " + ", ".join(ptr_list[k:k+4]) + ("," if k + 4 < frame_count else ""))
    lines.append("};")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def main():
    parser = argparse.ArgumentParser(description="Пакетний GIF → C header")
    parser.add_argument("src", help="Шлях до папки з вихідними GIF")
    parser.add_argument("dest", help="Шлях до папки для збереження .h файлів")
    parser.add_argument("--threshold", type=int, default=128)
    parser.add_argument("--invert", action="store_true")
    parser.add_argument("--scale", default="fit")
    parser.add_argument("--width", type=int, default=128)
    parser.add_argument("--height", type=int, default=64)
    args = parser.parse_args()

    # Перевіряємо чи існує джерело
    if not os.path.exists(args.src):
        print(f"Помилка: Папка з джерелом не знайдена: {args.src}")
        return

    # Створюємо папку призначення, якщо її немає
    if not os.path.exists(args.dest):
        os.makedirs(args.dest)
        print(f"Створено папку призначення: {args.dest}")

    # Шукаємо всі GIF у вказаній папці джерела
    files_to_process = glob.glob(os.path.join(args.src, "*.gif"))

    if not files_to_process:
        print(f"У папці {args.src} не знайдено файлів .gif")
        return

    print(f"Знайдено файлів: {len(files_to_process)}")
    print("-" * 30)

    for input_path in files_to_process:
        base_filename = os.path.basename(input_path)
        name_without_ext = os.path.splitext(base_filename)[0]
        
        # Генеруємо назву змінної та шлях виходу
        var_name = name_without_ext.replace("-", "_").replace(" ", "_").lower()
        output_path = os.path.join(args.dest, name_without_ext + ".h")

        print(f"Обробка: {base_filename}...")
        try:
            gif_to_header(
                input_path, output_path, var_name, 
                args.threshold, args.invert, args.scale, 
                args.width, args.height
            )
            print(f"  [OK] -> {output_path}")
        except Exception as e:
            print(f"  [Error] Не вдалося обробити {base_filename}: {e}")

    print("-" * 30)
    print("Конвертація завершена!")

if __name__ == "__main__":
    main()