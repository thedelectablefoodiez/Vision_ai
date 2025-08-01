import React, { useState, useEffect, useRef } from "react";
import AuthorizationScreen from "./components/AuthorizationScreen";
import BootScreen from "./components/BootScreen";
import PinchZoomTunnel from "./components/TunnelTransition";
import WeatherDetails from "./components/WeatherDetails";
import WeatherWidget from "./components/WeatherWidget";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authDone, setAuthDone] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [showTunnel, setShowTunnel] = useState(false);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [loginFadeOut, setLoginFadeOut] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const audioRef = useRef(null);

  // Dummy fetch weather function (replace with real API fetch)
  const fetchWeather = (lat, lon) => {
    console.log("Fetching weather for", lat, lon);
    setWeather({
      tempC: 26,
      condition: "Sunny",
      icon: "☀️",
      windSpeed: 18,
      sunrise: "06:15",
      sunset: "19:45",
    });
  };

  // Get location and fetch weather on auth done
  useEffect(() => {
    if (authDone) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchWeather(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            fetchWeather(); // fallback weather if geolocation denied
          }
        );
      } else {
        fetchWeather();
      }
    }
  }, [authDone]);

  // Handle login (simple check)
  function handleLogin() {
    if (username === "VISION" && password === "PROVISION") {
      setError("");
      setLoginFadeOut(true);

      if (audioRef.current) {
        audioRef.current.volume = 1;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }

      setTimeout(() => {
        setLoggedIn(true);
      }, 800);
    } else {
      setError("Invalid credentials.");
    }
  }

  // When AuthorizationScreen completes:
  function handleAuthorizationComplete() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAuthDone(true);
    setShowBoot(true);
  }

  // Mini weather widget click triggers pinch zoom tunnel
  const handleMiniReactorClick = () => {
    setShowTunnel(true);
  };

  // When tunnel animation finishes show detailed weather
  const onTunnelComplete = () => {
    setShowTunnel(false);
    setShowWeatherDetails(true);
  };

  const handleCloseWeatherDetails = () => {
    setShowWeatherDetails(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#010c1b",
        color: "#00fff7",
        fontFamily: "'Orbitron', sans-serif",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* LOGIN SCREEN */}
      {!loggedIn && (
        <div
          className={loginFadeOut ? "fade-out" : ""}
          style={{
            backgroundColor: "rgba(0, 20, 40, 0.75)",
            padding: "3rem 4rem",
            borderRadius: "14px",
            boxShadow: "0 0 40px #00fff7aa",
            transition: "all 0.8s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "400px",
            maxWidth: "500px",
          }}
        >
          <h1
            style={{
              fontSize: "2.2rem",
              marginBottom: "1.5rem",
              letterSpacing: "0.12em",
              textAlign: "center",
            }}
          >
            VISION ACCESS
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1.2rem",
              marginBottom: "1.2rem",
              fontSize: "1.1rem",
              border: "1px solid #00fff799",
              borderRadius: "6px",
              backgroundColor: "#011726",
              color: "#00fff7",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem 1.2rem",
              marginBottom: "1.2rem",
              fontSize: "1.1rem",
              border: "1px solid #00fff799",
              borderRadius: "6px",
              backgroundColor: "#011726",
              color: "#00fff7",
            }}
          />
          {error && (
            <div style={{ color: "#ff4f4f", marginBottom: "1rem", fontSize: "0.95rem" }}>
              {error}
            </div>
          )}
          <button
            onClick={handleLogin}
            style={{
              padding: "0.8rem 2.5rem",
              border: "none",
              borderRadius: "8px",
              background: "#00fff7",
              color: "#011726",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 0 14px #00fff7",
              transition: "all 0.3s ease",
            }}
          >
            Activate
          </button>
        </div>
      )}

      {/* AUTHORIZATION SCREEN */}
      {loggedIn && !authDone && <AuthorizationScreen onComplete={handleAuthorizationComplete} />}

      {/* BOOT SCREEN */}
      {authDone && showBoot && !showTunnel && !showWeatherDetails && (
        <BootScreen onMiniReactorClick={handleMiniReactorClick} weather={weather} />
      )}

      {/* PINCH ZOOM TUNNEL ANIMATION */}
      {showTunnel && <PinchZoomTunnel onComplete={onTunnelComplete} />}

      {/* DETAILED WEATHER VIEW */}
      {showWeatherDetails && weather && (
        <WeatherDetails weather={weather} onClose={handleCloseWeatherDetails} />
      )}

      {/* MINI WEATHER WIDGET top-left */}
      {!showTunnel && !showWeatherDetails && weather && (
        <WeatherWidget
          temp={weather.tempC}
          condition={weather.condition}
          icon={weather.icon}
          onClick={handleMiniReactorClick}
          style={{ position: "fixed", top: 40, left: 40, zIndex: 1000 }}
        />
      )}

      <audio ref={audioRef} src="/sounds/startup.mp3" preload="auto" />

      <style>{`
        .fade-out {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
