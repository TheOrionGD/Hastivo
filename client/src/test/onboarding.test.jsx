import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { nextChapter, onboardingChapters } from "@/components/onboarding/onboardingContent";

vi.mock("@/components/three/AvatarStage", () => ({ AvatarStage: () => null }));
vi.mock("@/components/common/BrandMark", () => ({ BrandMark: () => null }));
afterEach(cleanup);

describe("Seven-screen introduction", () => {
  it("has exactly seven screens and finishes after screen seven", () => {
    expect(onboardingChapters).toHaveLength(7);
    expect(nextChapter(5)).toBe(6);
    expect(nextChapter(6)).toBeNull();
  });

  it("continues through all seven screens before opening the landing", () => {
    const onDone = vi.fn();
    render(<Onboarding onDone={onDone} />);
    for (let i = 1; i < 7; i += 1) {
      expect(document.querySelector("[data-onboarding-step]")?.getAttribute("data-onboarding-step")).toBe(String(i));
      fireEvent.click(screen.getByRole("button", { name: "Continue", exact: true }));
      expect(onDone).not.toHaveBeenCalled();
    }
    fireEvent.click(screen.getByRole("button", { name: "Explore Hastivo" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("supports going back and skipping to the landing", () => {
    const onDone = vi.fn();
    render(<Onboarding onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "Continue", exact: true }));
    fireEvent.click(screen.getByRole("button", { name: "Previous chapter" }));
    expect(document.querySelector("[data-onboarding-step]")?.getAttribute("data-onboarding-step")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Skip introduction" }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});