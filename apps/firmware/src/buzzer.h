#pragma once
#include "config.h"

void beep(uint16_t freq, uint16_t ms) {
  tone(PIN_BUZZER, freq, ms);
  delay(ms + 10);
}

void startupBeep() {
  tone(PIN_BUZZER, 392, 80);  delay(90);
  tone(PIN_BUZZER, 370, 80);  delay(90);
  tone(PIN_BUZZER, 494, 120); delay(130);
}