import React, { useState } from 'react';
import { Form, Button, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaCamera, FaCreditCard, FaHistory, FaPhone, FaMapMarkerAlt, FaCar, FaBell, FaStar, FaRoute, FaDollarSign } from 'react-icons/fa';

const ProfileLayout = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'Passenger',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
    preferredPayment: user?.preferredPayment || 'Credit Card',
    language: user?.language || 'English'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const stats = [
    { label: 'Total Rides', value: '28', icon: <FaCar /> },
    { label: 'Completed', value: '25', icon: <FaHistory /> },
    { label: 'Cancelled', value: '3', icon: <FaBell /> },
    { label: 'Rating', value: '4.8', icon: <FaStar /> },
    { label: 'Total Distance', value: '423 km', icon: <FaRoute /> },
    { label: 'Total Savings', value: '$142', icon: <FaDollarSign /> }
  ];

  const recentActivity = [
    { type: 'Ride', description: 'Completed ride to Downtown', date: '2024-01-15', amount: '$25' },
    { type: 'Payment', description: 'Added new payment method', date: '2024-01-14', amount: '-' },
    { type: 'Ride', description: 'Scheduled ride to Airport', date: '2024-01-13', amount: '$45' },
    { type: 'Profile', description: 'Updated profile information', date: '2024-01-12', amount: '-' }
  ];

  const favoriteLocations = [
    { name: 'Home', address: '123 Main St, City', type: 'home' },
    { name: 'Work', address: '456 Office Ave, City', type: 'work' },
    { name: 'Gym', address: '789 Fitness Blvd, City', type: 'other' }
  ];

  return (
    <div className="profile-content">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={user?.profilePicture || 'https://via.placeholder.com/120'}
            alt="Profile"
            className="profile-avatar"
          />
          <button className="profile-avatar-upload">
            <FaCamera />
          </button>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{`${formData.firstName} ${formData.lastName}`}</h1>
          <div className="profile-role">
            <span className="profile-status"></span>
            {formData.role}
          </div>
          <div className="profile-badges">
            <Badge bg="primary">Verified User</Badge>
            <Badge bg="success">Premium Member</Badge>
            <Badge bg="warning">Top Rider</Badge>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-body">
        <Tabs defaultActiveKey="personal" className="profile-tabs">
          <Tab eventKey="personal" title="Personal Information">
            <div className="profile-section">
              <Form onSubmit={handleSubmit}>
                <div className="profile-form-row">
                  <Form.Group className="profile-form-group">
                    <label className="profile-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </Form.Group>

                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </Form.Group>
                </div>

                <div className="profile-form-row">
                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="profile-input"
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="profile-input"
                      placeholder="e.g., (555) 123-4567"
                    />
                  </Form.Group>
                </div>

                <div className="profile-form-row">
                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </Form.Group>

                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="profile-input"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </Form.Group>
                </div>

                <Form.Group className="profile-form-group">
                  <label className="profile-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Enter your address"
                  />
                </Form.Group>

                <Button type="submit" className="profile-save-btn">
                  Save Changes
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="emergency" title="Emergency Contact">
            <div className="profile-section">
              <Form>
                <div className="profile-form-row">
                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </Form.Group>

                  <Form.Group className="profile-form-group">
                    <label className="profile-label">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  </Form.Group>
                </div>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="payment" title="Payment Methods">
            <div className="profile-section">
              <div className="payment-methods">
                <div className="payment-method-card">
                  <FaCreditCard className="payment-icon" />
                  <div className="payment-details">
                    <h3>Credit Card</h3>
                    <p>**** **** **** 4589</p>
                    <Badge bg="success">Primary</Badge>
                  </div>
                </div>
                <Button className="add-payment-btn">Add Payment Method</Button>
              </div>
            </div>
          </Tab>

          <Tab eventKey="locations" title="Favorite Locations">
            <div className="profile-section">
              <div className="favorite-locations">
                {favoriteLocations.map((location, index) => (
                  <div key={index} className="location-card">
                    <FaMapMarkerAlt className="location-icon" />
                    <div className="location-details">
                      <h3>{location.name}</h3>
                      <p>{location.address}</p>
                      <Badge bg="info">{location.type}</Badge>
                    </div>
                  </div>
                ))}
                <Button className="add-location-btn">Add Location</Button>
              </div>
            </div>
          </Tab>
        </Tabs>

        {/* Profile Stats */}
        <div className="profile-section">
          <h2 className="profile-section-title">Statistics</h2>
          <div className="profile-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="profile-section">
          <h2 className="profile-section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'Ride' ? <FaCar /> : 
                   activity.type === 'Payment' ? <FaCreditCard /> : 
                   <FaHistory />}
                </div>
                <div className="activity-details">
                  <h4>{activity.description}</h4>
                  <p>{activity.date}</p>
                </div>
                <div className="activity-amount">{activity.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 