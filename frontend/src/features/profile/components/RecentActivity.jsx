import React from 'react';

export const RecentActivity = () => {
  const recentActivity = [
    { type: 'Ride', description: 'Completed ride to Downtown', date: '2024-01-15', amount: '$25' },
    { type: 'Profile', description: 'Updated profile information', date: '2024-01-12', amount: '-' }
  ];

  return (
    <div className="profile-activity">
      <h2 className="section-title">Recent Activity</h2>
      <div className="activity-list">
        {recentActivity.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-type">{activity.type}</div>
            <div className="activity-description">{activity.description}</div>
            <div className="activity-date">{activity.date}</div>
            <div className="activity-amount">{activity.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 