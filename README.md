<div align="center">

<img src="kurumachi.png" width="180" alt="Kurumachi" />

# kurumachi

**A tiny ESP32-C3 companion device — sensors, 44 animations, 3D-printed body, and a browser-based Web Suite.**

[![License: MIT](https://img.shields.io/badge/firmware-MIT-black?style=flat-square)](LICENSE)
[![License: CC BY-NC-SA](https://img.shields.io/badge/hardware-CC%20BY--NC--SA-black?style=flat-square)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![PlatformIO](https://img.shields.io/badge/built%20with-PlatformIO-orange?style=flat-square)](https://platformio.org)
[![Next.js](https://img.shields.io/badge/web-Next.js%2015-black?style=flat-square)](https://nextjs.org)

[Web Suite](#web-suite) · [Hardware](#hardware) · [Firmware](#firmware) · [Animations](#animations) · [Getting Started](#getting-started)

</div>

---

## What is this?

Kurumachi is an open-source ESP32-C3 companion that lives on your desk or dashboard. It reads the environment around it, reacts to tilt and motion via a built-in IMU, and plays one of **44 hand-crafted GIF animations** on a 1.3″ OLED — all packed inside a custom 3D-printed enclosure.

The project ships with a **full browser-based Web Suite** for flashing firmware, browsing CAD models, and converting your own GIFs to the on-device format — no native drivers required.

---

## Hardware

| Component   | Part                 | Notes                       |
| ----------- | -------------------- | --------------------------- |
| MCU         | ESP32-C3 Super Mini  | RISC-V core, Wi-Fi + BLE    |
| Display     | SH1106 1.3″ OLED     | I²C @ 400 kHz, 128×64       |
| IMU         | BMI160               | 6-axis, roll/pitch tracking |
| Environment | AHT20 + BMP280       | Temp, humidity, pressure    |
| Power       | Li-Po 3.7V + TP4057  | ADC battery feedback        |
| Input       | Capacitive touch pad | Scene cycling               |
| Audio       | Passive buzzer       | Tone sequences              |

The enclosure is derived from the **Mochi** housing (MakerWorld) and distributed under **CC BY-NC-SA 4.0**. STL files and the full Blender source are in `firmware/web/public/kurumachi/`.

---

## Firmware

Written in C++ with PlatformIO. Source lives in `firmware/kurumachi/src/`.

```
src/
├── main.cpp          — ISR loop and serial command parser
├── animation.h       — XBM frame decoder and playback engine
├── animations_list.h — Animation registry (44 entries)
├── bmi160.h          — IMU tilt tracking
├── battery.h         — ADC voltage → percentage
├── scenes.h          — Scene state machine
├── display.h         — SH1106 driver wrapper
├── buzzer.h          — Tone sequencer
├── button.h          — Touch input debouncing
├── sleep.h           — Deep sleep management
└── config.h          — Pin map and constants
```

Animations are stored as **inverted XBM C headers** in PROGMEM, converted from GIF source files using `tools/gif2header.py`.

---

## Animations

44 animations across five categories, each a GIF converted to an XBM frame array:

| Category           | Animations                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Actions**        | eat · pingpong · sleepy · sneeze × 2 · speed · water gun × 2 · yawn                                                                 |
| **Emotions**       | angry × 4 · devil · distracted · dizzy · frustrated · happy · love × 2 · proud · relaxed · scared · smile · smirk · surprised · uwu |
| **Eyes**           | look left · look right · peek · squint · wink                                                                                       |
| **Effects**        | rotate · sakura · shrink                                                                                                            |
| **System / Theme** | idle · scx · bee · dragon · nose fire · hello · MD · slayer · cry                                                                   |

To add your own:

```bash
python tools/gif2header.py your_animation.gif
# outputs your_animation.h → place in firmware/kurumachi/assets/animations/
# register it in src/animations_list.h
```

---

## Web Suite

Built with **Next.js 15** + TypeScript. Run locally or deploy to Vercel.

```
web/src/
├── app/
│   ├── page.tsx          — Landing page with 3D model viewer
│   ├── docs/             — Hardware docs (BOM, wiring, print specs)
│   ├── installer/        — Browser-based firmware flasher
│   └── tools/            — RLE encoder utility
└── components/
    ├── ThreeViewer.tsx    — WebGL CAD inspector (Three.js)
    ├── AnimationsShowcase.tsx
    ├── Configurator.tsx
    └── installer/
        ├── FlasherBlock.tsx   — Web Serial flash pipeline
        └── ConfiguratorBlock.tsx
```

### Features

**Web Serial Flasher** — Flash firmware directly from Chrome/Edge over USB. No drivers. No CLI.

**3D Model Inspector** — Browse every printed part in WebGL, inspect assembly, download individual STLs or the full ZIP.

**RLE Encoder** — Drop a PNG/BMP into the browser, get a ready-to-paste C header using the device's compression format: `((run_length - 1) << 1) | pixel_state`.

**Docs** — Interactive BOM, wiring diagram, and print specifications.

---

## Getting Started

### Firmware

```bash
git clone https://github.com/Rov-10/kurumachi
cd kurumachi/firmware/kurumachi
pio run --target upload
```

Requires [PlatformIO Core](https://docs.platformio.org/en/latest/core/installation.html).

### Web Suite

```bash
cd firmware/web
npm install
npm run dev
```

Open `http://localhost:3000`. Chrome or Edge required for Web Serial.

---

## Repository Layout

```
kurumachi/
├── firmware/
│   ├── kurumachi/          — ESP32 firmware (PlatformIO)
│   │   ├── assets/
│   │   │   ├── animations/ — 44 XBM C headers
│   │   │   └── gifs/       — Source GIFs
│   │   └── src/            — Firmware source
│   └── web/                — Next.js Web Suite
├── tools/
│   └── gif2header.py       — GIF → XBM converter
├── kurumachi.png
└── README.md
```

## KURUMACHI. ECOSYSTEM ROADMAP

STAGE 1: CORE INFRASTRUCTURE [COMPLETED]

- Web Deployment Suite architecture implementation (Next.js 15).
- Web Serial API driverless integration for ESP32-C3 USART pipelines.
- WebGL-driven 3D CAD asset inspector using HTML5 Canvas & Three.js.
- Client-side mathematical RLE encoder engine.

STAGE 2: FIRMWARE OPTIMIZATION & CUSTOM ASSETS [IN PROGRESS]

- Hardware debug and stability verification of the RISC-V C++ framework.
- Implementation of dynamic client-to-node animation buffering.
- Development of runtime custom RLE stream loading over Wi-Fi (WebSockets/HTTP Server).
- Tilt/Roll active correction routines based on 6-Axis BMI160 IMU registers.

STAGE 3: THE DIPLOMA EXTENSION (AUTOMOTIVE & MOBILE HARNESS)

- Development of a cross-platform mobile app using Dart & Flutter.
- Automotive integration via Skoda Fabia Mk1 CAN-Bus / K-Line hardware sniffing.
- Bluetooth Low Energy (BLE) secure authentication and telemetry logging.
- Low-power Deep Sleep automation coupled with vehicle ignition state triggers.

---

## License

| Layer                | License                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Firmware & Web Suite | [MIT](LICENSE)                                                                                          |
| Hardware enclosure   | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — derived from Mochi (MakerWorld) |
