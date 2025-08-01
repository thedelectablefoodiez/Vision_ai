import React, { useEffect, useState } from "react";
import GlobalWeatherSearch from "./GlobalWeatherSearch";

export default function WeatherDetails({ weather: initialWeather, onClose }) {
  // Helper function to format ISO datetime string to HH:MM only
  function formatTime(dateTimeStr) {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const [weather, setWeather] = useState(initialWeather);
  const [windSpeed, setWindSpeed] = useState(0);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false); // Added state for global search
  const maxWindSpeed = 100;

  // Auto-refresh real-time weather data every 10 minutes using Open-Meteo
  useEffect(() => {
    async function fetchWeather() {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
              `&current_weather=true&daily=sunrise,sunset&timezone=auto`
          );
          const data = await res.json();
          const current = data.current_weather;
          const sunrise = data.daily?.sunrise?.[0] || "N/A";
          const sunset = data.daily?.sunset?.[0] || "N/A";

          const weatherCodeMap = {
            0: { condition: "Clear Sky", icon: "☀️" },
            1: { condition: "Mainly Clear", icon: "🌤️" },
            2: { condition: "Partly Cloudy", icon: "⛅" },
            3: { condition: "Overcast", icon: "☁️" },
            45: { condition: "Fog", icon: "🌫️" },
            48: { condition: "Depositing Rime Fog", icon: "🌫️" },
            51: { condition: "Light Drizzle", icon: "🌦️" },
            53: { condition: "Moderate Drizzle", icon: "🌦️" },
            55: { condition: "Dense Drizzle", icon: "🌧️" },
            56: { condition: "Light Freezing Drizzle", icon: "🌧️" },
            57: { condition: "Dense Freezing Drizzle", icon: "🌧️" },
            61: { condition: "Slight Rain", icon: "🌧️" },
            63: { condition: "Moderate Rain", icon: "🌧️" },
            65: { condition: "Heavy Rain", icon: "🌧️" },
            66: { condition: "Light Freezing Rain", icon: "🌧️" },
            67: { condition: "Heavy Freezing Rain", icon: "🌧️" },
            71: { condition: "Slight Snow Fall", icon: "❄️" },
            73: { condition: "Moderate Snow Fall", icon: "❄️" },
            75: { condition: "Heavy Snow Fall", icon: "❄️" },
            77: { condition: "Snow Grains", icon: "❄️" },
            80: { condition: "Slight Rain Showers", icon: "🌧️" },
            81: { condition: "Moderate Rain Showers", icon: "🌧️" },
            82: { condition: "Violent Rain Showers", icon: "🌧️" },
            85: { condition: "Slight Snow Showers", icon: "❄️" },
            86: { condition: "Heavy Snow Showers", icon: "❄️" },
            95: { condition: "Thunderstorm", icon: "⛈️" },
            96: { condition: "Thunderstorm with slight hail", icon: "⛈️" },
            99: { condition: "Thunderstorm with heavy hail", icon: "⛈️" },
          };

          const mapped = weatherCodeMap[current.weathercode] || {
            condition: "Unknown",
            icon: "❓",
          };

          setWeather({
            tempC: current.temperature,
            windSpeed: current.windspeed,
            condition: mapped.condition,
            icon: mapped.icon,
            sunrise,
            sunset,
          });
        } catch (err) {
          console.error("Weather fetch failed", err);
        }
      });
    }

    fetchWeather(); // Initial load
    const interval = setInterval(fetchWeather, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  // Sync state with updated weather
  useEffect(() => {
    setWeather(initialWeather);
  }, [initialWeather]);

  // Wind speed animation sequence
  useEffect(() => {
    let animationFrame;
    let startTime;
    let delayTimeout;

    const sequence = [
      { target: maxWindSpeed, duration: 2000 },
      { target: 0, duration: 2000, delayAfter: 1500 },
      { target: weather.windSpeed, duration: 2000 },
    ];
    let stepIndex = 0;

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const { target, duration, delayAfter } = sequence[stepIndex];
      const prevTarget = stepIndex === 0 ? 0 : sequence[stepIndex - 1].target;
      let progress = Math.min(elapsed / duration, 1);
      progress = easeInOutQuad(progress);
      const currentValue = prevTarget + (target - prevTarget) * progress;
      setWindSpeed(currentValue);

      if (elapsed >= duration) {
        if (delayAfter) {
          delayTimeout = setTimeout(() => {
            stepIndex++;
            startTime = null;
            animationFrame = requestAnimationFrame(animate);
          }, delayAfter);
          return;
        } else {
          stepIndex++;
          startTime = null;
        }
      }

      if (stepIndex < sequence.length) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(delayTimeout);
    };
  }, [weather.windSpeed]);

  // Dial calculations
  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const angleDeg = (windSpeed / maxWindSpeed) * 180 - 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleX = centerX + radius * Math.cos(angleRad);
  const needleY = centerY + radius * Math.sin(angleRad);

  // Format sunrise and sunset times for display
  const sunriseTime = formatTime(weather.sunrise);
  const sunsetTime = formatTime(weather.sunset);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#010c1b",
        color: "#00fff7",
        fontFamily: "'Orbitron', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        zIndex: 10000,
      }}
    >
      {/* Global Weather Search button (red, top-left) */}
      <button
        onClick={() => setShowGlobalSearch(true)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          backgroundColor: "#ff3300",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#fff",
          boxShadow: "0 0 12px #ff3300",
          zIndex: 15000,
        }}
      >
        🌏 Global Search
      </button>

      {/* Close button (cyan, fixed bottom-left) */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          backgroundColor: "#00fff7",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#011726",
          boxShadow: "0 0 10px #00fff7",
          zIndex: 15000,
        }}
      >
        Close
      </button>

      <h1 style={{ fontSize: 48, marginBottom: 10 }}>
        {weather.tempC}°C {weather.icon}
      </h1>
      <h2 style={{ fontWeight: "normal", marginBottom: 30 }}>{weather.condition}</h2>

      {/* Speedometer */}
      <div style={{ position: "relative", width: 300, height: 180, marginBottom: 50 }}>
        <svg width="300" height="180">
          <path
            d="M30,150 A120,120 0 0 1 270,150"
            stroke="#003333"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          {[...Array(11)].map((_, i) => {
            const value = i * 10;
            const angle = (value / 100) * 180 - 180;
            const rad = (angle * Math.PI) / 180;
            const r1 = 110;
            const r2 = 125;
            const tx = centerX + r1 * Math.cos(rad);
            const ty = centerY + r1 * Math.sin(rad);
            const lx = centerX + r2 * Math.cos(rad);
            const ly = centerY + r2 * Math.sin(rad);
            const labelX = centerX + (r1 - 20) * Math.cos(rad);
            const labelY = centerY + (r1 - 20) * Math.sin(rad);

            return (
              <g key={i}>
                <line x1={tx} y1={ty} x2={lx} y2={ly} stroke="#00fff7" strokeWidth="2" />
                <text x={labelX} y={labelY + 5} fontSize="12" fill="#00fff7" textAnchor="middle">
                  {value}
                </text>
              </g>
            );
          })}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#ff5555"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="7" fill="#ff5555" />
          <text
            x={centerX}
            y={centerY - 24.5}
            fill="#00fff7"
            fontSize="28"
            fontWeight="bold"
            textAnchor="middle"
            style={{ userSelect: "none" }}
          >
            {Math.round(windSpeed)} km/h
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            bottom: 0,
            fontSize: 14,
            color: "#00fff7aa",
          }}
        >
          Wind Speed (km/h)
        </div>
      </div>

      {/* Emoji Icon */}
      <div
        style={{
          position: "fixed",
          top: 40,
          right: 40,
          fontSize: 100,
          userSelect: "none",
        }}
      >
        {weather.icon}
      </div>

      {/* Sunrise & Sunset */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          maxWidth: 800,
          marginTop: 40,
        }}
      >
        <div style={{ textAlign: "center", color: "#ffff88cc" }}>
          <div style={{ width: 100, height: 25, position: "relative", overflow: "hidden", marginBottom: 10 }}>
            <div style={{ width: "100%", height: 4, background: "rgba(255, 255, 136, 0.3)", position: "absolute", bottom: 0 }} />
            <div
              style={{
                position: "absolute",
                bottom: -25,
                left: "50%",
                transform: "translateX(-50%)",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "radial-gradient(circle at center, #fff8b3, #e8c97a)",
              }}
            />
          </div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{sunriseTime}</div>
          <div style={{ fontSize: 14, color: "#aaa" }}>Sunrise</div>
        </div>

        <div style={{ textAlign: "center", color: "#cccccccc" }}>
          <div style={{ width: 100, height: 25, position: "relative", overflow: "hidden", marginBottom: 10 }}>
            <div style={{ width: "100%", height: 4, background: "rgba(200, 200, 200, 0.3)", position: "absolute", bottom: 0 }} />
            <div
              style={{
                position: "absolute",
                bottom: -25,
                left: "50%",
                transform: "translateX(-50%)",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "radial-gradient(circle at center, #ffcccc, #d88ca0)",
              }}
            />
          </div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{sunsetTime}</div>
          <div style={{ fontSize: 14, color: "#aaa" }}>Sunset</div>
        </div>
      </div>

      {/* Global Search overlay */}
      {showGlobalSearch && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 20000,
          }}
        >
          <GlobalWeatherSearch onClose={() => setShowGlobalSearch(false)} />
        </div>
      )}
    </div>
  );
}
