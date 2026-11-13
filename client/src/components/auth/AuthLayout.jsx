import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import { AvatarStage } from "@/components/three/AvatarStage";

const EASE = [0.22, 1, 0.36, 1];

function VisualPanel({ headline, support }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      aria-label="About Hastivo"
      className="relative flex flex-col justify-between overflow-hidden px-5 pb-10 pt-24 md:px-10 lg:min-h-[100svh] lg:pt-10"
      initial={reduce ? false : { opacity: 0, clipPath: "inset(0 30% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 640 C 200 480, 380 760, 560 560 S 760 380, 880 460" fill="none" stroke="var(--brand-coral)" strokeWidth="1.25" opacity="0.5" />
        <path d="M-40 700 C 180 600, 420 840, 600 640 S 780 480, 880 560" fill="none" stroke="var(--brand-blue)" strokeWidth="1.25" opacity="0.45" />
      </svg>

      <p className="eyebrow relative hidden text-text-3 lg:block">Vibrant Connections Through Language Colors</p>

      <div className="pointer-events-auto relative mx-auto hidden h-[34vh] w-full max-w-[420px] md:block lg:h-[42vh]">
        <AvatarStage className="h-full w-full" />
      </div>

      <div className="relative z-10 grid items-end gap-6">
        <div>
          <p className="eyebrow mb-6 text-text-3 lg:hidden">Vibrant Connections Through Language Colors</p>
          <h1 className="font-display max-w-[12ch] text-[clamp(2.5rem,5.2vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">{headline}</h1>
          <p className="mt-6 max-w-md text-lead text-text-2">{support}</p>
        </div>
      </div>

      <p className="relative mt-10 hidden text-sm text-text-3 lg:block">Communication Without Boundaries.</p>
    </motion.section>
  );
}

/** Split composition shared by sign in, registration and recovery. Cardless: form sits on the page. */
export function AuthLayout({ headline, support, children, contained = false }) {
  return (
    <div className={`grid min-h-[100svh] lg:grid-cols-[55fr_45fr] ${contained ? "auth-contained" : ""}`}>
      <VisualPanel headline={headline} support={support} />
      <section className="auth-form-panel relative flex flex-col border-t px-5 pb-16 md:px-10 lg:border-l lg:border-t-0 lg:px-14" style={{ background: "color-mix(in oklab, var(--background) 72%, transparent)" }}>
        <div className="flex shrink-0 items-center justify-between py-6 lg:py-10">
          <Link to="/" className="flex items-center gap-3" aria-label="Hastivo home">
            <BrandMark size={28} />
            <span className="font-display text-lg font-medium tracking-tight">Hastivo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="link-action text-sm text-text-2">
              <ArrowLeft size={16} /> Home
            </Link>
            <ThemeSwitch />
          </div>
        </div>
        <div className={contained ? "auth-form-scroll" : "contents"}>
          <div className="auth-form-content mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">{children}</div>
        </div>
      </section>
    </div>
  );
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
export const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
