import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Recent Activity</div>
      </div>
      <div className="list">
        {activities.map(activity => (
          <div key={activity.id} className="list-item">
            <div className="activity-icon">
              <i className={`bi ${activity.icon}`}></i>
            </div>
            <div className="item-content">
              <div className="item-title">{activity.title}</div>
              <div className="item-subtitle">{activity.subtitle}</div>
              <div className="activity-meta">{activity.meta}</div>
            </div>
            {activity.amount && (
              <div className={`activity-amount ${activity.amount.startsWith('-') ? 'negative' : 'positive'}`}>
                {activity.amount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 