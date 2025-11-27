import React from "react";

function HourlyForecast({ hourly, unit }) {
    if (!hourly || hourly.length === 0) return null;

    const displayTemp = (tempC) => {
        if (unit === "F") {
            return Math.round((tempC * 9) / 5 + 32);
        }
        return Math.round(tempC);
    };

    // Filter for specific times to match the "Night, Morning, Day, Evening" vibe or just show intervals
    // The image shows 8 items: 0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00, 21:00
    // We will filter the 24h array to get these 3-hour intervals
    const intervals = [0, 3, 6, 9, 12, 15, 18, 21];
    const filteredHours = hourly.filter((hour) => {
        const date = new Date(hour.time);
        return intervals.includes(date.getHours());
    });

    return (
        <div className="hourly-grid">
            <div className="hourly-header-row">
                <span>NIGHT</span>
                <span>MORNING</span>
                <span>DAY</span>
                <span>EVENING</span>
            </div>
            <div className="hourly-items-row">
                {filteredHours.map((hour, index) => {
                    const date = new Date(hour.time);
                    const timeLabel = `${date.getHours()}:00`;

                    return (
                        <div key={index} className="hourly-item">
                            <img src={hour.icon} alt={hour.condition} className="hourly-icon" />
                            <span className="hourly-temp">{displayTemp(hour.temp_c)}°</span>
                            <span className="hourly-time">{timeLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HourlyForecast;
