import { Link } from "@tanstack/react-router";
import { ArrowRight, Contrast, Languages, SlidersHorizontal, Type, Hand } from "lucide-react";
import { StoryHeading } from "./StoryHeading";
import { AvatarStage } from "@/components/three/AvatarStage";

const wrap = "mx-auto w-full max-w-[1440px] px-5 md:px-10";

/* ---------- 01 The communication gap ---------- */
function Figure({ color, flip }) {
  return (
    <g transform={flip ? "scale(-1,1)" : undefined}>
      <circle cx="0" cy="-120" r="38" fill="none" stroke="var(--color-foreground)" strokeWidth="1.5" />
      <path d="M-70 120 C -70 -20, 70 -20, 70 120" fill="none" stroke="var(--color-foreground)" strokeWidth="1.5" />
      <path d="M40 10 C 90 -10, 110 -50, 95 -80" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="95" cy="-84" r="7" fill={color} />
    </g>
  );
}

function StoryGap() {
  return (
    <section id="product" aria-labelledby="s1" data-story="gap" className="relative py-32 md:py-48">
      <div className={`${wrap} grid grid-cols-12 gap-x-6`}>
        <div className="col-span-12 lg:col-span-8">
          <StoryHeading index="01" kicker="The communication gap" id="s1" lines={["Different Languages.", "One Human Connection."]} />
        </div>
        <p data-reveal className="col-span-12 mt-10 text-lead text-text-2 md:col-span-6 md:col-start-7 lg:col-span-4 lg:col-start-9 lg:mt-auto">
          Over seventy million people use sign language every day. Most of the world around them speaks. Two complete,
          expressive languages often stand side by side, without a bridge between them.
        </p>
      </div>
      <div className="mt-24 w-full overflow-hidden">
        <svg viewBox="0 0 1200 380" className="mx-auto h-auto w-full max-w-[1200px]" role="img" aria-label="Two people, separated by a line that dissolves into a connecting arc">
          <g data-gap-left><g transform="translate(400,220)"><Figure color="var(--brand-coral)" /></g></g>
          <g data-gap-right><g transform="translate(800,220)"><Figure color="var(--brand-blue)" flip /></g></g>
          <line data-gap-divide x1="600" y1="40" x2="600" y2="360" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="6 8" style={{ transformOrigin: "600px 200px" }} />
          <path data-gap-bridge d="M495 136 C 540 40, 660 40, 705 136" fill="none" stroke="var(--brand-coral)" strokeWidth="2" strokeDasharray="600" strokeDashoffset="0" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}

/* ---------- 02 Text to sign ---------- */
const WORDS = ["Hello,", "how", "are", "you?"];
function Glyph({ i }) {
  const color = i % 2 ? "var(--brand-blue)" : "var(--brand-coral)";
  const paths = [
    "M10 70 L10 20 M22 70 L22 8 M34 70 L34 14 M46 70 L46 28 M4 70 C 20 92, 44 92, 54 70",
    "M8 60 C 8 20, 52 20, 52 60 M30 10 L30 40",
    "M10 50 L50 50 M30 10 C 60 30, 60 70, 30 90 M30 10 C 0 30, 0 70, 30 90",
    "M30 90 L30 30 M30 30 L10 10 M30 30 L50 10 M20 60 L40 60",
  ];
  return (
    <svg data-glyph viewBox="0 0 60 100" className="h-24 w-16 md:h-36 md:w-24" aria-hidden="true">
      <path d={paths[i]} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StoryTextToSign() {
  return (
    <section aria-labelledby="s2" data-story="t2s" className="relative border-t py-32 md:py-48">
      <div className={`${wrap} grid grid-cols-12 gap-x-6`}>
        <div className="col-span-12 md:col-span-7">
          <StoryHeading index="02" kicker="Text to sign" id="s2" accent="blue" lines={["Words Become", "Movement."]} />
        </div>
        <p data-reveal className="col-span-12 mt-10 text-lead text-text-2 md:col-span-5 md:mt-auto">
          Type a sentence or speak it aloud. Hastivo is being designed to translate language into sign, performed by an
          expressive avatar — hand shape, motion and facial grammar together.
        </p>
      </div>
      <div className={`${wrap} relative mt-24`}>
        <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-4 md:gap-x-14">
          {WORDS.map((w, i) => (
            <div key={w} className="relative flex flex-col items-center">
              <Glyph i={i} />
              <span data-word className="font-display mt-4 text-5xl md:text-8xl">{w}</span>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-text-3">Illustration of the concept — not live translation output.</p>
      </div>
    </section>
  );
}

/* ---------- 03 Sign to text ---------- */
const WRIST = [200, 360];
const FINGERS = [
  [[150, 320], [115, 285], [92, 255], [74, 230]],
  [[170, 250], [160, 190], [155, 150], [152, 115]],
  [[200, 245], [200, 175], [200, 130], [200, 92]],
  [[230, 250], [240, 190], [245, 150], [248, 120]],
  [[255, 270], [275, 225], [288, 195], [298, 168]],
];

function StorySignToText() {
  return (
    <section aria-labelledby="s3" data-story="s2t" className="relative border-t py-32 md:py-48">
      <div className={`${wrap} grid grid-cols-12 items-center gap-x-6 gap-y-16`}>
        <div className="order-2 col-span-12 md:order-1 md:col-span-6">
          <svg viewBox="0 0 400 420" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="Hand landmark points connected by lines, illustrating gesture recognition">
            {FINGERS.map((f, fi) => {
              const pts = [WRIST, ...f];
              return pts.slice(1).map((p, i) => (
                <line key={`${fi}-${i}`} data-bone x1={pts[i][0]} y1={pts[i][1]} x2={p[0]} y2={p[1]} stroke="var(--color-text-3)" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" />
              ));
            })}
            <circle data-node cx={WRIST[0]} cy={WRIST[1]} r="7" fill="var(--brand-yellow)" />
            {FINGERS.flat().map(([x, y], i) => (
              <circle key={i} data-node cx={x} cy={y} r={i % 4 === 3 ? 7 : 5} fill={i % 4 === 3 ? "var(--brand-yellow)" : "var(--color-foreground)"} />
            ))}
          </svg>
        </div>
        <div className="order-1 col-span-12 md:order-2 md:col-span-6">
          <StoryHeading index="03" kicker="Sign to text" id="s3" accent="yellow" size="text-giant" lines={["Every Gesture", "Has a Voice."]} />
          <p data-reveal className="mt-10 max-w-lg text-lead text-text-2">
            Using a camera, Hastivo aims to read hand landmarks and movement over time, turning signs into readable text —
            so meaning flows from movement, not from guesswork.
          </p>
          <p data-emerge className="font-display mt-12 text-3xl text-text-3 md:text-4xl" aria-hidden="true">movement → meaning</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 04 Real-time communication ---------- */
function StoryRealtime() {
  return (
    <section id="experience" aria-labelledby="s4" data-story="rt" className="relative border-t py-32 md:py-48">
      <div className={wrap}>
        <StoryHeading index="04" kicker="Real-time communication" id="s4" lines={["Conversation,", "Without the Pause."]} />
      </div>
      <div className="relative mt-20 w-full">
        <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="h-56 w-full md:h-80" role="img" aria-label="Two communication paths flowing in opposite directions through a shared space">
          <path data-path-a d="M0 120 C 360 40, 520 260, 720 180 S 1080 60, 1440 140" fill="none" stroke="var(--brand-coral)" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset="0" pathLength="1000" />
          <path data-path-b d="M1440 240 C 1080 320, 920 100, 720 180 S 360 300, 0 220" fill="none" stroke="var(--brand-blue)" strokeWidth="2.5" strokeDasharray="1000" strokeDashoffset="0" pathLength="1000" />
          <circle cx="720" cy="180" r="9" fill="var(--color-foreground)" />
        </svg>
      </div>
      <div className={`${wrap} mt-16 grid grid-cols-12 gap-x-6 gap-y-12`}>
        <div data-reveal className="col-span-12 border-t pt-8 md:col-span-5">
          <p className="eyebrow mb-4 text-coral">Speech → Sign</p>
          <p className="text-lead text-text-2">A hearing participant speaks. Their words are rendered as sign language by the avatar, as they talk.</p>
        </div>
        <div data-reveal className="col-span-12 border-t pt-8 md:col-span-5 md:col-start-8">
          <p className="eyebrow mb-4 text-blue">Sign → Text & voice</p>
          <p className="text-lead text-text-2">A signing participant responds. Gestures become readable text, with optional spoken output.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 05 Expressive avatar ---------- */
function StoryAvatar() {
  return (
    <section aria-labelledby="s5" data-story="avatar" className="relative border-t pt-32 md:pt-48">
      <div className={`${wrap} grid grid-cols-12 gap-x-6`}>
        <div className="col-span-12 lg:col-span-9">
          <StoryHeading index="05" kicker="An expressive digital avatar" id="s5" accent="blue" lines={["Technology That", "Understands Expression."]} />
        </div>
        <p data-reveal className="col-span-12 mt-10 max-w-xl text-lead text-text-2 md:col-span-7">
          Sign language lives in the hands, the face and the space around the body. Our avatar is built to carry all three —
          the eyebrow that turns a statement into a question, the pace that carries emotion.
        </p>
      </div>
      <div data-avatar-frame className="relative mt-20 h-[80vh] w-full overflow-hidden bg-background-2">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--brand-blue) 18%, transparent), transparent 60%)" }} />
        <AvatarStage className="relative h-full w-full" label="Large close-up of the Hastivo avatar signing" />
        <div className={`${wrap} pointer-events-none absolute inset-x-0 bottom-8 flex justify-between text-sm text-text-3`}>
          <span>Hands · Face · Space</span>
          <span>Move your pointer to look around</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- 06 Accessibility ---------- */
const PRINCIPLES = [
  { icon: Languages, title: "Multiple interface languages", body: "Read Hastivo in the language you think in." },
  { icon: SlidersHorizontal, title: "Personalization", body: "Avatar speed, size and signing style, set your way." },
  { icon: Type, title: "Readable typography", body: "Large, high-contrast text by default — never tiny." },
  { icon: Hand, title: "Inclusive interaction", body: "Keyboard, touch and assistive tech, first-class." },
  { icon: Contrast, title: "Light and dark themes", body: "Comfortable in any room. Try the switch above." },
];

function StoryAccess() {
  return (
    <section id="accessibility" aria-labelledby="s6" className="relative py-32 md:py-48">
      <div className={`${wrap} grid grid-cols-12 gap-x-6`}>
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <StoryHeading index="06" kicker="Accessibility & personalization" id="s6" accent="yellow" lines={["Designed", "Around", "Everyone."]} />
          </div>
        </div>
        <ul className="col-span-12 mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <li key={title} data-reveal className="grid grid-cols-[auto_1fr] gap-6 border-t py-10 last:border-b">
              <Icon size={26} className="mt-1 text-coral" aria-hidden="true" />
              <div>
                <h3 className="font-display text-2xl md:text-3xl">{title}</h3>
                <p className="mt-2 text-lg text-text-2">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 07 Final CTA + footer ---------- */
function FinalCTA() {
  return (
    <section id="about" aria-labelledby="s7" className="relative">
      <div data-final className="relative flex min-h-[90svh] flex-col justify-center bg-charcoal py-32 text-oncharcoal">
        <div className={wrap}>
          <p className="eyebrow mb-10 text-greylight">07 — About Hastivo</p>
          <h2 id="s7" className="font-display text-mega max-w-[14ch] font-medium">
            Let's Make Every Conversation <span className="text-coral">Count.</span>
          </h2>
          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
            <p className="col-span-12 text-lead text-greylight md:col-span-5">
              Step into a more connected world of communication. Hastivo is an accessibility-first platform in active
              development, built with and for the Deaf and hard-of-hearing community.
            </p>
            <div className="col-span-12 flex flex-wrap items-center gap-8 md:col-span-6 md:col-start-7 md:justify-end">
              <Link to="/get-started" className="pill-action">Get Started <ArrowRight size={18} /></Link>
              <a href="#product" className="link-action text-lg">Discover the Platform</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stories() {
  return (
    <>
      <StoryGap />
      <StoryTextToSign />
      <StorySignToText />
      <StoryRealtime />
      <StoryAvatar />
      <StoryAccess />
      <FinalCTA />
    </>
  );
}
