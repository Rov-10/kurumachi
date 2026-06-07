import { codeToHtml } from "shiki";

const cppCode = `// Kurumachi Core System Initialization
#include "display.h"
#include "battery.h"
#include "bmi160.h"

void setup() {
  Serial.begin(115200);
  
  // Initialize subsystems
  Display::init();
  Display::showAnimation(ANIM_WAKE_UP);
  
  IMU::calibrate();

  // Check vitals
  if (Battery::getLevel() < 20) {
    Display::showEmotion(EMOTION_SAD);
    System::enterPowerSaveMode();
  } else {
    Display::showEmotion(EMOTION_HAPPY);
    System::ready();
  }
}`;

export default async function CodeShowcase() {
  const html = await codeToHtml(cppCode, {
    lang: "cpp",
    theme: "github-dark-dimmed",
  });

  return (
    <div className="w-full max-w-4xl mt-32 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-nothing-red to-nothing-border rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative border border-nothing-border bg-nothing-black rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-nothing-border bg-nothing-gray/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-nothing-border"></div>
            <div className="w-3 h-3 rounded-full bg-nothing-border"></div>
            <div className="w-3 h-3 rounded-full bg-nothing-border"></div>
          </div>
          <p className="font-dot text-nothing-text/50 text-sm tracking-widest uppercase">
            src/main.cpp
          </p>
        </div>

        <div className="p-6 overflow-x-auto text-sm md:text-base font-mono text-left">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}