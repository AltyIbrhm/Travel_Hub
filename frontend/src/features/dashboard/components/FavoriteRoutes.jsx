import React from 'react';
import { Button } from 'react-bootstrap';

const FavoriteRoutes = ({ routes, onManageRoutes, onBookNow, onSchedule }) => {
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Favorite Routes</div>
        <div className="section-actions">
          <Button variant="link" size="sm" onClick={onManageRoutes}>
            Manage Routes
          </Button>
        </div>
      </div>
      <div className="list">
        {routes.map(route => (
          <div key={route.id} className="list-item">
            <div className="item-content">
              <div className="item-title">
                {route.from} to {route.to}
              </div>
              <div className="item-subtitle">{route.address}</div>
              <div className="route-stats">
                <span className="route-stat">
                  <i className="bi bi-clock"></i> Last used {route.lastUsed}
                </span>
                <span className="route-stat">
                  <i className="bi bi-repeat"></i> {route.frequency}
                </span>
                <span className="route-stat">
                  <i className="bi bi-cash"></i> Est. {route.estimatedPrice}
                </span>
              </div>
            </div>
            <div className="route-actions">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onBookNow(route.id)}
              >
                <i className="bi bi-car-front me-1"></i> Book Now
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => onSchedule(route.id)}
              >
                <i className="bi bi-calendar me-1"></i> Schedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRoutes; 