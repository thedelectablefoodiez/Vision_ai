import React, { useEffect } from "react";
import useResponsive from "./hooks/useResponsive"; // adjust path if needed

function SolidArcRing({ radius, strokeWidth, color, startAngle, arcLength, rotationDuration, reverse }) {
  const circumference = 2 * Math.PI * radius;
  const arcPercent = arcLength / 360;

  return (
    <svg
      width={(radius + strokeWidth) * 2}
      height={(radius + strokeWidth) * 2}
      viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: `-${radius + strokeWidth}px`,
        marginLeft: `-${radius + strokeWidth}px`,
        animation: `${reverse ? "rotateRev" : "rotate"} ${rotationDuration}s linear infinite`,
        transformOrigin: "50% 50%",
        filter: `drop-shadow(0 0 15px ${color})`,
      }}
    >
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference * arcPercent} ${circumference * (1 - arcPercent)}`}
        strokeDashoffset={circumference * (1 - startAngle / 360)}
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function DashedRing({ radius, strokeWidth, color, dashArray, rotationDuration, reverse }) {
  return (
    <svg
      width={(radius + strokeWidth) * 2}
      height={(radius + strokeWidth) * 2}
      viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: `-${radius + strokeWidth}px`,
        marginLeft: `-${radius + strokeWidth}px`,
        animation: `${reverse ? "rotateRev" : "rotate"} ${rotationDuration}s linear infinite`,
        transformOrigin: "50% 50%",
        filter: `drop-shadow(0 0 12px ${color})`,
      }}
    >
      <circle
        cx={radius + strokeWidth}
        cy={radius + strokeWidth}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={dashArray}
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

function DottedRing({ radius, strokeWidth, color, dotRadius, gap, rotationDuration, reverse }) {
  const dotsCount = Math.floor((2 * Math.PI * radius) / (dotRadius * 2 + gap));
  const dots = Array.from({ length: dotsCount });

  return (
    <svg
      width={(radius + strokeWidth + dotRadius) * 2}
      height={(radius + strokeWidth + dotRadius) * 2}
      viewBox={`0 0 ${(radius + strokeWidth + dotRadius) * 2} ${(radius + strokeWidth + dotRadius) * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: `-${radius + strokeWidth + dotRadius}px`,
        marginLeft: `-${radius + strokeWidth + dotRadius}px`,
        animation: `${reverse ? "rotateRev" : "rotate"} ${rotationDuration}s linear infinite`,
        transformOrigin: "50% 50%",
        filter: `drop-shadow(0 0 8px ${color})`,
      }}
    >
      {dots.map((_, i) => {
        const angle = (360 / dotsCount) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const cx = radius + strokeWidth + dotRadius + radius * Math.cos(rad);
        const cy = radius + strokeWidth + dotRadius + radius * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r={dotRadius} fill={color} opacity="0.85" />;
      })}
    </svg>
  );
}

