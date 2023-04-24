import React from 'react';

interface TransactionHistoryProps {
  transactions: string[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>{tx}</li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory
