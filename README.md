# 🤖 Kurumachi

A tiny ESP32-C3 powered car dashboard companion with sensors, animations, and a 3D printed body.

<p align="center">
  <img src="kurumachi.png" alt="Kurumachi" width="250" height="250" />
</p>

---

## Features

- 🌡️ Temperature, humidity & pressure (AHT20 + BMP280)
- 📐 6-axis IMU with car tilt indicator (BMI160)
- 🔋 Battery voltage & percentage display
- 🎞️ GIF animation playback on OLED
- 💤 Motion-triggered wake from light sleep
- 🔊 Startup beep (S.T.A.L.K.E.R. PDA style)
- 🖨️ Fully 3D printed enclosure (CAD files included)

---

## Hardware

| Component | Details |
|-----------|---------|
| MCU | ESP32-C3 Super Mini |
| Display | 1.3" OLED 128×64 SH1106 (I2C) |
| IMU | BMI160 6-axis (I2C) |
| Environment | AHT20 + BMP280 combo module (I2C) |
| Touch button | TTP223 capacitive |
| Charging | TP4057 Li-ion (Type-C) |
| Battery | 700mAh 3.7V LiPo |
| Buzzer | Passive |

### Pin Assignment

| Signal | GPIO |
|--------|------|
| SDA | 8 |
| SCL | 9 |
| TTP223 OUT | 4 |
| Buzzer | 1 |
| VBAT ADC | 3 |

### I2C Device Map

| Address | Device |
|---------|--------|
| 0x38 | AHT20 |
| 0x3C | OLED |
| 0x68 | BMI160 |
| 0x77 | BMP280 |

---

## Screens

| # | Screen | Description |
|---|--------|-------------|
| 0 | Animation | GIF animation playback |
| 1 | Clock | Uptime HH:MM:SS + battery |
| 2 | IMU | Accel (m/s²) + Gyro (deg/s) |
| 3 | Environment | Temp / Humidity / Pressure |
| 4 | Tilt | Car roll & pitch indicator |

**Button gestures:**
- Single tap — next screen
- Double tap (on tilt screen) — set/reset zero calibration
- Hold — reserved

---

## Project Structure

```
kurumachi/
├── firmware/
│   └── kurumachi/
│       ├── kurumachi.ino
│       ├── config.h
│       ├── bmi160.h
│       ├── battery.h
│       ├── buzzer.h
│       ├── sleep.h
│       ├── button.h
│       ├── bitmaps.h
│       ├── display.h
│       ├── animation.h
│       ├── scenes.h
│       └── anim/           ← generated .h files from GIFs
├── cad/                    ← 3D printable enclosure files
├── tools/
│   └── gif2header.py       ← GIF → C header converter
└── README.md
```

---

## Building the Firmware

### Requirements

- [PlatformIO](https://platformio.org/) (recommended) or Arduino IDE 2.x
- ESP32 Arduino core

### Libraries

```
olikraus/U8g2
adafruit/Adafruit AHTX0
adafruit/Adafruit BMP280 Library
```

### platformio.ini

```ini
[env:esp32-c3-devkitm-1]
platform = espressif32
board = esp32-c3-devkitm-1
framework = arduino
monitor_speed = 115200

lib_deps =
  olikraus/U8g2
  adafruit/Adafruit AHTX0
  adafruit/Adafruit BMP280 Library
```

### Flash

```bash
pio run --target upload
pio device monitor --baud 115200
```

> **Arch Linux:** Add yourself to the `uucp` group first:
> ```bash
> sudo usermod -aG uucp $USER
> ```

---

## GIF Converter

Convert any GIF to a C header for the OLED:

```bash
pip install Pillow
python tools/gif2header.py input.gif --name my_anim
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `--name` | filename | C variable name |
| `--threshold` | 128 | Binarization threshold (0–255) |
| `--invert` | off | Invert black/white |
| `--scale` | fit | `fit` / `stretch` / `fit_width` / `fit_height` |
| `--width` | 128 | Output width in pixels |
| `--height` | 64 | Output height in pixels |

Then include the generated `.h` in your firmware and pass it to `animatorInit()`.

---

## 3D Printing

CAD files are in the `/cad` folder.

- Printed in PLA
- No supports needed
- All parts snap/screw together

---

## Power

| Mode | Current |
|------|---------|
| Active (all on) | ~106 mA |
| Light sleep | ~0.85 mA |
| Estimated runtime (5 min active/hr) | ~3 days |

---

## License

MIT — do whatever you want, just keep the credits.

---

*Kurumachi says hi* 🤖
