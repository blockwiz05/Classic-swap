import React, { useState, useEffect } from 'react';
import TokenIcon from './TokenIcon';

const TokenSelector = ({ 
  isOpen, 
  onClose, 
  onSelectToken, 
  tokens, 
  selectedToken,
  title = "Select a token" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);

  // Filter tokens based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTokens(tokens);
    } else {
      const filtered = tokens.filter(token =>
        token.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [searchTerm, tokens]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle token selection
  const handleTokenSelect = (token) => {
    onSelectToken(token);
    onClose();
    setSearchTerm('');
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen || !tokens) return null;

  return (
    <div className="token-selector-overlay" onClick={handleBackdropClick}>
      <div className="token-selector-modal">
        {/* Header */}
        <div className="token-selector-header">
          <h2 className="token-selector-title">{title}</h2>
          <button className="token-selector-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="token-selector-search">
          <div className="search-input-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search tokens"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>
        </div>

        {/* Token List */}
        <div className="token-selector-content">
          
          <div className="token-list">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <div
                  key={token.address}
                  className={`token-item ${selectedToken?.address === token.address ? 'selected' : ''}`}
                  onClick={() => handleTokenSelect(token)}
                >
                  <div className="token-info">
                    <TokenIcon 
                      token={token} 
                      size="medium" 
                      showNetworkIndicator={true}
                    />
                    <div className="token-details">
                      <div className="token-symbol">{token.symbol}</div>
                      <div className="token-name">
                        {token.name !== token.symbol ? token.name : ''}
                        {token.name === token.symbol ? token.symbol : ''} {formatAddress(token.address)}
                      </div>
                    </div>
                  </div>
                  <div className="token-balance">
                    {/* Balance would be displayed here if available */}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tokens-found">
                <div className="no-tokens-icon">🔍</div>
                <div className="no-tokens-text">No tokens found</div>
                <div className="no-tokens-subtext">Try adjusting your search</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSelector; 