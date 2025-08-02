import { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';

function ConnectWallet({ onWalletConnected }) {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum); // ✅ Correct for ethers v6
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setWalletAddress(address);
        onWalletConnected(address);
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('MetaMask not found. Please install it.');
    }
  };

  const shortenAddress = (addr) =>
    addr.slice(0, 6) + '...' + addr.slice(-4);

  return (
    <button className="btn-primary" onClick={connectWallet}>
      {walletAddress ? shortenAddress(walletAddress) : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWallet;
