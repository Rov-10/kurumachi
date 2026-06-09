#pragma once
#include "config.h"
#include "bitmaps.h"

bool bmpGetPixel(const unsigned char* bmp, int x, int y, int w) {
  if (x < 0 || y < 0 || x >= w || y >= w) return false;
  int bytes_per_row = (w + 7) / 8;
  uint8_t b = pgm_read_byte(&bmp[y * bytes_per_row + x / 8]);
  return (b >> (x % 8)) & 1;
}

void drawBitmapRotated(const unsigned char* bmp, int cx, int cy,
                       int bmpSize, float angleDeg) {
  float rad  = angleDeg * PI / 180.0f;
  float sinA = sin(rad);
  float cosA = cos(rad);
  int   half = bmpSize / 2;
  for (int dy = -half; dy < half; dy++) {
    for (int dx = -half; dx < half; dx++) {
      int srcX = (int)( dx * cosA + dy * sinA) + half;
      int srcY = (int)(-dx * sinA + dy * cosA) + half;
      if (bmpGetPixel(bmp, srcX, srcY, bmpSize))
        u8g2.drawPixel(cx + dx, cy + dy);
    }
  }
}