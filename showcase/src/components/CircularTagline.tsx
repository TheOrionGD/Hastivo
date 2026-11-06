import React from 'react';

interface CircularTaglineProps {
  text?: string;
  className?: string;
  reverse?: boolean;
  textColor?: string;
  circleColor?: string;
}

export const CircularTagline: React.FC<CircularTaglineProps> = ({
  text = '• EVERY GESTURE DESERVES TO BE HEARD • HASTIVO AI SPATIAL LINGUISTICS ',
  className = '',
  reverse = false,
  textColor = 'currentColor',
  circleColor = 'none',
}) => {
  // Repeated phrase to loop smoothly around circle circumference
  const repeatedText = `${text} ${text}`.trim();
  const pathId = React.useId();

  return (
    <div className={`pointer-events-none select-none relative ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1000 1000"
        className={`w-full h-full ${reverse ? 'animate-rotate-reverse' : 'animate-rotate'}`}
      >
        <defs>
          {/* Circular path: Center (500,500), radius 380 */}
          <path
            id={pathId}
            d="M 500, 500 m -380, 0 a 380,380 0 1,1 760,0 a 380,380 0 1,1 -760,0"
            fill="none"
          />
        </defs>

        {/* Optional decorative outline ring */}
        <circle
          cx="500"
          cy="500"
          r="410"
          fill="none"
          stroke={circleColor !== 'none' ? circleColor : 'currentColor'}
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.25"
        />
        <circle
          cx="500"
          cy="500"
          r="350"
          fill="none"
          stroke={circleColor !== 'none' ? circleColor : 'currentColor'}
          strokeWidth="1"
          opacity="0.15"
        />

        {/* System Tagline Text Path */}
        <text
          fill={textColor}
          className="font-mono text-[22px] tracking-[0.28em] uppercase font-semibold"
          opacity="0.9"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};