function SegmentedRing({ radius, strokeWidth, color, segments, segmentAngle, gapAngle, rotationDuration, reverse }) {
  const totalAngle = segments * (segmentAngle + gapAngle);
  const baseOffset = (360 - totalAngle) / 2;
  const arcs = Array.from({ length: segments });

  return (
    <svg
      width={(radius + strokeWidth) * 2}
      height={(radius + strokeWidth) * 2}
      viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: `-${radius + strokeWidth}px`,
        marginLeft: `-${radius + strokeWidth}px`,
        animation: `${reverse ? "rotateRev" : "rotate"} ${rotationDuration}s linear infinite`,
        transformOrigin: "50% 50%",
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
    >
      {arcs.map((_, i) => {
        const startAngle = baseOffset + i * (segmentAngle + gapAngle);
        const endAngle = startAngle + segmentAngle;
        const startRad = (Math.PI / 180) * (startAngle - 90);
        const endRad = (Math.PI / 180) * (endAngle - 90);

        const cx = radius + strokeWidth;
        const cy = radius + strokeWidth;
        const r = radius;

        const startX = cx + r * Math.cos(startRad);
        const startY = cy + r * Math.sin(startRad);
        const endX = cx + r * Math.cos(endRad);
        const endY = cy + r * Math.sin(endRad);

        const largeArcFlag = segmentAngle > 180 ? 1 : 0;
        const pathData = `M${startX} ${startY} A${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

        return (
          <path
            key={i}
            d={pathData}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
        );
      })}
    </svg>
  );
}

function DoubleRing({ radius, strokeWidth, color, gap, rotationDuration, reverse }) {
  return (
    <svg
      width={(radius + strokeWidth + gap) * 2}
      height={(radius + strokeWidth + gap) * 2}
      viewBox={`0 0 ${(radius + strokeWidth + gap) * 2} ${(radius + strokeWidth + gap) * 2}`}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: `-${radius + strokeWidth + gap}px`,
        marginLeft: `-${radius + strokeWidth + gap}px`,
        animation: `${reverse ? "rotateRev" : "rotate"} ${rotationDuration}s linear infinite`,
        transformOrigin: "50% 50%",
        filter: `drop-shadow(0 0 12px ${color})`,
      }}
    >
      <circle
        cx={radius + strokeWidth + gap}
        cy={radius + strokeWidth + gap}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity="0.7"
      />
      <circle
        cx={radius + strokeWidth + gap}
        cy={radius + strokeWidth + gap}
        r={radius - gap * 2}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

// -------- BootScreen Component --------
export default function BootScreen({ onComplete }) {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  // Base radius adjusted by screen size for scaling
  let baseRadius;
  if (isMobile) baseRadius = width * 0.15; // 15% of viewport width
  else if (isTablet) baseRadius = width * 0.12;
  else baseRadius = 110; // default desktop size, fallback

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(bootTimer);
    };
  }, [onComplete]);

  // Container size scales with baseRadius
  const containerSize = (baseRadius + 130) * 2; // max ring radius + stroke + gap

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#020924",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
      aria-label="Boot Screen with Arc Reactor"
    >
      <div
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          minWidth: 200,
          minHeight: 200,
          maxWidth: "90vw",
          maxHeight: "90vw",
        }}
      >
        <SolidArcRing
          radius={baseRadius}
          strokeWidth={8}
          color="#00fff7"
          startAngle={0}
          arcLength={110}
          rotationDuration={50}
          reverse={false}
        />
        <DashedRing
          radius={baseRadius + 30}
          strokeWidth={3}
          color="#009999"
          dashArray="15 25"
          rotationDuration={65}
          reverse={true}
        />
        <DottedRing
          radius={baseRadius + 60}
          strokeWidth={0}
          color="#00cccc"
          dotRadius={baseRadius * 0.036} // scale dot radius relative to baseRadius
          gap={baseRadius * 0.09} // scale gap
          rotationDuration={40}
          reverse={false}
        />
        <SegmentedRing
          radius={baseRadius + 90}
          strokeWidth={4}
          color="#006666"
          segments={10}
          segmentAngle={12}
          gapAngle={16}
          rotationDuration={30}
          reverse={true}
        />
        <DoubleRing
          radius={baseRadius + 120}
          strokeWidth={2}
          color="#004444"
          gap={6}
          rotationDuration={45}
          reverse={false}
        />

        <svg
          width={baseRadius * 1.27}
          height={baseRadius * 1.27}
          viewBox="0 0 140 140"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        >
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="#00fff7"
            filter="url(#glow)"
            className="animate-pulse"
          />
          <defs>
            <filter
              id="glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00fff7" floodOpacity="0.8" />
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00fff7" floodOpacity="0.6" />
            </filter>
          </defs>
        </svg>
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateRev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-pulse {
          animation: pulse 3s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.9;
            r: 60;
          }
          50% {
            opacity: 0.5;
            r: 63;
          }
        }
      `}</style>
    </div>
  );
}
