import React, { useRef, useEffect, useState } from "react";

export default function TunnelTransition({ onComplete }) {
  const canvasRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const numLines = 80;
    const lines = Array.from({ length: numLines }, (_, i) => {
      const angle = (i / numLines) * Math.PI * 2;
      return {
        angle,
        dist: 0,
        speed: 6 + Math.random() * 4,
        length: 200,
        width: 10 + Math.random() * 20,
      };
    });

    let start = performance.now();

    function draw(now) {
      const t = now - start;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      lines.forEach(line => {
        const x1 = Math.cos(line.angle) * line.dist;
        const y1 = Math.sin(line.angle) * line.dist;
        const x2 = Math.cos(line.angle) * (line.dist + line.length);
        const y2 = Math.sin(line.angle) * (line.dist + line.length);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        line.dist += line.speed;
        if (line.dist > Math.hypot(w, h)) line.dist = 0;
      });

      ctx.restore();

      // Flash logic
      let flashVal = 0;
      if (t > 2500 && t < 3000) {
        flashVal = (t - 2500) / 500;
      } else if (t >= 3000 && t < 3500) {
        flashVal = 1 - (t - 3000) / 500;
      }

      setFlash(flashVal);

      if (t < 3800) requestAnimationFrame(draw);
      else {
        setFadeOut(true);
        setTimeout(onComplete, 1200);
      }
    }

    requestAnimationFrame(draw);
    return () => window.removeEventListener("resize", () => {});
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.2s ease-in-out",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      />
      {/* White flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          pointerEvents: "none",
          opacity: flash,
        }}
      />
    </div>
  );
}
