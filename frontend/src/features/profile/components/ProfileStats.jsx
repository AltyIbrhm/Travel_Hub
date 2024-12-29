import React from 'react';
import { FaCar, FaHistory, FaBell, FaStar, FaRoute, FaDollarSign } from 'react-icons/fa';

export const ProfileStats = () => {
  const stats = [
    { label: 'Total Rides', value: '28', icon: <FaCar /> },
    { label: 'Completed', value: '25', icon: <FaHistory /> },
    { label: 'Cancelled', value: '3', icon: <FaBell /> },
    { label: 'Rating', value: '4.8', icon: <FaStar /> },
    { label: 'Total Distance', value: '423 km', icon: <FaRoute /> },
    { label: 'Total Savings', value: '$142', icon: <FaDollarSign /> }
  ];

  return (
    <div className="profile-stats">
      <h2 className="section-title">Statistics</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats; 