import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GlobalWeatherSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [unit, setUnit] = useState("metric");
  const [showUnitMenu, setShowUnitMenu] = useState(false);

  // Monthly data states
  const [monthlyData, setMonthlyData] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState("");

  const tabColors = {
    current: { bg: "#111", text: "#ffe600", highlight: "#ffe600" },
    hourly: { bg: "#111", text: "#66ccff", highlight: "#3399ff" },
    weekly: { bg: "#111", text: "#ff66cc", highlight: "#ff3399" },
    monthly: { bg: "#111", text: "#99cc33", highlight: "#669900" },
  };

  const unitLabels = {
    metric: "Metric (°C, m/s)",
    imperial: "Imperial (°F, mph)",
    standard: "Standard (K, m/s)",
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearch = async () => {
    if (!query) return;

    const apiKey = "f14cdaa190167519b5824471cd4fe9ac";
    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=${unit}`
        ),
      ]);

      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
      setError("");
      setActiveTab("current"); // Reset to current on new search

      // Fetch monthly data using lat/lon from current weather
      const lat = currentRes.data.coord.lat;
      const lon = currentRes.data.coord.lon;
      fetchMonthlyData(lat, lon);
    } catch (err) {
      setWeatherData(null);
      setForecastData(null);
      setMonthlyData(null);
      setMonthlyError("");
      setError("No results found");
    }
  };

  // Fetch monthly weather data from Open-Meteo Archive API for last month
  const fetchMonthlyData = async (lat, lon) => {
    setMonthlyLoading(true);
    setMonthlyError("");
    setMonthlyData(null);

    // Calculate last month start and end date dynamically
    const today = new Date();
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const start_date = lastMonthStart.toISOString().slice(0, 10);
    const end_date = lastMonthEnd.toISOString().slice(0, 10);

    try {
      const response = await axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
          `&start_date=${start_date}&end_date=${end_date}` +
          `&monthly=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      console.log("Monthly API response:", response.data);
      setMonthlyData(response.data);
      setMonthlyError("");
    } catch (err) {
      console.error("Monthly data fetch error:", err);
      setMonthlyData(null);
      setMonthlyError("Failed to load monthly data.");
    }
    setMonthlyLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderTabContent = () => {
    if (!weatherData) return null;

    switch (activeTab) {
      case "current":
        return (
          <div>
            <p>
              <strong style={{ color: tabColors.current.highlight }}>
                Location:
              </strong>{" "}
              {weatherData.name}, {weatherData.sys.country}
            </p>
            <p>
              <strong style={{ color: tabColors.current.highlight }}>
                Temperature:
              </strong>{" "}
              {Math.round(weatherData.main.temp)}°
            </p>
            <p>
              <strong style={{ color: tabColors.current.highlight }}>
                Weather:
              </strong>{" "}
              {weatherData.weather[0].description}
            </p>
            <p>
              <strong style={{ color: tabColors.current.highlight }}>
                Wind Speed:
              </strong>{" "}
              {weatherData.wind.speed} {unit === "imperial" ? "mph" : "m/s"}
            </p>
            <p>
              <strong style={{ color: tabColors.current.highlight }}>
                Humidity:
              </strong>{" "}
              {weatherData.main.humidity}%
            </p>
          </div>
        );

      case "hourly":
        if (!forecastData)
          return (
            <p style={{ color: tabColors.hourly.text, fontSize: "1.3rem" }}>
              Loading hourly data...
            </p>
          );

        const next8Hours = forecastData.list.slice(0, 8);

        return (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              padding: "10px 0",
              backgroundColor: "#001a33",
              borderRadius: "8px",
            }}
          >
            {next8Hours.map(({ dt_txt, main, weather, wind }, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: 130,
                  backgroundColor: "#004080",
                  color: "#cce7ff",
                  borderRadius: 8,
                  padding: "1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  border: `2px solid #3399ff`,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                <div style={{ fontSize: "1.1rem", marginBottom: 6 }}>
                  {new Date(dt_txt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div style={{ fontSize: "1.8rem" }}>
                  {Math.round(main.temp)}°
                </div>
                <div
                  style={{
                    textTransform: "capitalize",
                    fontSize: "1.1rem",
                    margin: "6px 0",
                  }}
                >
                  {weather[0].description}
                </div>
                <div style={{ fontSize: "1.1rem" }}>
                  Wind: {wind.speed} {unit === "imperial" ? "mph" : "m/s"}
                </div>
              </div>
            ))}
          </div>
        );

      case "weekly":
        if (!forecastData)
          return (
            <p style={{ color: tabColors.weekly.text, fontSize: "1.3rem" }}>
              Loading weekly data...
            </p>
          );

        // Aggregate daily data from forecastData.list
        const daysMap = {};
        forecastData.list.forEach(({ dt_txt, main, weather }) => {
          const day = dt_txt.split(" ")[0];
          if (!daysMap[day]) daysMap[day] = { temps: [], weatherDesc: [] };
          daysMap[day].temps.push(main.temp);
          daysMap[day].weatherDesc.push(weather[0].description);
        });

        const daysArr = Object.entries(daysMap).map(([day, data]) => {
          const minTemp = Math.min(...data.temps);
          const maxTemp = Math.max(...data.temps);

          // Get most frequent weather description
          const freqMap = {};
          data.weatherDesc.forEach((desc) => {
            freqMap[desc] = (freqMap[desc] || 0) + 1;
          });
          const mainDesc = Object.entries(freqMap).reduce((a, b) =>
            b[1] > a[1] ? b : a
          )[0];

          return { day, minTemp, maxTemp, mainDesc };
        });

        return (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              padding: "10px 0",
              backgroundColor: "#330022",
              borderRadius: "8px",
            }}
          >
            {daysArr.map(({ day, minTemp, maxTemp, mainDesc }, idx) => {
              const formattedDay = new Date(day).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={idx}
                  style={{
                    minWidth: 140,
                    backgroundColor: "#661155",
                    color: "#ff99cc",
                    borderRadius: 8,
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    border: `2px solid #ff3399`,
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", marginBottom: 6 }}>
                    {formattedDay}
                  </div>
                  <div style={{ fontSize: "1.8rem" }}>
                    {Math.round(minTemp)}° - {Math.round(maxTemp)}°
                  </div>
                  <div
                    style={{
                      textTransform: "capitalize",
                      fontSize: "1.1rem",
                      margin: "6px 0",
                    }}
                  >
                    {mainDesc}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case "monthly":
        if (monthlyLoading) {
          return (
            <div
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                padding: "4rem",
                color: tabColors.monthly.text,
              }}
            >
              Loading monthly data...
            </div>
          );
        }
        if (monthlyError) {
          return (
            <p
              style={{
                color: "#ff4d4d",
                fontSize: "1.3rem",
                textAlign: "center",
              }}
            >
              {monthlyError}
            </p>
          );
        }
        if (
          !monthlyData ||
          !monthlyData.monthly ||
          !monthlyData.monthly.temperature_2m_max ||
          !monthlyData.monthly.temperature_2m_min
        ) {
          return (
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: tabColors.monthly.text,
                textAlign: "center",
                padding: "4rem",
              }}
            >
              Monthly data not available.
            </div>
          );
        }

        const maxTemps = monthlyData.monthly.temperature_2m_max;
        const minTemps = monthlyData.monthly.temperature_2m_min;
        const labels = monthlyData.monthly.time || [];

        return (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              padding: "10px 0",
              backgroundColor: "#224400",
              borderRadius: "8px",
            }}
          >
            {labels.map((date, idx) => {
              const formattedDate = new Date(date).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={idx}
                  style={{
                    minWidth: 160,
                    backgroundColor: "#446622",
                    color: "#ccff99",
                    borderRadius: 8,
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    border: `2px solid #669900`,
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", marginBottom: 6 }}>
                    {formattedDate}
                  </div>
                  <div style={{ fontSize: "1.8rem" }}>
                    Min: {Math.round(minTemps[idx])}°
                  </div>
                  <div style={{ fontSize: "1.8rem" }}>
                    Max: {Math.round(maxTemps[idx])}°
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="global-search-container"
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000000",
        zIndex: 20000,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        color: "#ffe600",
        fontFamily: "Orbitron, sans-serif",
        outline: "none",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Hamburger Icon for Units */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowUnitMenu(!showUnitMenu)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffe600",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginRight: "1rem",
            }}
            aria-label="Select units"
          >
            ☰
          </button>

          {showUnitMenu && (
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: 0,
                backgroundColor: "#222",
                border: "1px solid #ffe600",
                borderRadius: 4,
                padding: "0.5rem",
                zIndex: 1000,
              }}
            >
              {Object.keys(unitLabels).map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    setShowUnitMenu(false);
                    if (query) handleSearch();
                  }}
                  style={{
                    background: unit === u ? "#ffe600" : "transparent",
                    color: unit === u ? "#000" : "#ffe600",
                    border: "none",
                    padding: "0.5rem 1rem",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  {unitLabels[u]}
                </button>
              ))}
            </div>
          )}
        </div>

        <h1 style={{ fontSize: "1.5rem" }}>🌍 Global Weather Search</h1>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            color: "#ffe600",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          aria-label="Close global weather search"
        >
          ✕
        </button>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search city or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#111",
            border: "1px solid #ffe600",
            color: "#ffe600",
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#ffe600",
            color: "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {error && !weatherData && (
        <p style={{ marginTop: "2rem", color: "#ff4d4d", fontSize: "1.2rem" }}>
          {error}
        </p>
      )}

      {weatherData && (
        <>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: `1px solid ${tabColors[activeTab].highlight}`,
              gap: "0.5rem",
            }}
          >
            {["current", "hourly", "weekly", "monthly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  margin: "0 0.5rem",
                  backgroundColor:
                    activeTab === tab ? tabColors[tab].highlight : "transparent",
                  color: activeTab === tab ? "#000" : tabColors[tab].text,
                  border: "none",
                  padding: "0.5rem 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  borderRadius: "4px",
                  transition: "background-color 0.3s, color 0.3s",
                  textAlign: "center",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div
            style={{
              flexGrow: 1,
              marginTop: "1rem",
              padding: "2rem",
              border: `2px solid ${tabColors[activeTab].highlight}`,
              backgroundColor: tabColors[activeTab].bg,
              color: tabColors[activeTab].text,
              fontSize: "1.2rem",
              borderRadius: "8px",
              overflowX:
                activeTab === "hourly" || activeTab === "weekly" || activeTab === "monthly"
                  ? "auto"
                  : "visible",
            }}
          >
            {renderTabContent()}
          </div>
        </>
      )}
    </div>
  );
}
