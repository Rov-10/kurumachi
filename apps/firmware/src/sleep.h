#pragma once
#include "config.h"
#include "buzzer.h"

bool checkMotion() {
  int16_t cx, cy, cz;
  bmi160ReadRawAccel(cx, cy, cz);
  int16_t dx = abs(cx - prev_ax);
  int16_t dy = abs(cy - prev_ay);
  int16_t dz = abs(cz - prev_az);
  prev_ax = cx; prev_ay = cy; prev_az = cz;
  return (dx > MOTION_THRESHOLD || dy > MOTION_THRESHOLD || dz > MOTION_THRESHOLD);
}

void enterSleepMode() {
  sleeping = true;
  Serial.println("Sleeping...");
  u8g2.setPowerSave(1);
  beep(300, 80);
}

void sleepTick() {
  esp_sleep_enable_timer_wakeup(SLEEP_CHECK_US);
  esp_light_sleep_start();
}

void wakeUp() {
  sleeping      = false;
  lastMotionTime = millis();
  lastTapTime    = millis();
  tapCount       = 0;
  wasPressed     = false;
  holdFired      = false;
  delay(100);
  u8g2.setPowerSave(0);
  beep(600, 80);
  Serial.println("Awake!");
}