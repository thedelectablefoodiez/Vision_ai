import React, { useEffect, useState, useRef } from "react";
import useResponsive from "./hooks/useResponsive"; // Adjust path as needed

export default function AuthorizationScreen({ onComplete }) {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const steps = [
    "Powering Up Core Systems...",
    "Establishing Secure Neural Link...",
    "Running System Diagnostics...",
    "Authenticating User...",
    "Initializing Voice Recognition...",
    "Finalizing Boot Sequence...",
    "All Systems Operational",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const totalBars = 20;

  useEffect(() => {
    if (!hasPlayedRef.current && currentStepIndex === 0 && charIndex === 0) {
      hasPlayedRef.current = true;
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay blocked or error playing sound:", err);
        });
      }
    }
  }, [currentStepIndex, charIndex]);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 1000);
      }, 1000);
      return;
    }

    if (charIndex < steps[currentStepIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) =>
          prev + steps[currentStepIndex].charAt(charIndex)
        );
        setCharIndex((prev) => prev + 1);
        setPercentage(
          ((currentStepIndex + charIndex / steps[currentStepIndex].length) /
            steps.length) *
            100
        );
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + "\n");
        setCurrentStepIndex((prev) => prev + 1);
        setCharIndex(0);
        setPercentage(((currentStepIndex + 1) / steps.length) * 100);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentStepIndex, steps, onComplete]);

  const barsToFill = Math.floor((percentage / 100) * totalBars);

  // Dynamic font sizes and container widths based on device
  const fontSize = isMobile ? "1.2rem" : isTablet ? "1.6rem" : "1.8rem";
  const preHeight = isMobile ? "200px" : isTablet ? "280px" : "300px";
  const preMaxWidth = isMobile ? "90vw" : "600px";
  const loadingBarWidth = isMobile ? "90vw" : "520px";
  const loadingBarHeight = isMobile ? 20 : 28;
  const gapBetweenElements = isMobile ? "1.5rem" : "2rem";

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000000",
        color: "#00fff7",
        fontFamily: "'Courier New', Courier, monospace",
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: gapBetweenElements,
        overflow: "hidden",
        padding: isMobile ? "0.75rem" : "1rem",
      }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/startup.mp3" preload="auto" />

      {/* Terminal box */}
      <pre
        style={{
          fontSize,
          lineHeight: "1.4em",
          whiteSpace: "pre-wrap",
          maxWidth: preMaxWidth,
          width: "90%",
          height: preHeight,
          overflowY: "auto",
          backgroundColor: "rgba(0, 20, 40, 0.8)",
          border: "2px solid #00fff7",
          borderRadius: "10px",
          padding: "1rem",
          boxShadow: "0 0 15px #00fff7",
          userSelect: "text",
        }}
      >
        {displayedText}
        <span
          style={{
            display: "inline-block",
            width: "1ch",
            animation: "blink 1s step-end infinite",
            color: "#00fff7",
          }}
        >
          |
        </span>
      </pre>

      {/* Loading bar */}
      {percentage < 100 && (
        <div
          className={`loading-bar-container ${fadeOut ? "fade-out" : ""}`}
          style={{
            width: loadingBarWidth,
            height: loadingBarHeight,
            borderRadius: 8,
            border: "4px solid #00fff7",
            position: "relative",
            overflow: "hidden",
            clipPath:
              "polygon(12px 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0% 50%)",
            boxShadow: "0 0 15px #00fff7",
            display: "flex",
            gap: 4,
            padding: "0 10px",
            alignItems: "center",
            justifyContent: "space-between",
            transform: "skewX(-15deg)",
          }}
        >
          {[...Array(totalBars)].map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "70%",
                backgroundColor: i < barsToFill ? "#00fff7" : "#002f2f",
                borderRadius: 3,
                boxShadow: i < barsToFill ? "0 0 8px #00fff7" : "none",
                transition: "background-color 0.3s, box-shadow 0.3s",
              }}
            />
          ))}
        </div>
      )}

      {/* Percentage display */}
      {percentage < 100 && (
        <div
          style={{
            fontSize: isMobile ? "1.6rem" : "2rem",
            letterSpacing: "0.15em",
            textAlign: "center",
            color: "#00fff7",
            textShadow: "0 0 10px #00fff7",
            marginTop: "0.25rem",
            fontWeight: "bold",
          }}
        >
          {Math.round(percentage)}%
        </div>
      )}

      <style>{`
        .fade-out {
          opacity: 0;
          transition: opacity 1s ease;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
