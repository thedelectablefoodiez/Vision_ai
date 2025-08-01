import React, { useEffect, useState } from "react";
import WeatherDetails from "./WeatherDetails"; // Optional if you want to show expanded view

export default function WeatherWidget({ style, onClick }) {
  const [weather, setWeather] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
          );
          const data = await res.json();
          const current = data.current;
          const daily = data.daily;

          const weatherCode = current.weather_code;
          const icon = getWeatherEmoji(weatherCode);
          const condition = getConditionText(weatherCode);

          setWeather({
            tempC: current.temperature_2m,
            windSpeed: current.wind_speed_10m,
            icon,
            condition,
            sunrise: daily.sunrise[0].split("T")[1],
            sunset: daily.sunset[0].split("T")[1],
          });
        } catch (err) {
          console.error("Failed to fetch weather data:", err);
        }
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const temperature = weather?.tempC ?? "--";
  const weatherCondition = weather?.condition ?? "Loading...";
  const weatherIcon = weather?.icon ?? "⏳";

  return (
    <>
      <div
        onClick={onClick || (() => setShowDetails(true))}
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: 140,
          height: 70,
          borderRadius: "40px",
          background: "radial-gradient(circle at center, #021b2e, #010c1b)",
          boxShadow: "0 0 20px #00fff7aa inset",
          border: "2px solid #00fff7aa",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          color: "#00fff7",
          fontFamily: "'Orbitron', sans-serif",
          padding: "0 16px",
          zIndex: 10,
          ...style,
        }}
        aria-label={weatherCondition}
        title={weatherCondition}
      >
        {/* Rotating dashed ring */}
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

        {/* Temperature */}
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
          {temperature}°C
        </div>

        {/* Weather Icon */}
        <div
          style={{
            fontSize: "2.5rem",
            animation: "weatherBounce 3s ease-in-out infinite",
            zIndex: 1,
            userSelect: "none",
          }}
        >
          {weatherIcon}
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

      {showDetails && weather && (
        <WeatherDetails
          weather={weather}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

function getWeatherEmoji(code) {
  if (code < 3) return "☀️";
  if (code < 45) return "⛅";
  if (code < 51) return "🌫️";
  if (code < 61) return "🌧️";
  if (code < 71) return "🌦️";
  if (code < 81) return "🌨️";
  return "⛈️";
}

function getConditionText(code) {
  if (code < 3) return "Clear";
  if (code < 45) return "Partly Cloudy";
  if (code < 51) return "Fog";
  if (code < 61) return "Drizzle";
  if (code < 71) return "Rain";
  if (code < 81) return "Snow";
  return "Thunderstorm";
}
