import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './context/SidebarContext';
import { useProfile } from '../../features/profile/context/ProfileContext';
import '../../styles/components/_sidebar.css';

const SidebarLayout = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { profile, loading, getProfilePictureUrl } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const mainMenuItems = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/dashboard',
      badge: 'New'
    },
    {
      label: 'Book Ride',
      icon: 'bi-plus-circle',
      path: '/book-ride',
      badge: 'New'
    }
  ];

  const rideMenuItems = [
    {
      label: 'My Rides',
      icon: 'bi-car-front',
      path: '/my-rides',
      badge: '2'
    },
    {
      label: 'Bookings',
      icon: 'bi-calendar-check',
      path: '/bookings',
      badge: '1'
    }
  ];

  const accountMenuItems = [
    {
      label: 'Profile',
      icon: 'bi-person',
      path: '/profile'
    },
    {
      label: 'Wallet',
      icon: 'bi-wallet2',
      path: '/wallet',
      badge: '$128'
    },
    {
      label: 'Favorites',
      icon: 'bi-heart',
      path: '/favorites'
    },
    {
      label: 'Settings',
      icon: 'bi-gear',
      path: '/settings'
    }
  ];

  const supportMenuItems = [
    {
      label: 'Help Center',
      icon: 'bi-question-circle',
      path: '/help'
    },
    {
      label: 'Messages',
      icon: 'bi-chat-left-text',
      path: '/messages',
      badge: '3'
    },
    {
      label: 'Contact Us',
      icon: 'bi-telephone',
      path: '/contact'
    },
    {
      label: 'Logout',
      icon: 'bi-box-arrow-right',
      onClick: handleLogout
    }
  ];

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    if (item.onClick) {
      return (
        <button
          key={item.label}
          onClick={item.onClick}
          className={`sidebar-item ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span className="sidebar-text">{item.label}</span>
          {item.badge && <span className="sidebar-badge">{item.badge}</span>}
        </button>
      );
    }
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`sidebar-item ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${item.icon}`}></i>
        <span className="sidebar-text">{item.label}</span>
        {item.badge && <span className="sidebar-badge">{item.badge}</span>}
      </Link>
    );
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="brand">
          <i className="bi bi-car-front brand-icon"></i>
          <span className="brand-text">TravelHub</span>
        </Link>
        <button className="collapse-btn" onClick={toggleSidebar}>
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="user-info">
          <img 
            src={getProfilePictureUrl(profile?.avatar)} 
            alt={profile?.name?.first || 'User'} 
            className="user-avatar" 
          />
          <div className="user-details">
            <span className="user-name">
              {loading ? 'Loading...' : profile?.name ? `${profile.name.first || ''} ${profile.name.last || ''}` : 'Guest'}
            </span>
            <span className="user-role">Passenger</span>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-label">MAIN</div>
          {mainMenuItems.map(renderMenuItem)}
        </div>

        <div className="menu-section">
          <div className="menu-label">RIDES</div>
          {rideMenuItems.map(renderMenuItem)}
        </div>

        <div className="menu-section">
          <div className="menu-label">ACCOUNT</div>
          {accountMenuItems.map(renderMenuItem)}
        </div>

        <div className="menu-section">
          <div className="menu-label">SUPPORT</div>
          {supportMenuItems.map(renderMenuItem)}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout; 