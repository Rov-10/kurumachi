export interface AnimationItem {
  id: string;
  name: string;
  gifName: string; // Текстове поле
  category: "emotions" | "actions" | "effects" | "system";
}

export const KURUMACHI_ANIMATIONS: AnimationItem[] = [
  { id: "SYS_IDLE", name: "System Idle", gifName: "sys_idle.gif", category: "system" },
  { id: "HELLO", name: "Wake Up / Hello", gifName: "Hello.gif", category: "system" },
  { id: "CRY", name: "Crying Face", gifName: "cry.gif", category: "emotions" },
  { id: "EMOTION_HAPPY", name: "Happy Face", gifName: "emotion_happy.gif", category: "emotions" },
  { id: "EMOTION_UWU", name: "UwU Mode", gifName: "emotion_uwu.gif", category: "emotions" },
  { id: "EMOTION_LOVE_01", name: "Heart Eyes", gifName: "emotion_love_01.gif", category: "emotions" },
  { id: "EMOTION_ANGRY_FIRE", name: "Rage Mode", gifName: "emotion_angry_fire.gif", category: "emotions" },
  { id: "ACTION_EAT", name: "Eating Snack", gifName: "action_eat.gif", category: "actions" },
  { id: "ACTION_SLEEPY", name: "Going to Sleep", gifName: "action_sleepy.gif", category: "actions" },
  { id: "ACTION_PINGPONG", name: "Playing Ping-Pong", gifName: "action_pingpong.gif", category: "actions" },
  { id: "EFFECT_SAKURA", name: "Sakura Rain", gifName: "effect_sakura.gif", category: "effects" },
  { id: "EFFECT_ROTATE", name: "Screen Rotation", gifName: "effect_rotate.gif", category: "effects" }
];