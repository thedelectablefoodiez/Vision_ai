import React, { useEffect, useState } from "react";

// WeatherWidget: small widget display (top-left corner)
function WeatherWidget({ temp, icon, condition, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        width: 140,
        height: 70,
        borderRadius: "40px",
        background: "radial-gradient(circle at center, #021b2e, #010c1b)",
        boxShadow: "0 0 20px #00fff7aa inset",
        border: "2px solid #00fff7aa",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "#00fff7",
        fontFamily: "'Orbitron', sans-serif",
        padding: "0 16px",
        zIndex: 10,
      }}
      aria-label={condition}
      title={condition}
    >
      <svg
        width={70}
        height={70}
        viewBox="0 0 70 70"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          animation: "rotate 8s linear infinite",
          transformOrigin: "35px 35px",
          filter: "drop-shadow(0 0 10px #00fff7)",
          borderRadius: "50%",
        }}
      >
        <circle
          cx="35"
          cy="35"
          r="32"
          stroke="#00fff7bb"
          strokeWidth="3"
          fill="none"
          strokeDasharray="7 10"
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: "bold",
          lineHeight: 1,
          zIndex: 1,
          userSelect: "none",
          marginRight: "10px",
          minWidth: "40px",
          textAlign: "right",
        }}
      >
        {temp}°C
      </div>

      <div
        style={{
          fontSize: "2.5rem",
          animation: "weatherBounce 3s ease-in-out infinite",
          zIndex: 1,
          userSelect: "none",
        }}
      >
        {icon}
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes weatherBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

// WeatherDetails: expanded detailed weather screen with windspeed and sunrise/sunset
function WeatherDetails({ weather, onClose }) {
  const { tempC, condition, icon, windSpeed, sunrise, sunset } = weather;

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
      <button
        onClick={onClose}
        style={{
          alignSelf: "flex-start",
          marginBottom: 20,
          background: "#00fff7",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#011726",
          boxShadow: "0 0 10px #00fff7",
        }}
      >
        Close
      </button>

      <h1 style={{ fontSize: 48, marginBottom: 10 }}>
        {tempC}°C {icon}
      </h1>
      <h2 style={{ fontWeight: "normal", marginBottom: 30 }}>{condition}</h2>

      <div style={{ fontSize: 18, marginBottom: 20 }}>
        Wind Speed: {windSpeed} km/h
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          maxWidth: 600,
          marginTop: 40,
        }}
      >
        <div style={{ textAlign: "center", color: "#ffff88cc" }}>
          <div
            style={{
              width: 100,
              height: 25,
              position: "relative",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(255, 255, 136, 0.3)",
                position: "absolute",
                bottom: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -25,
                left: "50%",
                transform: "translateX(-50%)",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at center, #fff8b3, #e8c97a)",
                boxShadow: "none",
              }}
            />
          </div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{sunrise}</div>
          <div style={{ fontSize: 14, color: "#aaa" }}>Sunrise</div>
        </div>

        <div style={{ textAlign: "center", color: "#ccccccaa" }}>
          <div
            style={{
              width: 100,
              height: 25,
              position: "relative",
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 4,
                background: "rgba(200, 200, 200, 0.3)",
                position: "absolute",
                bottom: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -25,
                left: "50%",
                transform: "translateX(-50%)",
                width: 50,
                height: 50,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at center, #ffcccc, #d88ca0)",
                boxShadow: "none",
              }}
            />
          </div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{sunset}</div>
          <div style={{ fontSize: 14, color: "#aaa" }}>Sunset</div>
        </div>
      </div>
    </div>
  );
}

// Main component that ties everything together and fetches live weather
export default function WeatherApp() {
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        try {
          // Fetch current weather & daily sunrise/sunset
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
              `&current_weather=true&daily=sunrise,sunset&timezone=auto`
          );
          if (!res.ok) throw new Error("Failed to fetch weather data.");

          const data = await res.json();

          const current = data.current_weather;
          const sunrise = data.daily?.sunrise?.[0] || "N/A";
          const sunset = data.daily?.sunset?.[0] || "N/A";

          // Simple weather code mapping (can expand as needed)
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
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
      () => {
        setError("Permission to access location was denied.");
        setLoading(false);
      }
    );
  }, []);

  if (loading)
    return (
      <div
        style={{
          color: "#00fff7",
          fontFamily: "'Orbitron', sans-serif",
          padding: 20,
          backgroundColor: "#010c1b",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          userSelect: "none",
        }}
      >
        Loading weather...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          color: "red",
          fontFamily: "'Orbitron', sans-serif",
          padding: 20,
          backgroundColor: "#010c1b",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          userSelect: "none",
        }}
      >
        {error}
      </div>
    );

  return (
    <>
      <WeatherWidget
        temp={Math.round(weather.tempC)}
        icon={weather.icon}
        condition={weather.condition}
        onClick={() => setShowDetails(true)}
      />

      {showDetails && (
        <WeatherDetails
          weather={weather}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}
