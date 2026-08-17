import React, { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid API key. Add your OpenWeather API key in App.jsx.");
      } else if (err.response?.status === 404) {
        setError("City not found. Please check the city name.");
      } else {
        setError("Unable to fetch weather data. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const weatherIcon = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : "";

  return (
    <main className="app">
      <section className="weather-container">
        <div className="hero">
          <p className="tag">LIVE WEATHER</p>
          <h1>Weather App</h1>
          <p className="subtitle">
            Search any city and get current weather details.
          </p>

          <form className="search-box" onSubmit={getWeather}>
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </div>

        {error && <div className="error">{error}</div>}

        {weather && (
          <section className="weather-card">
            <div className="location">
              <div>
                <p className="small-title">CURRENT WEATHER</p>
                <h2>
                  {weather.name}, {weather.sys.country}
                </h2>
              </div>

              <img
                src={weatherIcon}
                alt={weather.weather[0].description}
              />
            </div>

            <div className="temperature">
              {Math.round(weather.main.temp)}°C
            </div>

            <p className="description">
              {weather.weather[0].description}
            </p>

            <div className="details">
              <div className="detail">
                <span>Feels Like</span>
                <strong>{Math.round(weather.main.feels_like)}°C</strong>
              </div>

              <div className="detail">
                <span>Humidity</span>
                <strong>{weather.main.humidity}%</strong>
              </div>

              <div className="detail">
                <span>Wind Speed</span>
                <strong>{weather.wind.speed} m/s</strong>
              </div>

              <div className="detail">
                <span>Pressure</span>
                <strong>{weather.main.pressure} hPa</strong>
              </div>
            </div>
          </section>
        )}

        {!weather && !loading && !error && (
          <div className="empty-state">
            <div className="cloud">☁️</div>
            <h3>Check the weather</h3>
            <p>Enter a city above to see live weather information.</p>
          </div>
        )}

        <footer>
          Built with React + Axios + REST API
        </footer>
      </section>
    </main>
  );
}

export default App;
