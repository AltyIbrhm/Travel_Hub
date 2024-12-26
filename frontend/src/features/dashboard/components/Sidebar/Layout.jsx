import React from 'react';
import { Nav, Image } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import './styles.css';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onToggle === 'function') {
      onToggle();
    }
  };

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
        { path: '/rides', icon: 'bi-car-front', label: 'My Rides' },
        { path: '/bookings', icon: 'bi-calendar-check', label: 'Bookings' }
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/profile', icon: 'bi-person', label: 'Profile' },
        { path: '/settings', icon: 'bi-gear', label: 'Settings' },
        { path: '/wallet', icon: 'bi-wallet2', label: 'Wallet' }
      ]
    },
    {
      section: 'Support',
      items: [
        { path: '/help', icon: 'bi-question-circle', label: 'Help Center' },
        { path: '/contact', icon: 'bi-chat-dots', label: 'Contact Us' }
      ]
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-button"
        onClick={handleClick}
        type="button"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>

      {/* Logo and Brand */}
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="brand-link">
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

      {/* Navigation Sections */}
      <Nav className="sidebar-nav">
        {navigationItems.map((section, index) => (
          <div key={index} className="nav-section">
            {!isCollapsed && (
              <div className="nav-section-title">{section.section}</div>
            )}
            {section.items.map((item, itemIndex) => (
              <NavLink
                key={itemIndex}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <i className={`bi ${item.icon}`}></i>
                {!isCollapsed && <span>{item.label}</span>}
                {item.path === '/rides' && !isCollapsed && (
                  <span className="notification-badge">2</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </Nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <NavLink to="/logout" className="help-link">
          <i className="bi bi-box-arrow-right"></i>
          {!isCollapsed && <span>Logout</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar; 