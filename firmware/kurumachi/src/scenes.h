#pragma once
#include "config.h"
#include "battery.h"
#include "display.h"
#include "animations_list.h"

// ── Стан анімаційного екрану ──────────────────────────────────────────────────
static Animator gAnimator;

// idle=true → грає sys_idle, idle=false → грає рандомну
static bool animIsIdle = true;

void animSceneInit() {
  animatorInit(gAnimator, &anim_sys_idle);
  animIsIdle = true;
}

// ── Scene 0: Анімації (idle ↔ random) ────────────────────────────────────────
void drawScene0() {
  bool changed = animatorTick(gAnimator);

  // Після завершення повного циклу — перемикаємо idle ↔ random
  if (animatorFinished(gAnimator)) {
    animIsIdle = !animIsIdle;
    if (animIsIdle) {
      animatorInit(gAnimator, &anim_sys_idle);
    } else {
      animatorInit(gAnimator, getRandomAnim());
    }
  }

  if (changed) {
    animatorDraw(gAnimator);
  }
}

// ── Scene 1: Годинник + батарея ───────────────────────────────────────────────
void drawScene1() {
  unsigned long t = millis() / 1000;
  char buf[24];
  float vbat = readBattery();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_logisoso28_tf);
  snprintf(buf, sizeof(buf), "%02d:%02d:%02d",
    (int)(t / 3600), (int)((t % 3600) / 60), (int)(t % 60));
  u8g2.drawStr(4, 40, buf);
  u8g2.setFont(u8g2_font_6x10_tf);
  snprintf(buf, sizeof(buf), "BAT: %.2fV %d%%", vbat, batteryPercent(vbat));
  u8g2.drawStr(0, 58, buf);
  u8g2.sendBuffer();
}

// ── Scene 2: IMU ──────────────────────────────────────────────────────────────
void drawScene2() {
  char buf[32];
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(0, 10, "--- IMU ---");
  snprintf(buf, sizeof(buf), "AX:%5.1f AY:%5.1f", ax, ay);
  u8g2.drawStr(0, 22, buf);
  snprintf(buf, sizeof(buf), "AZ:%5.1f m/s2", az);
  u8g2.drawStr(0, 33, buf);
  snprintf(buf, sizeof(buf), "GX:%5.1f GY:%5.1f", gx, gy);
  u8g2.drawStr(0, 46, buf);
  snprintf(buf, sizeof(buf), "GZ:%5.1f deg/s", gz);
  u8g2.drawStr(0, 57, buf);
  u8g2.sendBuffer();
}

// ── Scene 3: Environment ──────────────────────────────────────────────────────
void drawScene3() {
  char buf[32];
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(0, 10, "--- ENV ---");
  snprintf(buf, sizeof(buf), "Temp: %.1f C", temperature);
  u8g2.drawStr(0, 24, buf);
  snprintf(buf, sizeof(buf), "Hum:  %.1f %%", humidity);
  u8g2.drawStr(0, 38, buf);
  snprintf(buf, sizeof(buf), "Pres: %.1f hPa", pressure);
  u8g2.drawStr(0, 52, buf);
  u8g2.sendBuffer();
}

// ── Scene 4: Tilt ─────────────────────────────────────────────────────────────
void drawScene4() {
  float rawRoll  = -(atan2(ax, az) * 180.0f / PI + 180.0f);
  float rawPitch = -(atan2(ay, az) * 180.0f / PI + 180.0f);

  if (rawRoll  >  180.0f) rawRoll  -= 360.0f;
  if (rawRoll  < -180.0f) rawRoll  += 360.0f;
  if (rawPitch >  180.0f) rawPitch -= 360.0f;
  if (rawPitch < -180.0f) rawPitch += 360.0f;

  float rollDeg  = rawRoll  - rollOffset;
  float pitchDeg = rawPitch - pitchOffset;

  u8g2.clearBuffer();
  u8g2.drawVLine(63, 0, 56);

  drawBitmapRotated(car_front_bmp, 30, 28, 32,  rollDeg);
  drawBitmapRotated(car_side_bmp,  94, 28, 32, pitchDeg);

  u8g2.setFont(u8g2_font_5x7_tf);
  u8g2.drawStr(2,  62, "FRONT");
  u8g2.drawStr(66, 62, "SIDE");

  char buf[10];
  snprintf(buf, sizeof(buf), "%+.0f", rollDeg);
  u8g2.drawStr(20, 8, buf);
  snprintf(buf, sizeof(buf), "%+.0f", pitchDeg);
  u8g2.drawStr(84, 8, buf);

  if (rollOffset != 0.0f || pitchOffset != 0.0f)
    u8g2.drawStr(58, 8, "*");

  u8g2.sendBuffer();
}

// ── Статус при старті ─────────────────────────────────────────────────────────
void drawStatusScreen() {
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(0, 10, "Sensor init...");
  u8g2.drawStr(0, 24, bmiOk ? "BMI160 [OK]" : "BMI160 [--]");
  u8g2.drawStr(0, 36, ahtOk ? "AHT20  [OK]" : "AHT20  [--]");
  u8g2.drawStr(0, 48, bmpOk ? "BMP280 [OK]" : "BMP280 [--]");
  u8g2.sendBuffer();
}