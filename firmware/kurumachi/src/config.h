#pragma once

#include <Wire.h>
#include <math.h>
#include <U8g2lib.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP280.h>
#include "esp_sleep.h"

// ── Піни ─────────────────────────────────────────────────────────────────────
#define PIN_TOUCH   4
#define PIN_BUZZER  1
#define PIN_SDA     8
#define PIN_SCL     9
#define PIN_VBAT    3

// ── Адреси ───────────────────────────────────────────────────────────────────
#define BMI160_ADDR 0x68

// ── Налаштування ─────────────────────────────────────────────────────────────
#define MOTION_THRESHOLD  800
#define SLEEP_TIMEOUT_MS  (2UL * 60 * 1000)
#define SLEEP_CHECK_US    (500UL * 1000)
#define VBAT_CALIBRATION  0.917f
#define DOUBLE_TAP_MS     400
#define HOLD_MS           1000

// ── Глобальні об'єкти ────────────────────────────────────────────────────────
extern U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2;
extern Adafruit_AHTX0  aht;
extern Adafruit_BMP280 bmp;

// ── Стан пристрою ────────────────────────────────────────────────────────────
extern uint8_t currentScene;
extern bool    bmiOk, ahtOk, bmpOk;
extern bool    sleeping;

extern float ax, ay, az, gx, gy, gz;
extern float temperature, humidity, pressure;

extern unsigned long lastSensorRead, lastMotionTime;
extern int16_t prev_ax, prev_ay, prev_az;

extern float rollOffset, pitchOffset;

// ── Стан кнопки ──────────────────────────────────────────────────────────────
extern unsigned long lastTapTime;
extern unsigned long pressStartTime;
extern uint8_t       tapCount;
extern bool          wasPressed;
extern bool          holdFired;