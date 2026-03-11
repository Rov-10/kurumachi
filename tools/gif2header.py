#!/usr/bin/env python3
"""
gif2header.py — конвертер GIF в C header для U8g2 OLED (128x64 монохром)

Використання:
  python gif2header.py input.gif
  python gif2header.py input.gif --output anim.h --name my_anim
  python gif2header.py input.gif --threshold 100 --invert
  python gif2header.py input.gif --scale stretch
  python gif2header.py input.gif --width 64 --height 32

Опції:
  --output      Вихідний файл (за замовчуванням: назва_gif.h)
  --name        Назва змінної в C (за замовчуванням: назва файлу)
  --threshold   Поріг бінаризації 0-255 (за замовчуванням: 128)
  --invert      Інвертувати чорне/біле
  --scale       Режим масштабування: fit (за замовчуванням), stretch, fit_width, fit_height
  --width       Ширина виводу (за замовчуванням: 128)
  --height      Висота виводу (за замовчуванням: 64)
"""

import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Встанови Pillow: pip install Pillow")
    sys.exit(1)


def scale_frame(img, target_w, target_h, mode):
    """Масштабувати кадр до цільового розміру."""
    src_w, src_h = img.size

    if mode == "stretch":
        return img.resize((target_w, target_h), Image.LANCZOS)

    elif mode == "fit":
        ratio = min(target_w / src_w, target_h / src_h)
        new_w = int(src_w * ratio)
        new_h = int(src_h * ratio)
        resized = img.resize((new_w, new_h), Image.LANCZOS)
        result = Image.new("L", (target_w, target_h), 255)
        offset_x = (target_w - new_w) // 2
        offset_y = (target_h - new_h) // 2
        result.paste(resized, (offset_x, offset_y))
        return result

    elif mode == "fit_width":
        ratio = target_w / src_w
        new_h = int(src_h * ratio)
        resized = img.resize((target_w, new_h), Image.LANCZOS)
        result = Image.new("L", (target_w, target_h), 255)
        offset_y = (target_h - new_h) // 2
        result.paste(resized, (0, offset_y))
        return result

    elif mode == "fit_height":
        ratio = target_h / src_h
        new_w = int(src_w * ratio)
        resized = img.resize((new_w, target_h), Image.LANCZOS)
        result = Image.new("L", (target_w, target_h), 255)
        offset_x = (target_w - new_w) // 2
        result.paste(resized, (offset_x, 0))
        return result

    return img.resize((target_w, target_h), Image.LANCZOS)


def frame_to_xbm_bytes(img_gray, threshold, invert, w, h):
    """Конвертувати сірий кадр в XBM байти (LSB first)."""
    bytes_per_row = (w + 7) // 8
    result = []

    for y in range(h):
        for bx in range(bytes_per_row):
            byte = 0
            for bit in range(8):
                px = bx * 8 + bit
                if px >= w:
                    break
                pixel = img_gray.getpixel((px, y))
                is_dark = pixel < threshold
                if invert:
                    is_dark = not is_dark
                if is_dark:
                    byte |= (1 << bit)
            result.append(byte)

    return result


