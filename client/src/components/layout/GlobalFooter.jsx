import { Link } from "@tanstack/react-router";
import { Cpu, Heart, Shield, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { footerConfig as cfg } from "./footerConfig";

const ICONS = { cpu: Cpu, shield: Shield };
const TONE = { blue: "text-blue", yellow: "text-yellow", coral: "text-coral" };

function FooterLink({ item }) {
  const inner = (
    <>
      {item.label}
      {item.sparkle && <Sparkles size={14} aria-hidden="true" className="text-yellow" />}
    </>
  );
  if (!item.to) {
    return (
      <span className="footer-link footer-link--soon" title="Coming soon">
        {inner}
        <span className="sr-only"> (coming soon)</span>
      </span>
    );
  }
  if (/^https?:/.test(item.to)) {
    return (
      <a href={item.to} target="_blank" rel="noopener noreferrer" className="footer-link">
        {inner}
      </a>
    );
  }
  return (
    <Link to={item.to} className="footer-link">
      {inner}
    </Link>
  );
}

/** Single global footer, rendered once from the root layout. */
export function GlobalFooter() {
  const year = new Date().getFullYear();
  const licenseText = cfg.license
    ? `Distributed under ${cfg.license} for academic and accessibility evaluation.`
    : "Shared for academic and accessibility evaluation.";

  return (
    <footer className="site-footer" aria-labelledby="footer-brand">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-20 md:px-10 md:pt-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.7fr_1fr_1fr] md:gap-10 lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark size={32} />
              <p id="footer-brand" className="text-xl font-medium tracking-tight text-[var(--footer-fg)]">
                {cfg.brand.name}{cfg.brand.suffix && <span className="text-blue"> {cfg.brand.suffix}</span>}
              </p>
            </div>
            <p className="mt-6 max-w-[34rem] leading-relaxed text-[var(--footer-muted)]">{cfg.description}</p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3" aria-label="Technical highlights">
              {cfg.highlights.map((h) => {
                const Icon = ICONS[h.icon];
                return (
                  <li key={h.text} className="flex items-center gap-2 text-sm text-[var(--footer-muted)]">
                    <Icon size={16} aria-hidden="true" className={TONE[h.tone]} />
                    {h.text}
                  </li>
                );
              })}
            </ul>
          </div>

          {cfg.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="footer-heading">{col.heading}</h2>
              <ul className="mt-6 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink item={l} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 h-px w-full bg-[var(--footer-border)]" />

        <div className="mt-8 flex flex-col gap-4 text-sm text-[var(--footer-muted)] lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {[cfg.brand.name, cfg.brand.suffix].filter(Boolean).join(" ")}. Final-Year CSE Capstone Research Project. {licenseText}
          </p>
          <p className="flex items-center gap-2">
            {cfg.attribution}
            <Heart size={15} aria-label="love" className="footer-heart" fill="currentColor" />
          </p>
        </div>
      </div>
    </footer>
  );
}
