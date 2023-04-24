// src/components/WalletInfo.tsx
import React from 'react';
import { Transaction } from '../types/Transaction';

interface WalletInfoProps {
  walletData: {
    balance: number;
    address: string;
    transactions: Transaction[]; // You can replace 'any' with a more specific type for your transactions
  };
}

const WalletInfo: React.FC<WalletInfoProps> = ({ walletData }) => {
  const { balance, address, transactions } = walletData;

  const formatSatoshiToBTC = (satoshi: number) => {
    return satoshi / 1e8;
  };

  return (
    <div>
      <h2>Wallet Info</h2>
      <div>
        <h4>Balance</h4>
        <p>{formatSatoshiToBTC(balance)} BTC</p>
      </div>
      <div>
        <h4>Address</h4>
        <p>{address}</p>
        <button onClick={() => navigator.clipboard.writeText(address)}>
          Copy Address
        </button>
      </div>
      <div>
        <h4>Transaction History</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Address</th>
              <th>Amount (BTC)</th>
              <th>Confirmations</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{new Date(tx.time * 1000).toLocaleString()}</td>
                <td>{tx.address}</td>
                <td>{formatSatoshiToBTC(tx.amount)}</td>
                <td>{tx.confirmations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletInfo;
