import React, { useEffect, useState, useMemo, useRef } from "react";

// ---------------- Arc Reactor Ring ----------------
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
        zIndex: -1,
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

function OrbitDot({ radius, size, duration, delay, color }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 12px 5px ${color}`,
        animation: `orbit ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        transformOrigin: `${radius}px center`,
        zIndex: -1,
      }}
    />
  );
}

// ---------------- Main Component ----------------
export default function LoginWithBootAndReactor() {
  const steps = useMemo(() => [
    "Powering Up Core Systems...",
    "Establishing Secure Neural Link...",
    "Running System Diagnostics...",
    "Authenticating User...",
    "Compiling Intelligence Modules...",
    "System Online.",
  ], []);

  const [loggedIn, setLoggedIn] = useState(false);
  const [bootStarted, setBootStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginFadeOut, setLoginFadeOut] = useState(false);
  const audioRef = useRef(null);

  function handleLogin() {
    if (username === "jarvis" && password === "ironman") {
      setError("");
      setLoginFadeOut(true);
      setTimeout(() => {
        setLoggedIn(true);
        setBootStarted(true);
      }, 800);
    } else {
      setError("Invalid credentials. Use 'jarvis' / 'ironman'.");
    }
  }

  useEffect(() => {
    if (bootStarted && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }

    if (!bootStarted) return;

    const stepDuration = 1800;
    const totalSteps = steps.length;
    const percentPerStep = 100 / totalSteps;

    let currentStep = 0;
    let progressTimer = null;

    function animateToPercent(targetPercent) {
      if (progressTimer) clearInterval(progressTimer);
      progressTimer = setInterval(() => {
        setPercentage((prev) => {
          if (prev >= targetPercent) {
            clearInterval(progressTimer);
            return targetPercent;
          }
          return prev + 1;
        });
      }, stepDuration / percentPerStep / 2);
    }

    animateToPercent(percentPerStep);

    const stepTimer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        clearInterval(stepTimer);
      } else {
        setStepIndex(currentStep);
        animateToPercent(percentPerStep * (currentStep + 1));
      }
    }, stepDuration);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [bootStarted, steps]);

  const baseRadius = 110;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#020924",
        fontFamily: "'Orbitron', sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
        color: "#00fff7",
      }}
    >
      <audio ref={audioRef} src="/startup.mp3" preload="auto" />

      {/* Arc Reactor */}
      {bootStarted && (
        <div style={{ position: "absolute", width: 520, height: 520 }}>
          <SolidArcRing radius={baseRadius} strokeWidth={8} color="#00fff7" startAngle={0} arcLength={110} rotationDuration={50} reverse={false} />
          <SolidArcRing radius={baseRadius + 30} strokeWidth={6} color="#009999" startAngle={90} arcLength={180} rotationDuration={65} reverse={true} />
          <SolidArcRing radius={baseRadius + 60} strokeWidth={4} color="#00cccc" startAngle={180} arcLength={90} rotationDuration={40} reverse={false} />

          <svg
            width={140}
            height={140}
            viewBox="0 0 140 140"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,
            }}
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
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#00fff7" floodOpacity="0.7" />
                <feDropShadow dx="0" dy="0" stdDeviation="20" floodColor="#00fff7" floodOpacity="0.4" />
              </filter>
            </defs>
          </svg>

          {[...Array(6)].map((_, i) => (
            <OrbitDot key={`inner-${i}`} radius={baseRadius + 50} size={6} duration={14 + i} delay={i * 1.5} color="#00eaff" />
          ))}
          {[...Array(4)].map((_, i) => (
            <OrbitDot key={`outer-${i}`} radius={baseRadius + 90} size={8} duration={18 + i} delay={i * 1.5} color="#00ffff" />
          ))}
        </div>
      )}

      {/* Login Screen */}
      {!loggedIn && (
        <div
          className={`login-panel ${loginFadeOut ? "fade-out" : ""}`}
          style={{
            width: 400,
            padding: 32,
            borderRadius: 24,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            border: "3px solid #00f0ff",
            boxShadow: "0 0 40px #00f0ffcc",
            textAlign: "center",
            zIndex: 10,
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h1 style={{ fontSize: 40, marginBottom: 16, color: "#00f0ff" }}>VISION AI LOGIN</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          {error && <div style={{ color: "red", fontWeight: "bold", marginBottom: 8 }}>{error}</div>}
          <button style={buttonStyle} onClick={handleLogin}>ENTER SYSTEM</button>
        </div>
      )}

      {/* Boot Steps & Progress */}
      {bootStarted && (
        <div style={{ width: 400, marginTop: 40, textAlign: "center", zIndex: 5 }}>
          <div style={{ fontSize: 18, letterSpacing: "0.12em", marginBottom: 12 }}>
            {steps[stepIndex]}
          </div>
          <div
            style={{
              height: 12,
              width: "100%",
              backgroundColor: "#004f4f",
              borderRadius: 6,
              overflow: "hidden",
              marginBottom: 8,
              boxShadow: "0 0 10px #00ffff55",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percentage}%`,
                backgroundColor: "#00fff7",
                transition: "width 0.3s ease-in-out",
              }}
            />
          </div>
          <div>{Math.round(Math.min(percentage, 100))}%</div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateRev {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(var(--radius)) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(var(--radius)) rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
            filter: drop-shadow(0 0 15px #00ffff88);
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 25px #00ffffcc);
          }
        }
        .animate-pulse {
          animation: pulse 3s infinite ease-in-out;
        }
        .fade-out {
          opacity: 0;
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}

// ---------------- Input + Button Styles ----------------
const inputStyle = {
  width: "100%",
  padding: 14,
  fontSize: 16,
  marginBottom: 12,
  borderRadius: 10,
  border: "2px solid #00f0ff",
  backgroundColor: "rgba(0,0,0,0.3)",
  color: "#00eaff",
  fontFamily: "'Courier New', monospace",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: 16,
  fontSize: 18,
  backgroundColor: "#00f0ff",
  color: "black",
  fontWeight: "bold",
  borderRadius: 12,
  boxShadow: "0 0 20px #00ffff",
  cursor: "pointer",
  border: "none",
  transition: "background-color 0.3s",
};
