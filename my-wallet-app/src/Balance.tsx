import React from 'react';

interface BalanceProps {
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  return (
    <div>
      <h2>Balance</h2>
      <p>{balance} BTC</p>
    </div>
  );
};

export default Balance;
