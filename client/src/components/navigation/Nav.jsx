import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { useTheme } from "@/context/ThemeContext";

const LINKS = [
  { id: "product", label: "Product" },
  { id: "experience", label: "Experience" },
  { id: "accessibility", label: "Accessibility" },
  { id: "about", label: "About" },
];

export function ThemeSwitch() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="glass grid h-11 w-11 place-items-center rounded-full"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 transition-all duration-500 md:px-10 ${scrolled ? "md:py-3" : "md:py-6"}`}
      >
        <a href="#top" onClick={go("top")} className="flex items-center gap-3" aria-label="Hastivo home">
          <BrandMark size={30} />
          <span className="font-display text-xl font-medium tracking-tight">Hastivo</span>
        </a>

        <div className={`hidden items-center gap-1 rounded-full px-2 md:flex ${scrolled ? "glass" : ""}`}>
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="rounded-full px-4 py-3 text-[0.95rem] text-text-2 transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/get-started" className="pill-action hidden md:inline-flex">
            Get Started
          </Link>
          <ThemeSwitch />
          <button
            type="button"
            className="glass grid h-11 w-11 place-items-center rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 -z-10 flex flex-col justify-center gap-2 bg-background px-8 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="font-display border-b py-4 text-4xl">
                {l.label}
              </a>
            ))}
            <Link to="/get-started" className="pill-action mt-8 self-start">
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
