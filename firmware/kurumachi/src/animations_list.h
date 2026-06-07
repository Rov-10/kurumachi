#pragma once
#include <pgmspace.h>
#include "animation.h"

#include "../assets/animations/sys_idle.h"
#include "../assets/animations/Hello.h"
#include "../assets/animations/cry.h"
#include "../assets/animations/eye_wink.h"
#include "../assets/animations/eye_look_right.h"
#include "../assets/animations/eye_look_left.h"
#include "../assets/animations/eye_squint.h"
#include "../assets/animations/eye_peek.h"
#include "../assets/animations/emotion_happy.h"
#include "../assets/animations/emotion_smile.h"
#include "../assets/animations/emotion_smirk.h"
#include "../assets/animations/emotion_proud.h"
#include "../assets/animations/emotion_love_01.h"
#include "../assets/animations/emotion_love_02.h"
#include "../assets/animations/emotion_uwu.h"
#include "../assets/animations/emotion_relaxed.h"
#include "../assets/animations/emotion_distracted.h"
#include "../assets/animations/emotion_surprised.h"
#include "../assets/animations/emotion_scared.h"
#include "../assets/animations/emotion_frustrated.h"
#include "../assets/animations/emotion_dizzy.h"
#include "../assets/animations/emotion_angry_01.h"
#include "../assets/animations/emotion_angry_03.h"
#include "../assets/animations/emotion_angry_04.h"
#include "../assets/animations/emotion_angry_fire.h"
#include "../assets/animations/emotion_devil_02.h"
#include "../assets/animations/action_eat.h"
#include "../assets/animations/action_yawn.h"
#include "../assets/animations/action_sleepy.h"
#include "../assets/animations/action_sneeze_01.h"
#include "../assets/animations/action_sneeze_02.h"
#include "../assets/animations/action_speed.h"
#include "../assets/animations/action_pingpong.h"
#include "../assets/animations/action_water_gun_01.h"
#include "../assets/animations/action_water_gun_02.h"
#include "../assets/animations/effect_sakura.h"
#include "../assets/animations/effect_rotate.h"
#include "../assets/animations/effect_shrink.h"
#include "../assets/animations/theme_bee.h"
#include "../assets/animations/theme_dragon.h"
#include "../assets/animations/theme_nose_fire.h"
#include "../assets/animations/sys_scx.h"
#include "../assets/animations/slayer.h"
#include "../assets/animations/MD.h"

