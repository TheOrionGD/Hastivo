// Decorative greeting/presentation poses, not sign-language translations.
// Arms are posed by aim directions in the avatar's own model space
// (+X = avatar's left, +Y = up, +Z = toward the viewer). The rig turns each
// direction into a bone rotation from the measured bind pose, so poses do not
// depend on each bone's local axis convention.
export const AVATAR_GESTURE_DURATION = 14;
export const AIM_JOINTS = ["LeftArm", "RightArm", "LeftForeArm", "RightForeArm"];
export const OFFSET_JOINTS = ["LeftHand", "RightHand", "Head", "Spine2"];

const mirror = ([x, y, z]) => [-x, y, z];
const pose = (left, right, offsets = {}) => ({
  LeftArm: left[0],
  LeftForeArm: left[1],
  RightArm: right[0],
  RightForeArm: right[1],
  LeftHand: [0, 0, 0],
  RightHand: [0, 0, 0],
  Head: [0, 0, 0],
  Spine2: [0, 0, 0],
  ...offsets,
});

// Relaxed: upper arms hang just clear of the torso, elbows softly bent forward.
const REST_LEFT = [
  [0.2, -1, 0.04],
  [0.1, -1, 0.3],
];
const REST = pose(REST_LEFT, REST_LEFT.map(mirror));
// Greeting: right upper arm out to the side, forearm upright beside the head.
const GREETING = pose(
  REST_LEFT,
  [
    [-0.92, -0.25, 0.25],
    [-0.12, 1, 0.12],
  ],
  {
    Head: [0.04, -0.1, -0.035],
  },
);
// Presenting: both elbows by the waist, forearms forward and opened outward.
const PRESENT_LEFT = [
  [0.3, -0.95, 0.2],
  [0.55, -0.12, 0.85],
];
const PRESENT = pose(PRESENT_LEFT, PRESENT_LEFT.map(mirror), {
  Head: [0.06, 0, 0],
  Spine2: [0.015, 0, 0],
});

const KEYS = [
  [0, REST],
  [1.4, GREETING],
  [4.4, GREETING],
  [5.8, REST],
  [7.2, PRESENT],
  [10, PRESENT],
  [11.8, REST],
  [14, REST],
];

const normalize = ([x, y, z]) => {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
};

export function sampleAvatarGesture(seconds, reduced = false) {
  const t = reduced
    ? 0
    : ((seconds % AVATAR_GESTURE_DURATION) + AVATAR_GESTURE_DURATION) % AVATAR_GESTURE_DURATION;
  const end = KEYS.findIndex(([time]) => time > t);
  const [startTime, from] = KEYS[Math.max(0, end - 1)];
  const [endTime, to] = KEYS[end < 0 ? KEYS.length - 1 : end];
  const progress = (t - startTime) / Math.max(endTime - startTime, 0.001);
  const blend = progress * progress * (3 - 2 * progress);
  const out = {};
  for (const name of [...AIM_JOINTS, ...OFFSET_JOINTS]) {
    const v = from[name].map((value, axis) => value + (to[name][axis] - value) * blend);
    out[name] = AIM_JOINTS.includes(name) ? normalize(v) : v;
  }
  if (!reduced) {
    // Wave: the raised forearm swings side to side in the frontal plane.
    const wave = t > 1.4 && t < 4.4 ? Math.sin((Math.PI * (t - 1.4)) / 3) ** 2 : 0;
    const swing = Math.sin((t - 1.4) * 8) * 0.4 * wave;
    const [x, y, z] = out.RightForeArm;
    out.RightForeArm = normalize([x + swing * y, y - swing * x, z]);
    out.Head[0] += Math.sin((t * Math.PI * 2) / 14) * 0.025;
    out.Spine2[0] += Math.sin((t * Math.PI * 4) / 14) * 0.012;
  }
  return out;
}
