import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeSwitch } from "@/components/navigation/Nav";
import { RESEARCH } from "./researchContent";

const wrap = "mx-auto w-full max-w-[1440px] px-5 md:px-10";
const DOT = { coral: "bg-coral", blue: "bg-blue", yellow: "bg-yellow" };

/** Shared editorial template for every academic research screen. */
export function ResearchLayout({ slug }) {
  const page = RESEARCH.find((p) => p.slug === slug);
  const idx = RESEARCH.indexOf(page);
  const next = RESEARCH[(idx + 1) % RESEARCH.length];

  useEffect(() => window.scrollTo(0, 0), [slug]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <nav aria-label="Research" className={`${wrap} flex items-center justify-between py-4`}>
          <Link to="/" className="flex items-center gap-3" aria-label="Hastivo home">
            <BrandMark size={30} />
            <span className="font-display text-xl font-medium tracking-tight">Hastivo</span>
          </Link>
          <ThemeSwitch />
        </nav>
      </header>

      <main id="main" className="pt-32">
        <section className={`${wrap} grid grid-cols-12 gap-x-6 pb-20 md:pb-28`}>
          <div className="col-span-12 lg:col-span-9">
            <Link to="/" className="link-action mb-10 text-text-2">
              <ArrowLeft size={16} /> Back to Hastivo
            </Link>
            <p className="eyebrow flex items-center gap-2 text-text-3">
              <span className={`h-1.5 w-1.5 rounded-full ${DOT[page.accent]}`} /> Academic research · {String(idx + 1).padStart(2, "0")}
            </p>
            <h1 className="font-display text-giant mt-6 font-medium">{page.title}</h1>
            <p className="mt-8 max-w-2xl text-lead text-text-2">{page.lead}</p>
          </div>
        </section>

        {page.sections.map((s, i) => (
          <section key={s.heading} aria-labelledby={`sec-${i}`} className="border-t">
            <div className={`${wrap} grid grid-cols-12 gap-x-6 gap-y-6 py-16 md:py-20`}>
              <div className="col-span-12 md:col-span-4">
                <span className="font-display text-lg tabular-nums text-text-3">{String(i + 1).padStart(2, "0")}</span>
                <h2 id={`sec-${i}`} className="font-display mt-3 text-3xl font-medium md:text-4xl">{s.heading}</h2>
              </div>
              <div className="col-span-12 space-y-5 md:col-span-7 md:col-start-6">
                {s.body?.map((p, j) => (
                  <p key={j} className="text-lg leading-relaxed text-text-2">{p}</p>
                ))}
                {s.list && (
                  <dl className="divide-y border-y">
                    {s.list.map(([k, v]) => (
                      <div key={k} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                        <dt className="font-medium">{k}</dt>
                        <dd className="text-text-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </section>
        ))}

        <section className="border-t">
          <div className={`${wrap} py-16`}>
            <p className="text-sm text-text-3">{page.note}</p>
            <Link to={next.path} className="font-display mt-10 flex items-center justify-between gap-6 text-3xl md:text-5xl">
              <span><span className="block text-base text-text-3">Next</span>{next.title}</span>
              <ArrowRight className="shrink-0" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
