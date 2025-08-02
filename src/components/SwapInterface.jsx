import React, { useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import axios from 'axios';
import Web3 from 'web3';
import walletStore from '../store/walletStore';
import TokenSelector from './TokenSelector';
import { message } from 'antd';

const SwapInterface = () => {
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [sellToken, setSellToken] = useState({
    symbol: 'ETH',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
  });
  const [buyToken, setBuyToken] = useState({
    symbol: 'USDC',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  });
  const [tokens, setTokens] = useState([]);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSellTokenSelector, setShowSellTokenSelector] = useState(false);
  const [showBuyTokenSelector, setShowBuyTokenSelector] = useState(false);
  const snap = useSnapshot(walletStore);

  // Fetch token list from 1inch API
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tokens'); // Local server endpoint
        const tokenList = Object.values(response.data.tokens).map((token) => ({
          symbol: token.symbol,
          address: token.address,
          decimals: token.decimals,
          name: token.name,
        }));
        console.log("response", response.data,"and",tokenList);
        setTokens(tokenList);
      } catch (err) {
        setError('Failed to fetch tokens');
      }
    };
    fetchTokens();
  }, []);
  

  // Fetch price quote when sell amount or tokens change
  useEffect(() => {
    if (sellAmount && parseFloat(sellAmount) > 0 && snap.isConnected) {
      const fetchQuote = async () => {
        setLoading(true);
        try {
          const amountInWei = Web3.utils.toWei(
            sellAmount,
            sellToken.decimals === 18 ? 'ether' : 'mwei'
          );
          const response = await axios.get('http://localhost:3001/quote', {
            params: {
              src: sellToken.address,
              dst: buyToken.address,
              amount: amountInWei,
            },
          });
          console.log("response quote", response.data);
  
          const quote = response.data;

          const toAmount = Number(quote.dstAmount) / Math.pow(10, quote.dstToken.decimals);
          setBuyAmount(toAmount.toFixed(6));
          
          const price = toAmount / (Number(amount) / Math.pow(10, quote.srcToken.decimals));
          setPrice(price.toFixed(6));
          
        } catch (err) {
          setError('Failed to fetch quote');
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    } else {
      setBuyAmount('');
      setPrice(null);
    }
  }, [sellAmount, sellToken, buyToken, snap.isConnected]);
  

  // Handle swap execution
  const handleSwap = async () => {

    if (!snap.isConnected) {
      setError('Wallet not connected');
      messageApi.error('Wallet not connected');

      return;
    }
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      setError('Enter a valid amount');
      messageApi.error('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const web3 = new Web3(window.ethereum);
      const amountInWei = Web3.utils.toWei(sellAmount, sellToken.decimals === 18 ? 'ether' : 'mwei');

      const response = await axios.get('http://localhost:3001/swap', {
        params: {
          src: sellToken.address,
          dst: buyToken.address,
          amount: amountInWei,
          from: snap.walletAddress,
          slippage: 1,
        }
      });

      const tx = {
        from: snap.walletAddress,
        to: response.data.tx.to,
        data: response.data.tx.data,
        gas: response.data.tx.gas,
        gasPrice: response.data.tx.gasPrice,
      };
      await web3.eth.sendTransaction(tx);
      messageApi.success('Swap successful!');
      setSellAmount('');
      setBuyAmount('');
    } catch (err) {
      setError('Swap failed: ' + err.message);
      console.log("error", err);
      messageApi.error('Swap failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle swap direction
  const handleSwapDirection = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellAmount(buyAmount);
    setBuyAmount(sellAmount);
  };

  // Handle token selection
  const handleSellTokenSelect = (token) => {
    setSellToken(token);
  };

  const handleBuyTokenSelect = (token) => {
    setBuyToken(token);
  };

  return (
    <>
    {contextHolder}
    <div className="swap-interface-container">
      <div className="swap-card">
        {/* Header */}
        <div className="swap-header">
          <h2 className="swap-title">Swap Tokens</h2>
          <div className="swap-subtitle">Trade tokens instantly with 1inch</div>
        </div>

        {/* Sell Section */}
        <div className="swap-section sell-section">
          <div className="section-header">
            <span className="section-label">You Pay</span>
            <span className="section-balance">Balance: 0.00</span>
          </div>
          <div className="token-input-container">
            <div className="amount-input-group">
              <input
                type="number"
                placeholder="0.0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="amount-input"
              />
              <div className="usd-value">≈ $0.00</div>
            </div>
            <div className="token-selector-container">
              <button 
                className="token-selector-btn"
                onClick={() => setShowSellTokenSelector(true)}
              >
                <div className="token-icon">
                  {sellToken.logoURI ? (
                    <img 
                      src={sellToken.logoURI} 
                      alt={sellToken.symbol}
                      className="token-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="token-icon-fallback">⚡</div>
                </div>
                <span className="token-symbol">{sellToken.symbol}</span>
                <div className="token-arrow">▼</div>
              </button>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="swap-direction-container">
          <button
            className="swap-direction-btn"
            onClick={handleSwapDirection}
            disabled={loading}
          >
            <div className="direction-icon">↓</div>
          </button>
        </div>

        {/* Buy Section */}
        <div className="swap-section buy-section">
          <div className="section-header">
            <span className="section-label">You Receive</span>
            <span className="section-balance">Balance: 0.00</span>
          </div>
          <div className="token-input-container">
            <div className="amount-input-group">
              <input
                type="number"
                placeholder="0.0"
                value={buyAmount}
                readOnly
                className="amount-input readonly"
              />
              <div className="usd-value">≈ $0.00</div>
            </div>
            <div className="token-selector-container">
              <button 
                className="token-selector-btn"
                onClick={() => setShowBuyTokenSelector(true)}
              >
                <div className="token-icon">
                  {buyToken.logoURI ? (
                    <img 
                      src={buyToken.logoURI} 
                      alt={buyToken.symbol}
                      className="token-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="token-icon-fallback">💎</div>
                </div>
                <span className="token-symbol">{buyToken.symbol}</span>
                <div className="token-arrow">▼</div>
              </button>
            </div>
          </div>
        </div>

        {/* Price Info */}
        {price && (
          <div className="price-info">
            <div className="price-row">
              <span className="price-label">Rate</span>
              <span className="price-value">
                1 {sellToken.symbol} = {(price * Math.pow(10, sellToken.decimals - buyToken.decimals)).toFixed(6)} {buyToken.symbol}
              </span>
            </div>
            <div className="price-row">
              <span className="price-label">Slippage</span>
              <span className="price-value">1%</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {/* {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <span className="error-text">{error}</span>
          </div>
        )} */}

        {/* Swap Button */}
        <div className="swap-button-container">
          <button
            onClick={handleSwap}
            disabled={loading || !snap.isConnected || !sellAmount}
            className="swap-button"
            title={
              loading 
                ? "Processing swap..." 
                : !snap.isConnected 
                ? "Please connect wallet first" 
                : !sellAmount 
                ? "Please enter an amount to swap" 
                : "Click to execute swap"
            }
          >
            {loading ? (
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <span>Processing...</span>
              </div>
            ) : !snap.isConnected ? (
              'First Connect Wallet'
            ) : (
              'Swap'
            )}
          </button>
          
          {/* Hover Tooltip */}
          <div className="swap-button-tooltip">
            {loading 
              ? "Processing swap..." 
              : !snap.isConnected 
              ? "Please connect wallet first" 
              : !sellAmount 
              ? "Please enter an amount to swap" 
              : "Click to execute swap"
            }
          </div>
        </div>
      </div>

      {/* Token Selector Modals */}
      <TokenSelector
        isOpen={showSellTokenSelector}
        onClose={() => setShowSellTokenSelector(false)}
        onSelectToken={handleSellTokenSelect}
        tokens={tokens}
        selectedToken={sellToken}
        title="Select a token to sell"
      />
      
      <TokenSelector
        isOpen={showBuyTokenSelector}
        onClose={() => setShowBuyTokenSelector(false)}
        onSelectToken={handleBuyTokenSelect}
        tokens={tokens}
        selectedToken={buyToken}
        title="Select a token to buy"
      />
    </div>
    </>
  );
};

export default SwapInterface;