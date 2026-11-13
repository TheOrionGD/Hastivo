import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";

const AvatarScene = lazy(() => import("./AvatarScene.jsx"));

class AvatarErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <AvatarFallback className="h-full w-full" /> : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static, non-WebGL fallback silhouette. */
export function AvatarFallback({ className = "" }) {
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label="Hastivo signing avatar">
      <ellipse cx="100" cy="62" rx="34" ry="38" fill="var(--brand-grey)" />
      <ellipse cx="100" cy="64" rx="26" ry="16" fill="var(--brand-charcoal)" />
      <circle cx="91" cy="64" r="3" fill="var(--brand-blue)" />
      <circle cx="109" cy="64" r="3" fill="var(--brand-blue)" />
      <path d="M58 250 C58 150, 142 150, 142 250" fill="var(--brand-grey)" />
      <path d="M60 170 C40 140, 50 120, 70 112" stroke="var(--brand-coral)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M140 170 C160 140, 150 120, 130 112" stroke="var(--brand-blue)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Mounts the 3D avatar only on the client, when visible and WebGL is available. */
export function AvatarStage({ className = "", label = "Hastivo's uploaded 3D communication avatar", modelType = "x-bot" }) {
  const ref = useRef(null);
  const [state, setState] = useState("idle"); // idle | webgl | fallback
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setState(hasWebGL() ? "webgl" : "fallback");
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {state === "fallback" && <AvatarFallback className="h-full w-full" />}
      {state === "webgl" && visible && (
        <AvatarErrorBoundary>
          <Suspense fallback={<AvatarFallback className="h-full w-full opacity-40" />}>
            <AvatarScene className="h-full w-full" modelType={modelType} />
          </Suspense>
        </AvatarErrorBoundary>
      )}
    </div>
  );
}
