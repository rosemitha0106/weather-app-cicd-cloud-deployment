import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (city.trim() === "") {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      setError("API key is missing. Check your .env file.");
      setWeather(null);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "City not found");
        setWeather(null);
        return;
      }

      setWeather(data);
      setError("");
    } catch (err) {
      setError("Network error. Please try again.");
      setWeather(null);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className="app">
      <div className="weather-card">
        <h1>Cloud Weather App ☁️</h1>
        <p className="subtitle">Search current weather by city</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleEnter}
          />

          <button onClick={getWeather}>Search</button>
        </div>

        {error && <h3 className="error">{error}</h3>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.name}, {weather.sys.country}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />

            <h1>{Math.round(weather.main.temp)}°C</h1>

            <h3>{weather.weather[0].description}</h3>

            <div className="details">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
              <p>Feels Like: {Math.round(weather.main.feels_like)}°C</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;