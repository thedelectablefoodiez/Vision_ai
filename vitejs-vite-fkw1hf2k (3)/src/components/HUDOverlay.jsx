import React from "react";

export default function HUDOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top-Left Corner Ring */}
      <div className="absolute top-4 left-4 w-16 h-16 border border-neonBlue rounded-full animate-spin-slow opacity-20" />

      {/* Bottom-Right Scanner */}
      <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-glow rounded-full opacity-25 animate-ping" />

      {/* Center HUD Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 border border-neonBlue rounded-full animate-spin-slow opacity-10" />
        <div className="absolute w-40 h-40 border border-glow rounded-full animate-pulse opacity-20" />
      </div>

      {/* Crosshair lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1px] h-full bg-neonBlue opacity-10" />
        <div className="h-[1px] w-full bg-neonBlue opacity-10 absolute top-1/2 left-0" />
      </div>
    </div>
  );
}
