import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';

const RecentActivity = ({ activity }) => {
  if (!activity?.length) {
    return (
      <Card className="recent-activity">
        <Card.Header>
          <h5 className="mb-0">Recent Activity</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted text-center mb-0">No recent activity</p>
        </Card.Body>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="recent-activity">
      <Card.Header>
        <h5 className="mb-0">Recent Activity</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {activity.map((item) => (
          <ListGroup.Item key={item.id}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1 text-primary">{item.description}</p>
                <small className="text-muted">
                  {formatDate(item.time)}
                </small>
              </div>
              <span className={`badge bg-${getStatusColor(item.status)}`}>
                ${item.amount}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

RecentActivity.propTypes = {
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      time: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })
  )
};

export default RecentActivity; 