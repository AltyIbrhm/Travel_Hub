import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import './styles.css';

const Payments = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'credit_card',
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2024,
      isDefault: true
    },
    {
      id: 2,
      type: 'credit_card',
      brand: 'Mastercard',
      last4: '8888',
      expMonth: 8,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2024-01-10',
      time: '11:00 AM',
      amount: 55.00,
      status: 'completed',
      description: 'Ride from Airport Terminal 2 to Downtown Hotel',
      paymentMethod: 'Visa •••• 4242'
    },
    {
      id: 2,
      date: '2024-01-12',
      time: '02:30 PM',
      amount: 35.00,
      status: 'completed',
      description: 'Ride from Hotel Grand to Shopping Mall',
      paymentMethod: 'Mastercard •••• 8888'
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    name: ''
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger'
    };
    return <Badge bg={statusStyles[status]}>{status}</Badge>;
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  const handleDeleteCard = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to add the card
    setShowAddCard(false);
  };

  return (
    <Container fluid className="payments-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Payments</h1>
        </Col>
      </Row>

      {/* Payment Methods Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Payment Methods</h5>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddCard(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add New Card
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                {paymentMethods.map(method => (
                  <Col md={6} key={method.id} className="mb-3">
                    <Card className="payment-method-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="card-info">
                            <div className="card-brand">
                              <i className={`bi bi-${method.brand.toLowerCase()}`}></i>
                              {method.brand}
                            </div>
                            <div className="card-number">
                              •••• •••• •••• {method.last4}
                            </div>
                            <div className="card-expiry text-muted">
                              Expires {method.expMonth}/{method.expYear}
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge bg="success" className="default-badge">Default</Badge>
                          )}
                        </div>
                        <div className="card-actions mt-3">
                          {!method.isDefault && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteCard(method.id)}
                            className="ms-2"
                          >
                            Remove
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction History Section */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Transaction History</h5>
            </Card.Header>
            <Card.Body>
              {transactions.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{transaction.description}</h6>
                      <div className="text-muted small">
                        {transaction.date} • {transaction.time}
                      </div>
                      <div className="text-muted small">
                        Paid with {transaction.paymentMethod}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="transaction-amount">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Card Modal */}
      <Modal show={showAddCard} onHide={() => setShowAddCard(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCard}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Expiration Month</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM"
                    value={newCard.expMonth}
                    onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Expiration Year</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="YYYY"
                    value={newCard.expYear}
                    onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Add Card
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Payments; 