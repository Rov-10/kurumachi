#pragma once
#include "config.h"

void bmi160WriteReg(uint8_t reg, uint8_t val) {
  Wire.beginTransmission(BMI160_ADDR);
  Wire.write(reg); Wire.write(val);
  Wire.endTransmission();
}

uint8_t bmi160ReadReg(uint8_t reg) {
  Wire.beginTransmission(BMI160_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)BMI160_ADDR, (uint8_t)1);
  return Wire.available() ? Wire.read() : 0xFF;
}

bool bmi160Init() {
  uint8_t id = bmi160ReadReg(0x00);
  Serial.print("BMI160 CHIP_ID: 0x"); Serial.println(id, HEX);
  if (id != 0xD1) return false;
  bmi160WriteReg(0x7E, 0xB6); delay(100);
  bmi160WriteReg(0x7E, 0x11); delay(100);
  bmi160WriteReg(0x7E, 0x15); delay(100);
  return true;
}

void bmi160ReadData(float &ax, float &ay, float &az,
                    float &gx, float &gy, float &gz) {
  Wire.beginTransmission(BMI160_ADDR);
  Wire.write(0x0C);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)BMI160_ADDR, (uint8_t)12);
  int16_t gx_r = Wire.read() | (Wire.read() << 8);
  int16_t gy_r = Wire.read() | (Wire.read() << 8);
  int16_t gz_r = Wire.read() | (Wire.read() << 8);
  int16_t ax_r = Wire.read() | (Wire.read() << 8);
  int16_t ay_r = Wire.read() | (Wire.read() << 8);
  int16_t az_r = Wire.read() | (Wire.read() << 8);
  ax = ax_r / 16384.0f * 9.81f;
  ay = ay_r / 16384.0f * 9.81f;
  az = az_r / 16384.0f * 9.81f;
  gx = gx_r / 262.4f;
  gy = gy_r / 262.4f;
  gz = gz_r / 262.4f;
}

void bmi160ReadRawAccel(int16_t &ax, int16_t &ay, int16_t &az) {
  Wire.beginTransmission(BMI160_ADDR);
  Wire.write(0x12);
  Wire.endTransmission(false);
  Wire.requestFrom((uint8_t)BMI160_ADDR, (uint8_t)6);
  ax = Wire.read() | (Wire.read() << 8);
  ay = Wire.read() | (Wire.read() << 8);
  az = Wire.read() | (Wire.read() << 8);
}