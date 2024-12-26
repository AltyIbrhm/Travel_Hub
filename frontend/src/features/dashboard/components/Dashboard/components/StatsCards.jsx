import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';
import { Calendar, CheckCircle, Clock } from 'react-bootstrap-icons';

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Reservations',
      value: stats.totalReservations,
      icon: <Calendar className="stats-icon" />,
      color: 'primary'
    },
    {
      title: 'Upcoming Reservations',
      value: stats.upcomingReservations,
      icon: <Clock className="stats-icon" />,
      color: 'warning'
    },
    {
      title: 'Completed Reservations',
      value: stats.completedReservations,
      icon: <CheckCircle className="stats-icon" />,
      color: 'success'
    }
  ];

  return (
    <Row>
      {cards.map((card, index) => (
        <Col key={index} md={4} className="mb-4">
          <Card className={`stats-card border-${card.color}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="stats-title text-muted mb-1">{card.title}</h6>
                  <h3 className="stats-value mb-0">{card.value}</h3>
                </div>
                <div className={`stats-icon-wrapper bg-${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

StatsCards.propTypes = {
  stats: PropTypes.shape({
    totalReservations: PropTypes.number,
    upcomingReservations: PropTypes.number,
    completedReservations: PropTypes.number
  })
};

export default StatsCards; 