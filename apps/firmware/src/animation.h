#pragma once
#include "config.h"

// AnimDef — опис однієї анімації (RLE формат)
struct AnimDef {
  const uint8_t*  const* frames;      // масив вказівників на RLE дані фреймів
  const uint16_t*        sizes;       // розміри RLE даних кожного фрейму
  const uint16_t*        delays;      // затримки в мс
  uint16_t               frameCount;
  uint16_t               width;
  uint16_t               height;
};

// Animator — стан програвання
struct Animator {
  const AnimDef* anim;
  uint16_t       currentFrame;
  unsigned long  nextFrameTime;
};

void animatorInit(Animator& a, const AnimDef* def) {
  a.anim          = def;
  a.currentFrame  = 0;
  a.nextFrameTime = millis();
}

// Повертає true якщо треба перемалювати
bool animatorTick(Animator& a) {
  if (!a.anim) return false;
  unsigned long now = millis();
  if (now < a.nextFrameTime) return false;
  uint16_t delay = pgm_read_word(&a.anim->delays[a.currentFrame]);
  a.nextFrameTime = now + delay;
  a.currentFrame  = (a.currentFrame + 1) % a.anim->frameCount;
  return true;
}

// Повертає true якщо щойно завершився повний цикл
bool animatorFinished(const Animator& a) {
  return a.currentFrame == 0;
}

// Декодує RLE фрейм і малює на дисплей
// Формат байту: ((count-1) << 1) | pixel
//   pixel: 0=чорний, 1=білий
void animatorDraw(const Animator& a) {
  if (!a.anim) return;

  const uint8_t* rle_data = (const uint8_t*)pgm_read_ptr(&a.anim->frames[a.currentFrame]);
  uint16_t       rle_size = pgm_read_word(&a.anim->sizes[a.currentFrame]);
  uint16_t       w        = a.anim->width;
  uint16_t       h        = a.anim->height;

  u8g2.clearBuffer();

  int x = 0, y = 0;
  for (uint16_t i = 0; i < rle_size; i++) {
    uint8_t byte  = pgm_read_byte(&rle_data[i]);
    uint8_t count = (byte >> 1) + 1;
    uint8_t pixel = byte & 0x01;   // 1 = білий

    if (pixel) {
      // Малюємо тільки білі пікселі
      for (uint8_t c = 0; c < count; c++) {
        if (x < w && y < h) {
          u8g2.drawPixel(x, y);
        }
        x++;
        if (x >= w) { x = 0; y++; }
      }
    } else {
      // Чорні — просто пропускаємо (фон вже чорний після clearBuffer)
      x += count;
      while (x >= w) { x -= w; y++; }
    }
  }

  u8g2.sendBuffer();
}