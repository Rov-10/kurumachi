#pragma once
#include "config.h"
#include "buzzer.h"

// Кількість сцен — тепер 5 (0=Anim, 1=Clock, 2=IMU, 3=ENV, 4=Tilt)
#define SCENE_COUNT 5

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
      uint8_t prev = currentScene;
      currentScene = (currentScene + 1) % SCENE_COUNT;
      lastMotionTime = now;
      beep(1200, 40);

      // При поверненні на анімаційний екран — перезапускаємо з sys_idle
      if (currentScene == 0 && prev != 0) {
        animSceneInit();
      }

    } else if (tapCount >= 2) {
      // Подвійний тап на Tilt (scene 4) — калібрування
      if (currentScene == 4) {
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