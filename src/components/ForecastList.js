import React from "react";

function ForecastList({ forecast, unit }) {
    if (!forecast || forecast.length === 0) return null;

    const displayTemp = (tempC) => {
        if (unit === "F") {
            return Math.round((tempC * 9) / 5 + 32);
        }
        return Math.round(tempC);
    };

    return (
        <div className="forecast-container">
            <h3 className="forecast-title">Weekly Forecast</h3>
            <div className="forecast-list">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <span className="forecast-day">{day.dayName}</span>
                        <img src={day.icon} alt={day.condition} className="forecast-icon" />
                        <div className="forecast-temps">
                            <span className="max-temp">{displayTemp(day.maxTemp)}°</span>
                            <span className="min-temp">{displayTemp(day.minTemp)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ForecastList;
