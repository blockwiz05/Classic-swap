import { useState } from 'react'

function SwapInterface() {
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')

  const handleSwapDirection = () => {
    // Swap the amounts
    setSellAmount(buyAmount)
    setBuyAmount(sellAmount)
  }

  return (
    <div className="swap-container">
      <div className="swap-card">
        {/* Sell Section */}
        <div className="swap-section">
          <label className="swap-label">Sell</label>
          <div className="swap-input-container">
            <div className="swap-input-group">
              <input
                type="number"
                placeholder="0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="swap-input"
              />
              <div className="swap-value">$0</div>
            </div>
            <button className="token-selector">
              <div className="token-icon">⚡</div>
              <span>{selectedToken}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="swap-direction">
          <button className="swap-direction-btn" onClick={handleSwapDirection}>
            <span className="direction-arrow">↓</span>
          </button>
        </div>

        {/* Buy Section */}
        <div className="swap-section">
          <label className="swap-label">Buy</label>
          <div className="swap-input-container">
            <div className="swap-input-group">
              <input
                type="number"
                placeholder="0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="swap-input"
              />
            </div>
            <button className="token-selector select-token">
              <span>Select token</span>
              <span className="dropdown-arrow">▼</span>
            </button>
          </div>
        </div>

        {/* Get Started Button */}
        <button className="get-started-btn">
          Get started
        </button>
      </div>
    </div>
  )
}

export default SwapInterface 