import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const SendCoin: React.FC = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Sending', amount, 'BTC to', address);
    // Add logic to send the transaction here
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="sendCoinAddress">
        <Form.Label>Recipient Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter recipient address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="sendCoinAmount">
        <Form.Label>Amount (BTC)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Send
      </Button>
    </Form>
  );
};

export default SendCoin;