// AnimDef declarations (RLE format: frames + sizes + delays + dimensions)
static const AnimDef anim_sys_idle           = { sys_idle_frames,           sys_idle_sizes,           sys_idle_delays,           SYS_IDLE_FRAME_COUNT,           SYS_IDLE_WIDTH,           SYS_IDLE_HEIGHT };
static const AnimDef anim_hello              = { hello_frames,              hello_sizes,              hello_delays,              HELLO_FRAME_COUNT,              HELLO_WIDTH,              HELLO_HEIGHT };
static const AnimDef anim_cry                = { cry_frames,                cry_sizes,                cry_delays,                CRY_FRAME_COUNT,                CRY_WIDTH,                CRY_HEIGHT };
static const AnimDef anim_eye_wink           = { eye_wink_frames,           eye_wink_sizes,           eye_wink_delays,           EYE_WINK_FRAME_COUNT,           EYE_WINK_WIDTH,           EYE_WINK_HEIGHT };
static const AnimDef anim_eye_look_right     = { eye_look_right_frames,     eye_look_right_sizes,     eye_look_right_delays,     EYE_LOOK_RIGHT_FRAME_COUNT,     EYE_LOOK_RIGHT_WIDTH,     EYE_LOOK_RIGHT_HEIGHT };
static const AnimDef anim_eye_look_left      = { eye_look_left_frames,      eye_look_left_sizes,      eye_look_left_delays,      EYE_LOOK_LEFT_FRAME_COUNT,      EYE_LOOK_LEFT_WIDTH,      EYE_LOOK_LEFT_HEIGHT };
static const AnimDef anim_eye_squint         = { eye_squint_frames,         eye_squint_sizes,         eye_squint_delays,         EYE_SQUINT_FRAME_COUNT,         EYE_SQUINT_WIDTH,         EYE_SQUINT_HEIGHT };
static const AnimDef anim_eye_peek           = { eye_peek_frames,           eye_peek_sizes,           eye_peek_delays,           EYE_PEEK_FRAME_COUNT,           EYE_PEEK_WIDTH,           EYE_PEEK_HEIGHT };
static const AnimDef anim_emotion_happy      = { emotion_happy_frames,      emotion_happy_sizes,      emotion_happy_delays,      EMOTION_HAPPY_FRAME_COUNT,      EMOTION_HAPPY_WIDTH,      EMOTION_HAPPY_HEIGHT };
static const AnimDef anim_emotion_smile      = { emotion_smile_frames,      emotion_smile_sizes,      emotion_smile_delays,      EMOTION_SMILE_FRAME_COUNT,      EMOTION_SMILE_WIDTH,      EMOTION_SMILE_HEIGHT };
static const AnimDef anim_emotion_smirk      = { emotion_smirk_frames,      emotion_smirk_sizes,      emotion_smirk_delays,      EMOTION_SMIRK_FRAME_COUNT,      EMOTION_SMIRK_WIDTH,      EMOTION_SMIRK_HEIGHT };
static const AnimDef anim_emotion_proud      = { emotion_proud_frames,      emotion_proud_sizes,      emotion_proud_delays,      EMOTION_PROUD_FRAME_COUNT,      EMOTION_PROUD_WIDTH,      EMOTION_PROUD_HEIGHT };
static const AnimDef anim_emotion_love_01    = { emotion_love_01_frames,    emotion_love_01_sizes,    emotion_love_01_delays,    EMOTION_LOVE_01_FRAME_COUNT,    EMOTION_LOVE_01_WIDTH,    EMOTION_LOVE_01_HEIGHT };
static const AnimDef anim_emotion_love_02    = { emotion_love_02_frames,    emotion_love_02_sizes,    emotion_love_02_delays,    EMOTION_LOVE_02_FRAME_COUNT,    EMOTION_LOVE_02_WIDTH,    EMOTION_LOVE_02_HEIGHT };
static const AnimDef anim_emotion_uwu        = { emotion_uwu_frames,        emotion_uwu_sizes,        emotion_uwu_delays,        EMOTION_UWU_FRAME_COUNT,        EMOTION_UWU_WIDTH,        EMOTION_UWU_HEIGHT };
static const AnimDef anim_emotion_relaxed    = { emotion_relaxed_frames,    emotion_relaxed_sizes,    emotion_relaxed_delays,    EMOTION_RELAXED_FRAME_COUNT,    EMOTION_RELAXED_WIDTH,    EMOTION_RELAXED_HEIGHT };
static const AnimDef anim_emotion_distracted = { emotion_distracted_frames, emotion_distracted_sizes, emotion_distracted_delays, EMOTION_DISTRACTED_FRAME_COUNT, EMOTION_DISTRACTED_WIDTH, EMOTION_DISTRACTED_HEIGHT };
static const AnimDef anim_emotion_surprised  = { emotion_surprised_frames,  emotion_surprised_sizes,  emotion_surprised_delays,  EMOTION_SURPRISED_FRAME_COUNT,  EMOTION_SURPRISED_WIDTH,  EMOTION_SURPRISED_HEIGHT };
static const AnimDef anim_emotion_scared     = { emotion_scared_frames,     emotion_scared_sizes,     emotion_scared_delays,     EMOTION_SCARED_FRAME_COUNT,     EMOTION_SCARED_WIDTH,     EMOTION_SCARED_HEIGHT };
static const AnimDef anim_emotion_frustrated = { emotion_frustrated_frames, emotion_frustrated_sizes, emotion_frustrated_delays, EMOTION_FRUSTRATED_FRAME_COUNT, EMOTION_FRUSTRATED_WIDTH, EMOTION_FRUSTRATED_HEIGHT };
static const AnimDef anim_emotion_dizzy      = { emotion_dizzy_frames,      emotion_dizzy_sizes,      emotion_dizzy_delays,      EMOTION_DIZZY_FRAME_COUNT,      EMOTION_DIZZY_WIDTH,      EMOTION_DIZZY_HEIGHT };
static const AnimDef anim_emotion_angry_01   = { emotion_angry_01_frames,   emotion_angry_01_sizes,   emotion_angry_01_delays,   EMOTION_ANGRY_01_FRAME_COUNT,   EMOTION_ANGRY_01_WIDTH,   EMOTION_ANGRY_01_HEIGHT };
static const AnimDef anim_emotion_angry_03   = { emotion_angry_03_frames,   emotion_angry_03_sizes,   emotion_angry_03_delays,   EMOTION_ANGRY_03_FRAME_COUNT,   EMOTION_ANGRY_03_WIDTH,   EMOTION_ANGRY_03_HEIGHT };
static const AnimDef anim_emotion_angry_04   = { emotion_angry_04_frames,   emotion_angry_04_sizes,   emotion_angry_04_delays,   EMOTION_ANGRY_04_FRAME_COUNT,   EMOTION_ANGRY_04_WIDTH,   EMOTION_ANGRY_04_HEIGHT };
static const AnimDef anim_emotion_angry_fire = { emotion_angry_fire_frames, emotion_angry_fire_sizes, emotion_angry_fire_delays, EMOTION_ANGRY_FIRE_FRAME_COUNT, EMOTION_ANGRY_FIRE_WIDTH, EMOTION_ANGRY_FIRE_HEIGHT };
static const AnimDef anim_emotion_devil_02   = { emotion_devil_02_frames,   emotion_devil_02_sizes,   emotion_devil_02_delays,   EMOTION_DEVIL_02_FRAME_COUNT,   EMOTION_DEVIL_02_WIDTH,   EMOTION_DEVIL_02_HEIGHT };
static const AnimDef anim_action_eat         = { action_eat_frames,         action_eat_sizes,         action_eat_delays,         ACTION_EAT_FRAME_COUNT,         ACTION_EAT_WIDTH,         ACTION_EAT_HEIGHT };
static const AnimDef anim_action_yawn        = { action_yawn_frames,        action_yawn_sizes,        action_yawn_delays,        ACTION_YAWN_FRAME_COUNT,        ACTION_YAWN_WIDTH,        ACTION_YAWN_HEIGHT };
static const AnimDef anim_action_sleepy      = { action_sleepy_frames,      action_sleepy_sizes,      action_sleepy_delays,      ACTION_SLEEPY_FRAME_COUNT,      ACTION_SLEEPY_WIDTH,      ACTION_SLEEPY_HEIGHT };
static const AnimDef anim_action_sneeze_01   = { action_sneeze_01_frames,   action_sneeze_01_sizes,   action_sneeze_01_delays,   ACTION_SNEEZE_01_FRAME_COUNT,   ACTION_SNEEZE_01_WIDTH,   ACTION_SNEEZE_01_HEIGHT };
static const AnimDef anim_action_sneeze_02   = { action_sneeze_02_frames,   action_sneeze_02_sizes,   action_sneeze_02_delays,   ACTION_SNEEZE_02_FRAME_COUNT,   ACTION_SNEEZE_02_WIDTH,   ACTION_SNEEZE_02_HEIGHT };
static const AnimDef anim_action_speed       = { action_speed_frames,       action_speed_sizes,       action_speed_delays,       ACTION_SPEED_FRAME_COUNT,       ACTION_SPEED_WIDTH,       ACTION_SPEED_HEIGHT };
static const AnimDef anim_action_pingpong    = { action_pingpong_frames,    action_pingpong_sizes,    action_pingpong_delays,    ACTION_PINGPONG_FRAME_COUNT,    ACTION_PINGPONG_WIDTH,    ACTION_PINGPONG_HEIGHT };
static const AnimDef anim_action_water_gun_01= { action_water_gun_01_frames,action_water_gun_01_sizes,action_water_gun_01_delays,ACTION_WATER_GUN_01_FRAME_COUNT,ACTION_WATER_GUN_01_WIDTH,ACTION_WATER_GUN_01_HEIGHT };
static const AnimDef anim_action_water_gun_02= { action_water_gun_02_frames,action_water_gun_02_sizes,action_water_gun_02_delays,ACTION_WATER_GUN_02_FRAME_COUNT,ACTION_WATER_GUN_02_WIDTH,ACTION_WATER_GUN_02_HEIGHT };
static const AnimDef anim_effect_sakura      = { effect_sakura_frames,      effect_sakura_sizes,      effect_sakura_delays,      EFFECT_SAKURA_FRAME_COUNT,      EFFECT_SAKURA_WIDTH,      EFFECT_SAKURA_HEIGHT };
static const AnimDef anim_effect_rotate      = { effect_rotate_frames,      effect_rotate_sizes,      effect_rotate_delays,      EFFECT_ROTATE_FRAME_COUNT,      EFFECT_ROTATE_WIDTH,      EFFECT_ROTATE_HEIGHT };
static const AnimDef anim_effect_shrink      = { effect_shrink_frames,      effect_shrink_sizes,      effect_shrink_delays,      EFFECT_SHRINK_FRAME_COUNT,      EFFECT_SHRINK_WIDTH,      EFFECT_SHRINK_HEIGHT };
static const AnimDef anim_theme_bee          = { theme_bee_frames,          theme_bee_sizes,          theme_bee_delays,          THEME_BEE_FRAME_COUNT,          THEME_BEE_WIDTH,          THEME_BEE_HEIGHT };
static const AnimDef anim_theme_dragon       = { theme_dragon_frames,       theme_dragon_sizes,       theme_dragon_delays,       THEME_DRAGON_FRAME_COUNT,       THEME_DRAGON_WIDTH,       THEME_DRAGON_HEIGHT };
static const AnimDef anim_theme_nose_fire    = { theme_nose_fire_frames,    theme_nose_fire_sizes,    theme_nose_fire_delays,    THEME_NOSE_FIRE_FRAME_COUNT,    THEME_NOSE_FIRE_WIDTH,    THEME_NOSE_FIRE_HEIGHT };
static const AnimDef anim_sys_scx            = { sys_scx_frames,            sys_scx_sizes,            sys_scx_delays,            SYS_SCX_FRAME_COUNT,            SYS_SCX_WIDTH,            SYS_SCX_HEIGHT };
static const AnimDef anim_slayer             = { slayer_frames,             slayer_sizes,             slayer_delays,             SLAYER_FRAME_COUNT,             SLAYER_WIDTH,             SLAYER_HEIGHT };
static const AnimDef anim_md                 = { md_frames,                 md_sizes,                 md_delays,                 MD_FRAME_COUNT,                 MD_WIDTH,                 MD_HEIGHT };

