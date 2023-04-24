import React, { useEffect, useState } from 'react';
import './App.css';
import Balance from './Balance';
import TransactionHistory from './TransactionHistory';
import Address from './Address';
import { Tabs, Tab } from 'react-bootstrap';
import WalletInfo from './components/WalletInfo';
import SendCoin from './components/SendCoin';
import { Transaction } from './types/Transaction';

const ipc = (window as any).ipc;

function App() {
  const [walletInfo, setWalletInfo] = useState<{
    balance: number;
    address: string;
    transactions: Transaction[];
  } | null>(null);

  useEffect(() => {
    ipc.invoke('fetch-wallet-info').then(
      (data: any) => setWalletInfo(data),
      (error: any) => console.error(`Error fetching wallet info: ${error}`)
    );
  }, []);

  if (!walletInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
    <Tabs defaultActiveKey="walletInfo" id="wallet-tabs">
      <Tab eventKey="walletInfo" title="Wallet Info">
        <WalletInfo walletData={walletInfo} />
      </Tab>
      <Tab eventKey="sendCoin" title="Send Coin">
        <SendCoin />
      </Tab>
    </Tabs>
  </div>

  );
}

export default App;
