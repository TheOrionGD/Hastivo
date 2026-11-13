import { AuroraCurtain, HolographicFoil, GravityStars, PerspectiveText3D, KineticCenterBuild, InfiniteSlider, OrbitalImageWheel, LiquidMetal, SmoothButton } from "@/components/ui/smoothui";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/landing/Hero";
import { Stories } from "@/components/landing/Stories";
import { Splash } from "@/components/splash/Splash";
import { useScrollStory } from "@/animations/useScrollStory";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { ONBOARDING_SEEN } from "@/components/onboarding/onboardingContent";

const SEEN = "hastivo-splash-seen";

export default function LandingPage() {
  const [phase, setPhase] = useState("checking");

  useEffect(() => {
    try {
      setPhase(!window.sessionStorage.getItem(SEEN) ? "splash" : !window.sessionStorage.getItem(ONBOARDING_SEEN) ? "onboarding" : "landing");
    } catch {
      setPhase("splash");
    }
  }, []);

  function finishOnboarding() {
    try { window.sessionStorage.setItem(ONBOARDING_SEEN, "1"); } catch {}
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("landing");
  }

  if (phase === "checking") return <div className="min-h-svh" />;
  if (phase === "splash") return <Splash onDone={() => {
    try { window.sessionStorage.setItem(SEEN, "1"); } catch {}
    setPhase("onboarding");
  }} />;
  if (phase === "onboarding") return <Onboarding onDone={finishOnboarding} />;
  return <LandingExperience />;
}

function LandingExperience() {
  const root = useRef(null);
  useScrollStory(root);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-3">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={root}>
        <Hero />
        <Stories />
      </main>
    </>
  );
}
