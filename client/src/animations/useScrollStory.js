import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP owns every scroll-driven property on the landing page.
 * Framer Motion is used only for splash + navigation, never on these nodes.
 */
export function useScrollStory(rootRef) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline line reveals (mask)
        gsap.utils.toArray("[data-line]").forEach((el) => {
          gsap.from(el, {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
        gsap.utils.toArray("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax) || 80;
          gsap.fromTo(
            el,
            { y: amt },
            { y: -amt, ease: "none", scrollTrigger: { trigger: el, scrub: true } },
          );
        });

        // Story 01 — separation becomes connection
        const gap = document.querySelector("[data-story='gap']");
        if (gap) {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: gap, start: "top 70%", end: "bottom 60%", scrub: 1 },
          });
          tl.fromTo("[data-gap-left]", { x: -120 }, { x: 0 }, 0)
            .fromTo("[data-gap-right]", { x: 120 }, { x: 0 }, 0)
            .fromTo("[data-gap-divide]", { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0 }, 0)
            .fromTo("[data-gap-bridge]", { strokeDashoffset: 600 }, { strokeDashoffset: 0 }, 0.3);
        }

        // Story 02 — words become movement
        const t2s = document.querySelector("[data-story='t2s']");
        if (t2s) {
          gsap
            .timeline({
              scrollTrigger: { trigger: t2s, start: "top 65%", end: "bottom 70%", scrub: 1 },
            })
            .fromTo(
              "[data-word]",
              { opacity: 1, y: 0, filter: "blur(0px)" },
              { opacity: 0.08, y: -30, filter: "blur(6px)", stagger: 0.1 },
              0,
            )
            .fromTo(
              "[data-glyph]",
              { opacity: 0, scale: 0.4, rotate: -30 },
              { opacity: 1, scale: 1, rotate: 0, stagger: 0.1 },
              0.15,
            );
        }

        // Story 03 — landmarks connect
        const s2t = document.querySelector("[data-story='s2t']");
        if (s2t) {
          gsap
            .timeline({
              scrollTrigger: { trigger: s2t, start: "top 65%", end: "bottom 70%", scrub: 1 },
            })
            .fromTo(
              "[data-node]",
              { scale: 0, transformOrigin: "center" },
              { scale: 1, stagger: 0.03 },
              0,
            )
            .fromTo(
              "[data-bone]",
              { strokeDashoffset: 200 },
              { strokeDashoffset: 0, stagger: 0.02 },
              0.1,
            )
            .fromTo(
              "[data-emerge]",
              { opacity: 0, letterSpacing: "0.4em" },
              { opacity: 1, letterSpacing: "-0.02em" },
              0.5,
            );
        }

        // Story 04 — two synchronized paths
        const rt = document.querySelector("[data-story='rt']");
        if (rt) {
          gsap
            .timeline({
              scrollTrigger: { trigger: rt, start: "top 65%", end: "bottom 70%", scrub: 1 },
            })
            .fromTo("[data-path-a]", { strokeDashoffset: 1000 }, { strokeDashoffset: 0 }, 0)
            .fromTo("[data-path-b]", { strokeDashoffset: 1000 }, { strokeDashoffset: 0 }, 0.15);
        }

        // Story 05 — avatar camera push
        const av = document.querySelector("[data-story='avatar']");
        if (av) {
          gsap.fromTo(
            "[data-avatar-frame]",
            { scale: 0.82, clipPath: "inset(12% 18% 12% 18% round 24px)" },
            {
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: { trigger: av, start: "top 80%", end: "center center", scrub: 1 },
            },
          );
        }

        // Final CTA mask
        gsap.fromTo(
          "[data-final]",
          { clipPath: "inset(30% 10% 30% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-final]",
              start: "top bottom",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      });
    }, rootRef);
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [rootRef]);
}
