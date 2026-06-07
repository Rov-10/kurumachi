#pragma once
#include "config.h"

float readBattery() {
  int raw = analogRead(PIN_VBAT);
  return raw / 4095.0f * 3.3f * 2.0f * VBAT_CALIBRATION;
}

int batteryPercent(float v) {
  if (v >= 4.2f) return 100;
  if (v <= 3.3f) return 0;
  return (int)((v - 3.3f) / (4.2f - 3.3f) * 100.0f);
}