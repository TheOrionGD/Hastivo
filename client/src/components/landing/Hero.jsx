import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AvatarStage } from "@/components/three/AvatarStage";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Abstract sign-language motion trails */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path data-parallax="40" d="M-50 640 C 300 420, 520 820, 820 560 S 1300 300, 1500 420" fill="none" stroke="var(--brand-coral)" strokeWidth="1.5" opacity="0.55" />
        <path data-parallax="70" d="M-50 700 C 260 560, 600 860, 900 640 S 1280 420, 1500 520" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" opacity="0.5" />
      </svg>

      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-12 items-center gap-x-6 px-5 pt-28 md:px-10">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow mb-8 text-text-3">
            <span className="mr-3 inline-block h-2 w-2 rounded-full bg-coral align-middle" />
            Sign language, understood
          </p>
          <h1 id="hero-title" className="font-display text-mega font-medium">
            <span className="block overflow-hidden"><span data-line className="block">Communication</span></span>
            <span className="block overflow-hidden"><span data-line className="block text-text-3">Without</span></span>
            <span className="block overflow-hidden"><span data-line className="block">Boundaries<span className="text-coral">.</span></span></span>
          </h1>
          <p data-reveal className="mt-10 max-w-xl text-lead text-text-2">
            Bringing spoken language and sign language closer through intelligent, expressive technology.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-8">
            <a href="#product" className="pill-action">
              Explore the Experience <ArrowDown size={18} />
            </a>
            <Link to="/get-started" className="link-action text-lg">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="col-span-12 h-[46vh] lg:col-span-5 lg:h-[78vh]">
          <AvatarStage className="h-full w-full" />
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] justify-between px-5 pb-8 text-sm text-text-3 md:px-10">
        <span>Text to sign · Sign to text · Real time</span>
        <span className="hidden md:inline">Scroll to begin</span>
      </div>
    </section>
  );
}
