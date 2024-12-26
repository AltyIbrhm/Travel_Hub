import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../../../components/ThemeToggle';
import './styles.css';

const NavbarLayout = ({ user, onLogout, imageKey }) => {
  const renderProfilePicture = () => {
    if (user?.profilePicture) {
      return (
        <img
          src={`http://localhost:5000${user.profilePicture}?${imageKey}`}
          alt="Profile"
          className="nav-profile-picture"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23dee2e6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%23495057">${user.firstName?.charAt(0) || 'U'}</text></svg>`;
          }}
        />
      );
    } else {
      return (
        <div className="nav-profile-picture-placeholder">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
      );
    }
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="brand-custom">TransportApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link as={Link} to="/reservations" className="nav-link-custom">
                Reservations
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {user && (
              <>
                <ThemeToggle className="me-3" />
                <NavDropdown 
                  title={
                    <div className="nav-profile">
                      {renderProfilePicture()}
                      <span className="nav-user-name">{user.firstName}</span>
                    </div>
                  }
                  id="basic-nav-dropdown"
                  align="end"
                  className="nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                    <div className="dropdown-item-content">
                      <i className="bi bi-person"></i>
                      <span>Profile</span>
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings" className="dropdown-item-custom">
                    <div className="dropdown-item-content">
                      <i className="bi bi-gear"></i>
                      <span>Settings</span>
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout} className="dropdown-item-custom logout">
                    <div className="dropdown-item-content">
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarLayout; 