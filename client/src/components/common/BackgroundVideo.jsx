import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

const SRC = "https://res.cloudinary.com/b4qngi2o/video/upload/v1793781030/bg.mp4";

/** Single global background video, mounted once in the root layout. */
export function BackgroundVideo() {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play().catch(() => {});
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background-2">
      {!failed && (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          src={SRC}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      )}
      <div className="absolute inset-0" style={{ background: "var(--video-overlay)" }} />
    </div>
  );
}