// Random animation pool (all except sys_idle)
#define ANIM_RANDOM_COUNT 43

static const AnimDef* const randomAnimPool[ANIM_RANDOM_COUNT] = {
  &anim_hello,              &anim_cry,                &anim_eye_wink,
  &anim_eye_look_right,     &anim_eye_look_left,      &anim_eye_squint,
  &anim_eye_peek,           &anim_emotion_happy,      &anim_emotion_smile,
  &anim_emotion_smirk,      &anim_emotion_proud,      &anim_emotion_love_01,
  &anim_emotion_love_02,    &anim_emotion_uwu,        &anim_emotion_relaxed,
  &anim_emotion_distracted, &anim_emotion_surprised,  &anim_emotion_scared,
  &anim_emotion_frustrated, &anim_emotion_dizzy,      &anim_emotion_angry_01,
  &anim_emotion_angry_03,   &anim_emotion_angry_04,   &anim_emotion_angry_fire,
  &anim_emotion_devil_02,   &anim_action_eat,         &anim_action_yawn,
  &anim_action_sleepy,      &anim_action_sneeze_01,   &anim_action_sneeze_02,
  &anim_action_speed,       &anim_action_pingpong,    &anim_action_water_gun_01,
  &anim_action_water_gun_02,&anim_effect_sakura,      &anim_effect_rotate,
  &anim_effect_shrink,      &anim_theme_bee,          &anim_theme_dragon,
  &anim_theme_nose_fire,    &anim_sys_scx,            &anim_slayer,
  &anim_md,
};

// Random animation picker (no immediate repeat)
static uint8_t lastRandomIdx = 255;

const AnimDef* getRandomAnim() {
  uint8_t idx;
  do {
    idx = (uint8_t)(esp_random() % ANIM_RANDOM_COUNT);
  } while (idx == lastRandomIdx && ANIM_RANDOM_COUNT > 1);
  lastRandomIdx = idx;
  return randomAnimPool[idx];
}