def gif_to_header(input_path, output_path, var_name, threshold, invert, scale_mode, target_w, target_h):
    """Основна функція конвертації."""
    img = Image.open(input_path)

    frames = []
    delays = []

    try:
        while True:
            # Затримка кадру в мс
            delay_cs = img.info.get("duration", 100)  # мс
            delays.append(int(delay_cs))

            # Конвертуємо в RGBA щоб обробити прозорість
            frame = img.convert("RGBA")

            # Білий фон під прозорі пікселі
            bg = Image.new("RGBA", frame.size, (255, 255, 255, 255))
            bg.paste(frame, mask=frame.split()[3])
            gray = bg.convert("L")

            # Масштабуємо
            scaled = scale_frame(gray, target_w, target_h, scale_mode)

            # В байти XBM
            xbm_bytes = frame_to_xbm_bytes(scaled, threshold, invert, target_w, target_h)
            frames.append(xbm_bytes)

            img.seek(img.tell() + 1)
    except EOFError:
        pass

    frame_count = len(frames)
    bytes_per_frame = ((target_w + 7) // 8) * target_h

    print(f"  Кадрів: {frame_count}")
    print(f"  Розмір: {target_w}x{target_h}")
    print(f"  Байт/кадр: {bytes_per_frame}")
    print(f"  Всього байт: {bytes_per_frame * frame_count}")
    print(f"  Затримки (мс): {delays[:5]}{'...' if frame_count > 5 else ''}")

    # Генеруємо .h файл
    lines = []
    lines.append(f"// Автоматично згенеровано gif2header.py")
    lines.append(f"// Джерело: {os.path.basename(input_path)}")
    lines.append(f"// Розмір: {target_w}x{target_h}, {frame_count} кадрів")
    lines.append(f"")
    lines.append(f"#pragma once")
    lines.append(f"#include <pgmspace.h>")
    lines.append(f"")
    lines.append(f"#define {var_name.upper()}_FRAME_COUNT {frame_count}")
    lines.append(f"#define {var_name.upper()}_WIDTH       {target_w}")
    lines.append(f"#define {var_name.upper()}_HEIGHT      {target_h}")
    lines.append(f"")

    # Масив затримок
    delay_vals = ", ".join(str(d) for d in delays)
    lines.append(f"const uint16_t {var_name}_delays[{frame_count}] PROGMEM = {{{delay_vals}}};")
    lines.append(f"")

    # Кожен кадр окремим масивом
    for i, frame in enumerate(frames):
        hex_vals = []
        for j, b in enumerate(frame):
            hex_vals.append(f"0x{b:02X}")

        # Групуємо по 16 байт на рядок
        rows = []
        for k in range(0, len(hex_vals), 16):
            rows.append("  " + ", ".join(hex_vals[k:k+16]))

        lines.append(f"const unsigned char {var_name}_frame{i:03d}[] PROGMEM = {{")
        lines.append(",\n".join(rows))
        lines.append(f"}};")
        lines.append(f"")

    # Масив вказівників на кадри
    frame_ptrs = ", ".join(f"{var_name}_frame{i:03d}" for i in range(frame_count))
    lines.append(f"const unsigned char* const {var_name}_frames[{frame_count}] PROGMEM = {{")
    # Групуємо по 4
    ptr_list = [f"{var_name}_frame{i:03d}" for i in range(frame_count)]
    for k in range(0, len(ptr_list), 4):
        lines.append("  " + ", ".join(ptr_list[k:k+4]) + ("," if k + 4 < frame_count else ""))
    lines.append(f"}};")

    content = "\n".join(lines)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  Збережено: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="GIF → C header для U8g2 OLED")
    parser.add_argument("input", nargs="+", help="Вхідний GIF файл(и)")
    parser.add_argument("-o", "--output", help="Вихідний .h файл")
    parser.add_argument("--name", help="Назва змінної в C")
    parser.add_argument("--threshold", type=int, default=128, help="Поріг бінаризації (0-255)")
    parser.add_argument("--invert", action="store_true", help="Інвертувати кольори")
    parser.add_argument("--scale", default="fit",
                        choices=["fit", "stretch", "fit_width", "fit_height"],
                        help="Режим масштабування")
    parser.add_argument("--width", type=int, default=128, help="Ширина виводу")
    parser.add_argument("--height", type=int, default=64, help="Висота виводу")
    args = parser.parse_args()

    for input_path in args.input:
        if not os.path.exists(input_path):
            print(f"Файл не знайдено: {input_path}")
            continue

        base = os.path.splitext(os.path.basename(input_path))[0]
        # Безпечна назва для C
        var_name = args.name if args.name else base.replace("-", "_").replace(" ", "_").lower()
        output_path = args.output if args.output else os.path.splitext(input_path)[0] + ".h"

        print(f"\nКонвертую: {input_path}")
        gif_to_header(
            input_path=input_path,
            output_path=output_path,
            var_name=var_name,
            threshold=args.threshold,
            invert=args.invert,
            scale_mode=args.scale,
            target_w=args.width,
            target_h=args.height,
        )

    print("\nГотово!")


if __name__ == "__main__":
    main()
