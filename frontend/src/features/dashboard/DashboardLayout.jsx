import React from 'react';
import PageLayout from '../../components/Layout/PageLayout';
import StatsCard from './components/StatsCard';
import ActiveRide from './components/ActiveRide';
import UpcomingRides from './components/UpcomingRides';
import RecentActivity from './components/RecentActivity';
import FavoriteRoutes from './components/FavoriteRoutes';
import useStats from './hooks/useStats';
import useRides from './hooks/useRides';
import useActivity from './hooks/useActivity';
import useRoutes from './hooks/useRoutes';

const DashboardLayout = () => {
  const { stats } = useStats();
  const { 
    activeRides, 
    upcomingRides, 
    handleContactDriver, 
    handleCancelRide,
    handleEditRide,
    handleCancelUpcomingRide,
    handleBookRide
  } = useRides();
  const { activities } = useActivity();
  const { 
    favoriteRoutes, 
    handleManageRoutes, 
    handleBookNow, 
    handleSchedule 
  } = useRoutes();

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
              <StatsCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="main-content">
            {/* Active Ride Section */}
            <ActiveRide 
              activeRides={activeRides}
              onContactDriver={handleContactDriver}
              onCancelRide={handleCancelRide}
            />

            {/* Upcoming Rides Section */}
            <UpcomingRides 
              rides={upcomingRides}
              onEdit={handleEditRide}
              onCancel={handleCancelUpcomingRide}
              onBookRide={handleBookRide}
            />

            {/* Recent Activity Section */}
            <RecentActivity activities={activities} />

            {/* Favorite Routes Section */}
            <FavoriteRoutes 
              routes={favoriteRoutes}
              onManageRoutes={handleManageRoutes}
              onBookNow={handleBookNow}
              onSchedule={handleSchedule}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardLayout; 