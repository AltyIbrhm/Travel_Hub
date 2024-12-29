import React from 'react';

const StatsCard = ({ stat }) => {
  return (
    <div className="stat-card">
      <i className={`bi ${stat.icon} stat-icon`}></i>
      <div className="stat-info">
        <div className="stat-value">{stat.value}</div>
        <div className="stat-label">{stat.label}</div>
        {stat.trend && (
          <div className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
            <i className={`bi ${stat.trend.startsWith('+') ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
            {stat.trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 