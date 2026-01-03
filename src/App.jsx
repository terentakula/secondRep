import { useState, useEffect } from "react";
import "./index.css";

const KEY = "cb6beb989f1740b1ace101115252312";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city.trim()) {
      setWeatherData(null)
      setError(null)
      return
    }
    async function getData() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}`
        );
        // if (!res.ok) {
        //   console.log(res);
        //   throw new Error(`${res.status} ${res.statusText}`);
        // }
        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
          setWeatherData(null);
          return;
        }

        setWeatherData(data);
        setError(null);
      } catch {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [city]);

  function renderError() {
    return <p>{error}</p>;
  }
  function renderLoading() {
    return <p>Loading...</p>;
  }
  function renderWeatherData() {
    return (
      <div className="weather-card">
        <h2>{`${weatherData?.location?.name}, ${weatherData?.location?.country}`}</h2>
        <img
          src={`https:${weatherData?.current?.condition?.icon}`}
          alt="icon"
          className="weather-icon"
        />
        <p className="temperature">
          {Math.round(weatherData?.current?.temp_c)}°C
        </p>
        <p className="condition">{weatherData?.current?.condition?.text}</p>
        <div className="weather-details">
          <p>Humidity: {Math.round(weatherData?.current?.humidity)} %</p>
          <p>Wind: {Math.round(weatherData?.current?.wind_kph)} km/h</p>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      <div className="widget-container">
        <div className="weather-card-container">
          <h1 className="app-title">Weather Widget</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter city name"
              className="search-input"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
          </div>
        </div>
        {error && renderError()}
        {loading && renderLoading()}
        {!error && !loading && weatherData && renderWeatherData()}
      </div>
    </div>
  );
}

export default App;
