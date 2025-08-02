import React, { useState } from 'react';

const TokenIcon = ({ 
  token, 
  size = 'medium', 
  showNetworkIndicator = false,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const sizeClasses = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const getFallbackText = () => {
    if (token.symbol) {
      return token.symbol.charAt(0).toUpperCase();
    }
    if (token.name) {
      return token.name.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getNetworkIndicator = () => {
    if (!showNetworkIndicator) return null;
    
    if (token.symbol?.includes('Base')) {
      return <div className="network-indicator base">B</div>;
    }
    if (token.symbol?.includes('Unichain')) {
      return <div className="network-indicator unichain">U</div>;
    }
    if (token.symbol?.includes('Binance')) {
      return <div className="network-indicator binance">BNB</div>;
    }
    return null;
  };

  return (
    <div className={`token-icon-container ${sizeClass} ${className} ${imageLoading ? 'loading' : ''}`}>
      {token.logoUrl && !imageError ? (
        <img
          src={token.logoUrl}
          alt={token.symbol || token.name}
          className="token-icon"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      ) : null}
      
      {(imageError || !token.logoUrl) && (
        <div className="token-icon-fallback">
          {getFallbackText()}
        </div>
      )}
      
      {getNetworkIndicator()}
    </div>
  );
};

export default TokenIcon; 