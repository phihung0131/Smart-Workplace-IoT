import React from "react";
import "./CircularGauge.scss";

const CircularGauge = ({
  value,
  unit,
  title,
  max,
  color = "#007bff",
  size = 150,
}) => {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="circular-gauge-card">
      <div className="circular-gauge">
        <h3 className="circular-gauge__title">{title}</h3>
        <div className="circular-gauge__container">
          <svg
            className="circular-gauge__svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              className="circular-gauge__background"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <circle
              className="circular-gauge__progress"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                stroke: color,
              }}
            />
          </svg>
          <div className="circular-gauge__value">
            <strong>
              {value}
              {unit}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularGauge;
