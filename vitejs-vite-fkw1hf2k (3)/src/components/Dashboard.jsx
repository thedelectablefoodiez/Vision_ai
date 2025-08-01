import React from "react";

export default function Dashboard() {
  return (
    <div
      className="dashboard-container"
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        background: "radial-gradient(circle at center, #010a17 0%, #000000 100%)",
        fontFamily: "'Orbitron', sans-serif",
        color: "#00fff7",
      }}
    >
      {/* Central Core Placeholder */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 200,
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 255, 247, 0.07)",
          border: "1px solid #00fff7",
          borderRadius: 16,
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 18px #00fff733",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
          fontWeight: "bold",
          userSelect: "none",
          textAlign: "center",
          zIndex: 5,
        }}
      >
        AI Core Interface
      </div>
      {/* Other panels can go here */}

      {/* Scanlines Overlay */}
      <div
        className="scanlines"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0, 255, 247, 0.05), rgba(0, 255, 247, 0.05) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
          animation: "flicker 1.5s infinite",
          zIndex: 10,
        }}
      />

      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
      `}</style>
    </div>
  );
}
