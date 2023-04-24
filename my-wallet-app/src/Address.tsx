import React, { useState } from 'react';

interface AddressProps {
  address: string;
}

const Address: React.FC<AddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h2>Address</h2>
      <p>{address}</p>
      <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Address'}</button>
    </div>
  );
};

export default Address;
