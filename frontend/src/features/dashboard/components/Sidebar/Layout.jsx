import React, { useState } from 'react';
import { Nav, Image } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../shared/hooks/useAuth';
import './styles.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Toggle Button */}
      <button 
        className="collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>

      {/* Logo and Brand */}
      <div className="sidebar-header">
        <NavLink to="/" className="brand-link">
          <i className="bi bi-car-front text-primary"></i>
          {!isCollapsed && <span>TravelHub</span>}
        </NavLink>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-user">
        <Image
          src={user?.profilePicture || 'https://via.placeholder.com/32'}
          roundedCircle
          className="user-avatar"
          alt="Profile"
        />
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-role">Passenger</div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <Nav className="sidebar-nav">
        {/* Main Section */}
        <div className="nav-section">
          {!isCollapsed && <div className="nav-section-title">MAIN</div>}
          <Nav.Item>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Dashboard">
              <i className="bi bi-speedometer2"></i>
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/reservations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="My Reservations">
              <i className="bi bi-calendar-check"></i>
              {!isCollapsed && <span>My Reservations</span>}
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/rides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="My Rides">
              <i className="bi bi-car-front"></i>
              {!isCollapsed && <span>My Rides</span>}
            </NavLink>
          </Nav.Item>
        </div>

        {/* Account Section */}
        <div className="nav-section">
          {!isCollapsed && <div className="nav-section-title">ACCOUNT</div>}
          <Nav.Item>
            <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Payments">
              <i className="bi bi-credit-card"></i>
              {!isCollapsed && <span>Payments</span>}
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Notifications">
              <i className="bi bi-bell"></i>
              {!isCollapsed && <span>Notifications</span>}
              <span className="notification-badge">2</span>
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Profile">
              <i className="bi bi-person"></i>
              {!isCollapsed && <span>Profile</span>}
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title="Settings">
              <i className="bi bi-gear"></i>
              {!isCollapsed && <span>Settings</span>}
            </NavLink>
          </Nav.Item>
        </div>
      </Nav>

      {/* Help Center Link */}
      <div className="sidebar-footer">
        <NavLink to="/help" className="help-link" title="Help Center">
          <i className="bi bi-question-circle"></i>
          {!isCollapsed && <span>Help Center</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar; 