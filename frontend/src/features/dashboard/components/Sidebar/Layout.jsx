import React, { useState } from 'react';
import { Nav, Image, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { toast } from 'react-toastify';
import authService from '../../../../features/auth/services/authService';
import './styles.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Get user data with validation
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return null;
      }
      return JSON.parse(userData);
    } catch (error) {
      navigate('/login');
      return null;
    }
  };

  const user = getUserData();

  // If no user data, don't render the sidebar
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    try {
      authService.logout();
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const quickActions = [
    { icon: 'bi-plus-circle', label: 'New Booking', action: () => navigate('/bookings/new') },
    { icon: 'bi-clock-history', label: 'Recent Rides', action: () => navigate('/rides') },
    { icon: 'bi-star', label: 'Favorites', action: () => navigate('/favorites') }
  ];

  const navigationItems = [
    {
      section: 'MAIN',
      items: [
        { 
          path: '/dashboard', 
          icon: 'bi-speedometer2', 
          label: 'Dashboard',
          badge: { text: 'New', variant: 'primary' }
        },
        { 
          path: '/rides', 
          icon: 'bi-car-front', 
          label: 'My Rides',
          badge: { text: '2', variant: 'danger' }
        },
        { 
          path: '/bookings', 
          icon: 'bi-calendar-check', 
          label: 'Bookings',
          badge: { text: '1', variant: 'warning' }
        }
      ]
    },
    {
      section: 'ACCOUNT',
      items: [
        { path: '/profile', icon: 'bi-person', label: 'Profile' },
        { 
          path: '/wallet', 
          icon: 'bi-wallet2', 
          label: 'Wallet',
          badge: { text: '$128', variant: 'success' }
        },
        { path: '/favorites', icon: 'bi-heart', label: 'Favorites' },
        { path: '/settings', icon: 'bi-gear', label: 'Settings' }
      ]
    },
    {
      section: 'SUPPORT',
      items: [
        { path: '/help', icon: 'bi-question-circle', label: 'Help Center' },
        { 
          path: '/messages', 
          icon: 'bi-chat-dots', 
          label: 'Messages',
          badge: { text: '3', variant: 'primary' }
        },
        { path: '/contact', icon: 'bi-telephone', label: 'Contact Us' }
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="brand-link">
          <i className="bi bi-car-front text-primary"></i>
          {!isCollapsed && <span>TravelHub</span>}
        </NavLink>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar-wrapper">
          <Image
            src={user?.profilePicture || 'https://via.placeholder.com/40'}
            roundedCircle
            className="user-avatar"
            alt="Profile"
          />
          <span className="user-status online"></span>
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-role">
              <span className="status-dot"></span>
              Passenger
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions-group">
        {quickActions.map((action, index) => (
          <OverlayTrigger
            key={index}
            placement="right"
            overlay={isCollapsed ? <Tooltip>{action.label}</Tooltip> : <></>}
          >
            <button
              className="quick-action-icon"
              onClick={action.action}
              aria-label={action.label}
            >
              <i className={`bi ${action.icon}`}></i>
              {!isCollapsed && <span>{action.label}</span>}
            </button>
          </OverlayTrigger>
        ))}
      </div>

      <Nav className="sidebar-nav">
        {navigationItems.map((section, index) => (
          <div key={index} className="nav-section">
            {!isCollapsed && (
              <div className="nav-section-title">{section.section}</div>
            )}
            {section.items.map((item, itemIndex) => (
              <OverlayTrigger
                key={itemIndex}
                placement="right"
                overlay={isCollapsed ? <Tooltip>{item.label}</Tooltip> : <></>}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {!isCollapsed && <span>{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <Badge bg={item.badge.variant} className="nav-badge">
                      {item.badge.text}
                    </Badge>
                  )}
                </NavLink>
              </OverlayTrigger>
            ))}
          </div>
        ))}
      </Nav>

      <div className="sidebar-footer">
        <OverlayTrigger
          placement="right"
          overlay={isCollapsed ? <Tooltip>Logout</Tooltip> : <></>}
        >
          <button onClick={handleLogout} className="help-link">
            <i className="bi bi-box-arrow-right"></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </OverlayTrigger>
      </div>
    </aside>
  );
};

export default Sidebar; 