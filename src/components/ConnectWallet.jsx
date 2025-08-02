import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { BrowserProvider } from 'ethers';
import walletStore from '../store/walletStore';

function ConnectWallet() {
  const { walletAddress, isConnected } = useSnapshot(walletStore);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        walletStore.setWalletAddress(address);
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('MetaMask not found. Please install it.');
    }
  };

  const disconnectWallet = () => {
    walletStore.disconnect();
  };

  const shortenAddress = (addr) =>
    addr.slice(0, 6) + '...' + addr.slice(-4);

  return (
    <div className="nav-right">
      {isConnected ? (
        <button className="btn-secondary" onClick={disconnectWallet}>
          {shortenAddress(walletAddress)}
        </button>
      ) : (
        <button className="btn-primary" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;
