#pragma once
#include "config.h"
#include "buzzer.h"

void handleButton() {
  unsigned long now     = millis();
  bool          pressed = digitalRead(PIN_TOUCH) == HIGH;

  if (pressed && !wasPressed) {
    pressStartTime = now;
    holdFired      = false;
    wasPressed     = true;
  }

  if (pressed && wasPressed && !holdFired) {
    if (now - pressStartTime >= HOLD_MS) {
      holdFired = true;
      // зарезервовано
    }
  }

  if (!pressed && wasPressed) {
    wasPressed = false;
    unsigned long dur = now - pressStartTime;
    if (!holdFired && dur < HOLD_MS) {
      tapCount++;
      lastTapTime = now;
    }
  }

  if (tapCount > 0 && (now - lastTapTime) > DOUBLE_TAP_MS) {
    if (tapCount == 1) {
      currentScene   = (currentScene + 1) % 4;
      lastMotionTime = now;
      beep(1200, 40);
    } else if (tapCount >= 2) {
      if (currentScene == 3) {
        if (rollOffset != 0.0f || pitchOffset != 0.0f) {
          rollOffset  = 0.0f;
          pitchOffset = 0.0f;
          beep(400, 50); delay(60); beep(400, 50);
          Serial.println("Zero reset");
        } else {
          float rawRoll  = -(atan2(ax, az) * 180.0f / PI + 180.0f);
          float rawPitch = -(atan2(ay, az) * 180.0f / PI + 180.0f);
          if (rawRoll  >  180.0f) rawRoll  -= 360.0f;
          if (rawRoll  < -180.0f) rawRoll  += 360.0f;
          if (rawPitch >  180.0f) rawPitch -= 360.0f;
          if (rawPitch < -180.0f) rawPitch += 360.0f;
          rollOffset  = rawRoll;
          pitchOffset = rawPitch;
          beep(1000, 50); delay(60); beep(1400, 80);
          Serial.println("Zero set");
        }
      }
      lastMotionTime = now;
    }
    tapCount = 0;
  }
}