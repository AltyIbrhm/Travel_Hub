import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { fetchUpcomingReservations } from '../../../api/dashboardApi';

const UpcomingReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingReservations();
        setReservations(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading upcoming reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="upcoming-reservations">
        <Card.Header>
          <h5 className="mb-0">Upcoming Reservations</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-center mb-0">Loading...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="upcoming-reservations">
        <Card.Header>
          <h5 className="mb-0">Upcoming Reservations</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-danger text-center mb-0">Error: {error}</p>
        </Card.Body>
      </Card>
    );
  }

  if (!reservations.length) {
    return (
      <Card className="upcoming-reservations">
        <Card.Header>
          <h5 className="mb-0">Upcoming Reservations</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted text-center mb-0">No upcoming reservations</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="upcoming-reservations">
      <Card.Header>
        <h5 className="mb-0">Upcoming Reservations</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{formatDate(reservation.pickupDate)}</td>
                <td>{reservation.pickupLocation}</td>
                <td>{reservation.dropoffLocation}</td>
                <td>
                  <Badge bg={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </td>
                <td>${reservation.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default UpcomingReservations; 