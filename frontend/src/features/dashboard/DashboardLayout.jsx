import React from 'react';
import { Button, Dropdown, ProgressBar } from 'react-bootstrap';
import PageLayout from '../../components/Layout/PageLayout';

const DashboardLayout = () => {
  const stats = [
    { id: 1, icon: 'bi-car-front', label: 'Rides Taken', value: '28', trend: '+3' },
    { id: 2, icon: 'bi-wallet2', label: 'Total Spent', value: '$580', trend: '+$45' },
    { id: 3, icon: 'bi-piggy-bank', label: 'Savings', value: '$120', trend: '+$15' },
    { id: 4, icon: 'bi-map', label: 'Distance', value: '892 km', trend: '+24km' }
  ];

  const activeRides = [
    {
      id: 1,
      from: 'Current Location',
      to: 'Manchester Airport',
      status: 'Driver Arriving',
      timeToArrive: '5 mins',
      driver: {
        name: 'John Smith',
        rating: 4.8,
        car: 'Tesla Model 3',
        plate: 'ABC 123',
        eta: '5 mins'
      }
    }
  ];

  const recentActivity = [
    {
      id: 1,
      icon: 'bi-check-circle',
      title: 'Ride Completed',
      subtitle: 'London to Manchester',
      meta: '2 hours ago',
      amount: '-$45.00'
    },
    {
      id: 2,
      icon: 'bi-ticket-perforated',
      title: 'Promo Applied',
      subtitle: 'SAVE15 - 15% discount',
      meta: '5 hours ago',
      amount: '-$7.50'
    },
    {
      id: 3,
      icon: 'bi-star-fill',
      title: 'Rated Driver',
      subtitle: 'John Smith - 5 stars',
      meta: 'Yesterday'
    }
  ];

  const upcomingRides = [
    {
      id: 1,
      title: 'Manchester to Liverpool',
      subtitle: 'Today, 15:00',
      status: 'Confirmed',
      driver: 'John Smith',
      driverRating: 4.8,
      price: '$35.00',
      carInfo: 'Tesla Model 3 - ABC 123'
    },
    {
      id: 2,
      title: 'Liverpool to Birmingham',
      subtitle: 'Tomorrow, 09:00',
      status: 'Pending',
      estimatedPrice: '$42.00 - $48.00'
    }
  ];

  const favoriteRoutes = [
    { 
      id: 1, 
      from: 'Home', 
      to: 'Office', 
      address: '123 Main St to 456 Business Ave',
      lastUsed: '2 days ago',
      frequency: '15 times this month',
      estimatedPrice: '$25-30'
    },
    { 
      id: 2, 
      from: 'Office', 
      to: 'Gym', 
      address: '456 Business Ave to 789 Fitness St',
      lastUsed: '5 days ago',
      frequency: '8 times this month',
      estimatedPrice: '$15-20'
    }
  ];

  const savedPlaces = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, London',
      icon: 'bi-house'
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Business Ave, London',
      icon: 'bi-building'
    },
    {
      id: 3,
      name: 'Gym',
      address: '789 Fitness St, London',
      icon: 'bi-bicycle'
    }
  ];

  const recentDrivers = [
    {
      id: 1,
      name: 'John Smith',
      rating: 5,
      car: 'Tesla Model 3',
      lastRide: '2 days ago',
      rides: 3,
      languages: ['English', 'Spanish'],
      preferredDriver: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      rating: 4,
      car: 'Toyota Prius',
      lastRide: '1 week ago',
      rides: 2,
      languages: ['English', 'French']
    }
  ];

  const availablePromos = [
    {
      id: 1,
      code: 'SAVE15',
      discount: '15% off',
      expiry: '3 days left',
      description: 'Save 15% on your next ride'
    },
    {
      id: 2,
      code: 'WEEKEND25',
      discount: '25% off',
      expiry: '5 days left',
      description: 'Weekend special discount'
    }
  ];

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-content">
          {/* Header */}
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome back, Ibrahim!</h1>
              <p className="welcome-subtitle">Need a ride? Book your next journey in seconds.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-row">
            {stats.map(stat => (
              <div key={stat.id} className="stat-card">
                <i className={`bi ${stat.icon} stat-icon`}></i>
                <div className="stat-info">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  {stat.trend && (
                    <div className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                      <i className={`bi ${stat.trend.startsWith('+') ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                      {stat.trend}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="main-content">
            {/* Active Ride Section */}
            {activeRides.length > 0 && (
              <div className="section active-ride-section">
                <div className="section-header">
                  <div className="section-title">Active Ride</div>
                  <div className="section-actions">
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-chat-dots me-1"></i>
                      Contact Driver
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </Button>
                  </div>
                </div>
                {activeRides.map(ride => (
                  <div key={ride.id} className="active-ride-card">
                    <div className="ride-status">
                      <div className="status-badge">{ride.status}</div>
                      <div className="eta">Driver arriving in {ride.timeToArrive}</div>
                    </div>
                    <div className="ride-route">
                      <div className="route-point">
                        <i className="bi bi-circle"></i>
                        <span>{ride.from}</span>
                      </div>
                      <div className="route-line"></div>
                      <div className="route-point">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{ride.to}</span>
                      </div>
                    </div>
                    <div className="driver-info">
                      <div className="driver-profile">
                        <i className="bi bi-person-circle"></i>
                        <div className="driver-details">
                          <div className="driver-name">{ride.driver.name}</div>
                          <div className="driver-rating">{ride.driver.rating}★</div>
                        </div>
                      </div>
                      <div className="car-info">
                        <i className="bi bi-car-front"></i>
                        <div className="car-details">
                          <div>{ride.driver.car}</div>
                          <div className="plate-number">{ride.driver.plate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming Rides Section */}
            <div className="section">
              <div className="section-header">
                <div className="section-title">Upcoming Rides</div>
                <div className="section-actions">
                  <Button variant="primary" size="sm">
                    <i className="bi bi-plus-lg me-1"></i>
                    Book Ride
                  </Button>
                </div>
              </div>
              <div className="list">
                {upcomingRides.map(item => (
                  <div key={item.id} className="list-item">
                    <div className="item-content">
                      <div className="item-title">{item.title}</div>
                      <div className="item-subtitle">{item.subtitle}</div>
                      {item.driver && (
                        <div className="ride-details">
                          <span className="ride-info">
                            <i className="bi bi-person"></i> {item.driver} ({item.driverRating}★)
                          </span>
                          <span className="ride-info">
                            <i className="bi bi-car-front"></i> {item.carInfo}
                          </span>
                          <span className="ride-info">
                            <i className="bi bi-cash"></i> {item.price}
                          </span>
                        </div>
                      )}
                      {item.estimatedPrice && (
                        <div className="ride-details">
                          <span className="ride-info">
                            <i className="bi bi-cash"></i> Est. {item.estimatedPrice}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ride-actions">
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-x"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Routes Section */}
            <div className="section">
              <div className="section-header">
                <div className="section-title">Favorite Routes</div>
                <div className="section-actions">
                  <Button variant="link" size="sm">Manage Routes</Button>
                </div>
              </div>
              <div className="list">
                {favoriteRoutes.map(route => (
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
                      <Button variant="primary" size="sm">
                        <i className="bi bi-car-front me-1"></i> Book Now
                      </Button>
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-calendar me-1"></i> Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Promos Section */}
            <div className="section">
              <div className="section-header">
                <div className="section-title">Available Promos</div>
              </div>
              <div className="list">
                {availablePromos.map(promo => (
                  <div key={promo.id} className="list-item promo-item">
                    <div className="item-content">
                      <div className="promo-header">
                        <div className="item-title">{promo.discount}</div>
                        <div className="promo-expiry">{promo.expiry}</div>
                      </div>
                      <div className="item-subtitle">{promo.description}</div>
                      <div className="promo-code">
                        <span className="code">{promo.code}</span>
                        <Button variant="link" size="sm">
                          <i className="bi bi-clipboard"></i> Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Drivers Section */}
            <div className="section">
              <div className="section-header">
                <div className="section-title">Recent Drivers</div>
              </div>
              <div className="list">
                {recentDrivers.map(driver => (
                  <div key={driver.id} className="list-item">
                    <div className="item-content">
                      <div className="review-header">
                        <div className="driver-header">
                          <div className="item-title">
                            {driver.name}
                            {driver.preferredDriver && (
                              <span className="preferred-badge">
                                <i className="bi bi-heart-fill"></i> Preferred
                              </span>
                            )}
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, index) => (
                              <i 
                                key={index}
                                className={`bi bi-star${index < driver.rating ? '-fill' : ''}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="item-subtitle">{driver.car}</div>
                      <div className="driver-stats">
                        <span className="driver-stat">
                          <i className="bi bi-clock"></i> Last ride {driver.lastRide}
                        </span>
                        <span className="driver-stat">
                          <i className="bi bi-car-front"></i> {driver.rides} rides together
                        </span>
                      </div>
                      <div className="driver-languages">
                        <i className="bi bi-translate"></i>
                        {driver.languages.join(', ')}
                      </div>
                    </div>
                    <div className="driver-actions">
                      {!driver.preferredDriver && (
                        <Button variant="outline-primary" size="sm">
                          <i className="bi bi-heart"></i> Add to Preferred
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Places Section */}
            <div className="section">
              <div className="section-header">
                <div className="section-title">Saved Places</div>
                <div className="section-actions">
                  <Button variant="link" size="sm">Add Place</Button>
                </div>
              </div>
              <div className="list">
                {savedPlaces.map(place => (
                  <div key={place.id} className="list-item">
                    <i className={`bi ${place.icon} item-icon`}></i>
                    <div className="item-content">
                      <div className="item-title">{place.name}</div>
                      <div className="item-subtitle">{place.address}</div>
                    </div>
                    <div className="place-actions">
                      <Button variant="primary" size="sm">
                        <i className="bi bi-cursor"></i> Set as Destination
                      </Button>
                      <Button variant="light" size="sm">
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardLayout; 