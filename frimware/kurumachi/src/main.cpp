#include "config.h"
#include "bmi160.h"
#include "battery.h"
#include "buzzer.h"
#include "sleep.h"
#include "button.h"
#include "bitmaps.h"
#include "display.h"
#include "scenes.h"

// ── Визначення глобальних змінних ────────────────────────────────────────────
U8G2_SH1106_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);
Adafruit_AHTX0  aht;
Adafruit_BMP280 bmp;

uint8_t currentScene = 0;
bool    bmiOk = false, ahtOk = false, bmpOk = false;
bool    sleeping = false;

float ax = 0, ay = 0, az = 0, gx = 0, gy = 0, gz = 0;
float temperature = 0, humidity = 0, pressure = 0;

unsigned long lastSensorRead = 0, lastMotionTime = 0;
int16_t prev_ax = 0, prev_ay = 0, prev_az = 0;

float rollOffset = 0.0f, pitchOffset = 0.0f;

unsigned long lastTapTime    = 0;
unsigned long pressStartTime = 0;
uint8_t       tapCount       = 0;
bool          wasPressed     = false;
bool          holdFired      = false;

// ── Setup ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(500);
  pinMode(PIN_TOUCH, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  Wire.begin(PIN_SDA, PIN_SCL);
  Wire.setClock(400000);
  delay(100);

  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x10_tf);
  u8g2.drawStr(0, 20, "Initializing...");
  u8g2.sendBuffer();
  delay(300);

  bmiOk = bmi160Init();
  ahtOk = aht.begin();
  bmpOk = bmp.begin(0x77);
  if (bmpOk) bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,
                              Adafruit_BMP280::SAMPLING_X2,
                              Adafruit_BMP280::SAMPLING_X16,
                              Adafruit_BMP280::FILTER_X16,
                              Adafruit_BMP280::STANDBY_MS_500);

  bmi160ReadRawAccel(prev_ax, prev_ay, prev_az);
  lastMotionTime = millis();

  Serial.printf("BMI:%d AHT:%d BMP:%d\n", bmiOk, ahtOk, bmpOk);
  drawStatusScreen();
  delay(1500);
  startupBeep();
}

// ── Loop ─────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  if (sleeping) {
    sleepTick();
    if (bmiOk && checkMotion()) wakeUp();
    return;
  }

  handleButton();

  if (now - lastSensorRead >= 500) {
    lastSensorRead = now;

    if (bmiOk) {
      bmi160ReadData(ax, ay, az, gx, gy, gz);
      if (checkMotion()) lastMotionTime = now;
    }

    if (ahtOk) {
      sensors_event_t h, t;
      aht.getEvent(&h, &t);
      temperature = t.temperature;
      humidity    = h.relative_humidity;
    }

    if (bmpOk) pressure = bmp.readPressure() / 100.0f;

    Serial.printf("T:%.1f H:%.1f P:%.1f | AX:%.2f AY:%.2f AZ:%.2f\n",
      temperature, humidity, pressure, ax, ay, az);
  }

  if (now - lastMotionTime >= SLEEP_TIMEOUT_MS) {
    enterSleepMode();
    return;
  }

  switch (currentScene) {
    case 0: drawScene0(); break;
    case 1: drawScene1(); break;
    case 2: drawScene2(); break;
    case 3: drawScene3(); break;
  }
}