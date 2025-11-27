import React, { useEffect, useState } from "react";
import "./index.css";
import SearchBar from "./components/SearchBar";

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

function App() {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80");
  const [unit, setUnit] = useState("C");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      try {
        setLoading(true);
        setError("");

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || "Request failed");

        const code = parseInt(data.current.condition.code);
        const isDay = data.current.is_day === 1;
        setBgImage(getBackgroundImage(code, isDay));

        const owmIconCode = mapWeatherAPIToOWM(code, isDay);
        const owmIconUrl = `https://openweathermap.org/img/wn/${owmIconCode}@4x.png`;

        setWeather({
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          temp: data.current.temp_c,
          condition: data.current.condition.text,
          icon: owmIconUrl,
          humidity: data.current.humidity,
          wind: data.current.wind_kph,
          pressure: data.current.pressure_mb,
          uv: data.current.uv,
          vis: data.current.vis_km,
          feelsLike: data.current.feelslike_c,
          hourly: data.forecast.forecastday[0].hour.map(h => ({
            ...h,
            icon: `https://openweathermap.org/img/wn/${mapWeatherAPIToOWM(h.condition.code, h.is_day === 1)}@2x.png`
          }))
        });

        const dailyForecast = data.forecast.forecastday.map((day) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
          const fCode = day.day.condition.code;
          const fIconCode = mapWeatherAPIToOWM(fCode, true);

          return {
            date: day.date,
            dayName,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            condition: day.day.condition.text,
            icon: `https://openweathermap.org/img/wn/${fIconCode}@2x.png`,
            morning: day.hour[9],
            afternoon: day.hour[15],
            evening: day.hour[21]
          };
        });
        setForecast(dailyForecast);

      } catch (err) {
        setWeather(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCity(query.trim());
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="app-root">
      <div className="background-image" style={{ backgroundImage: `url(${bgImage})` }} />

      <div className="overlay-gradient" />

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Updating Location...</p>
        </div>
      )}

      <div className="app-shell new-layout">

        {!weather ? (
          <div className="welcome-container">
            <h1 className="welcome-title">Weather App</h1>
            <p className="welcome-subtitle">Enter a city to get the current weather and forecast.</p>
            <div className="search-bar-container">
              <SearchBar query={query} onChange={setQuery} onSubmit={handleSearchSubmit} />
            </div>
          </div>
        ) : (
          <>
            <div className="top-section">
              <div className="weather-info-card">
                <div className="main-temp">
                  {Math.round(weather.temp)}°
                  <span className="unit-toggle" onClick={toggleUnit}>{unit}</span>
                </div>
                <div className="weather-desc">
                  <img src={weather.icon} alt="icon" className="weather-icon-small" />
                  <span>{weather.condition}</span>
                </div>
                <div className="location-info">
                  <h1>{weather.name}</h1>
                  <p>{weather.region}, {weather.country}</p>
                </div>

                <div className="search-wrapper">
                  <SearchBar query={query} onChange={setQuery} onSubmit={handleSearchSubmit} />
                </div>
              </div>

              <div className="time-info-card">
                <div className="current-time">{formattedTime}</div>
                <div className="current-date">{formattedDate}</div>
              </div>
            </div>

            <div className="bottom-panel">
              <div className="panel-tabs">
                <span
                  className={activeTab === 'today' ? 'active' : ''}
                  onClick={() => setActiveTab('today')}
                >
                  Today's Forecast
                </span>
                <span
                  className={activeTab === 'hourly' ? 'active' : ''}
                  onClick={() => setActiveTab('hourly')}
                >
                  Hourly Forecast
                </span>
                <span
                  className={activeTab === 'daily' ? 'active' : ''}
                  onClick={() => setActiveTab('daily')}
                >
                  Daily Forecast
                </span>
              </div>

              <div className="panel-content">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="label">Humidity</span>
                    <span className="value">{weather.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Pressure</span>
                    <span className="value">{weather.pressure} mb</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Visibility</span>
                    <span className="value">{weather.vis} km</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Wind</span>
                    <span className="value">{weather.wind} km/h</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">UV Index</span>
                    <span className="value">{weather.uv}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Feels Like</span>
                    <span className="value">{Math.round(weather.feelsLike)}°</span>
                  </div>
                </div>

                <div className="forecast-section-wrapper">

                  {activeTab === 'today' && forecast.length > 0 && (
                    <div className="todays-forecast">
                      <div className="forecast-card">
                        <span className="f-label">Morning</span>
                        <img src={`https://openweathermap.org/img/wn/${mapWeatherAPIToOWM(forecast[0].morning?.condition.code, true)}@2x.png`} alt="icon" />
                        <span className="f-temp">{Math.round(forecast[0].morning?.temp_c)}°</span>
                      </div>
                      <div className="forecast-card">
                        <span className="f-label">Afternoon</span>
                        <img src={`https://openweathermap.org/img/wn/${mapWeatherAPIToOWM(forecast[0].afternoon?.condition.code, true)}@2x.png`} alt="icon" />
                        <span className="f-temp">{Math.round(forecast[0].afternoon?.temp_c)}°</span>
                      </div>
                      <div className="forecast-card">
                        <span className="f-label">Evening</span>
                        <img src={`https://openweathermap.org/img/wn/${mapWeatherAPIToOWM(forecast[0].evening?.condition.code, false)}@2x.png`} alt="icon" />
                        <span className="f-temp">{Math.round(forecast[0].evening?.temp_c)}°</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'hourly' && weather && (
                    <div className="horizontal-scroll-view">
                      {weather.hourly.map((hour, index) => (
                        <div key={index} className="forecast-card small-card">
                          <span className="f-label">{new Date(hour.time).getHours()}:00</span>
                          <img src={hour.icon} alt="icon" />
                          <span className="f-temp">{Math.round(hour.temp_c)}°</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'daily' && forecast.length > 0 && (
                    <div className="horizontal-scroll-view">
                      {forecast.map((day, index) => (
                        <div key={index} className="forecast-card small-card">
                          <span className="f-label">{day.dayName.slice(0, 3)}</span>
                          <img src={day.icon} alt="icon" />
                          <span className="f-temp">{day.maxTemp}° / {day.minTemp}°</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

function getBackgroundImage(code, isDay) {
  let url = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80";

  if (code === 1000) {
    url = isDay
      ? "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=2000&q=80"
      : "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80";
  }

  if ([1003, 1006, 1009].includes(code)) {
    url = isDay
      ? "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=2000&q=80"
      : "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80";
  }

  if ([
    1063, 1150, 1153, 1168, 1171,
    1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201,
    1240, 1243, 1246
  ].includes(code)) {
    url = "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=2000&q=80";
  }

  if ([
    1066, 1069, 1072,
    1114, 1117,
    1204, 1207,
    1210, 1213, 1216, 1219, 1222, 1225,
    1237,
    1249, 1252,
    1255, 1258,
    1261, 1264
  ].includes(code)) {
    url = "https://images.unsplash.com/photo-1477601374064-48d8855a065c?auto=format&fit=crop&w=2000&q=80";
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    url = "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2000&q=80";
  }

  if ([1030, 1135, 1147].includes(code)) {
    url = "https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=2000&q=80";
  }

  return url;
}

function mapWeatherAPIToOWM(code, isDay) {
  const suffix = isDay ? "d" : "n";

  if (code === 1000) return `01${suffix}`;

  if (code === 1003) return `02${suffix}`;

  if (code === 1006) return `03${suffix}`;

  if (code === 1009) return `04${suffix}`;

  if ([1030, 1135, 1147].includes(code)) return `50${suffix}`;

  if ([
    1063, 1150, 1153, 1168, 1171,
    1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201,
    1240, 1243, 1246
  ].includes(code)) {
    return `10${suffix}`;
  }

  if ([
    1066, 1069, 1072,
    1114, 1117,
    1204, 1207,
    1210, 1213, 1216, 1219, 1222, 1225,
    1237,
    1249, 1252,
    1255, 1258,
    1261, 1264
  ].includes(code)) {
    return `13${suffix}`;
  }

  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return `11${suffix}`;

  return `01${suffix}`;
}

export default App;
