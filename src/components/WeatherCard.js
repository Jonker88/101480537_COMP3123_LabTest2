import React from "react";
import HourlyForecast from "./HourlyForecast";

function WeatherCard({
  city,
  country,
  temperature,
  feelsLike,
  description,
  icon,
  humidity,
  windSpeed,
  pressure,
  sunrise,
  sunset,
  hourly,
  unit,
  onToggleUnit,
}) {
  const iconUrl = icon
    ? icon.startsWith("//")
      ? `https:${icon}`
      : icon
    : "";

  const displayTemp = (tempC) => {
    if (unit === "F") {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  return (
    <div className="dashboard-layout">
      {/* Column 1: Current Weather */}
      <section className="dashboard-col current-weather-col">
        <div className="weather-header">
          <div className="weather-date">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {" " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="current-main">
          {iconUrl && (
            <img
              src={iconUrl}
              alt={description}
              className="current-icon"
            />
          )}
          <div className="current-temp-wrapper">
            <span className="current-temp-val">
              {displayTemp(temperature)}°{unit}
            </span>
            <button className="unit-toggle" onClick={onToggleUnit}>
              Switch to °{unit === "C" ? "F" : "C"}
            </button>
          </div>
          <div className="current-feels">
            Feels like {displayTemp(feelsLike)}°
          </div>
          <div className="current-desc">
            The whole day will be {description}.
          </div>
        </div>

        <div className="current-astro">
          {sunrise && <div>Sunrise: {sunrise}</div>}
          {sunset && <div>Sunset: {sunset}</div>}
        </div>
      </section>

      {/* Column 2: Details (Middle) */}
      <section className="dashboard-col details-col">
        <h3 className="section-title">MORE DETAILS:</h3>
        <div className="details-list">
          <div className="detail-row">
            <span>Wind speed:</span>
            <strong>{windSpeed} km/h</strong>
          </div>
          <div className="detail-row">
            <span>Air humidity:</span>
            <strong>{humidity}%</strong>
          </div>
          <div className="detail-row">
            <span>Pressure:</span>
            <strong>{pressure} hPa</strong>
          </div>
          <div className="detail-row">
            <span>Precipitation:</span>
            <strong>0%</strong>
          </div>
        </div>
      </section>

      {/* Column 3: Hourly Forecast (Right) */}
      <section className="dashboard-col hourly-col">
        <HourlyForecast hourly={hourly} unit={unit} />
      </section>
    </div>
  );
}

export default WeatherCard;
