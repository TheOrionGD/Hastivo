import { describe, expect, it } from "vitest";
import { sampleAvatarGesture, AVATAR_GESTURE_DURATION } from "../animations/avatarGestures";

describe("decorative avatar gestures", () => {
  it("rests with both arms hanging down beside the body", () => {
    const rest = sampleAvatarGesture(0);
    expect(rest.LeftArm[1]).toBeLessThan(-0.9);
    expect(rest.RightArm[1]).toBeLessThan(-0.9);
    expect(rest.LeftArm[0]).toBeGreaterThan(0); // avatar's left side
    expect(rest.RightArm[0]).toBeLessThan(0);
  });
  it("raises the right forearm upright for a greeting", () => {
    const greeting = sampleAvatarGesture(3);
    expect(greeting.RightForeArm[1]).toBeGreaterThan(0.85);
    expect(greeting.LeftForeArm[1]).toBeLessThan(-0.9);
  });
  it("brings both forearms forward when presenting", () => {
    const p = sampleAvatarGesture(8);
    expect(p.LeftForeArm[2]).toBeGreaterThan(0.7);
    expect(p.RightForeArm[2]).toBeGreaterThan(0.7);
  });
  it("loops without snapping and holds still with reduced motion", () => {
    const start = sampleAvatarGesture(0);
    const end = sampleAvatarGesture(AVATAR_GESTURE_DURATION - 0.001);
    for (const name of Object.keys(start))
      start[name].forEach((v, i) => expect(end[name][i]).toBeCloseTo(v, 2));
    expect(sampleAvatarGesture(3, true)).toEqual(sampleAvatarGesture(9, true));
  });
});
