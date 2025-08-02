import { useState } from 'react'
import './App.css'

function App() {
  const [sellAmount, setSellAmount] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')

  return (
    <div className="app">
      {/* Background blur elements */}
      <div className="background-blur">
        <div className="blur-circle blur-1"></div>
        <div className="blur-circle blur-2"></div>
        <div className="blur-circle blur-3"></div>
        <div className="blur-circle blur-4"></div>
        <div className="blur-circle blur-5"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-icon">🦄</div>
            <span>Uniswap</span>
          </div>
        </div>
        
        <div className="nav-right">
          <button className="btn-primary">Connect</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="main-headline">Swap anytime, anywhere.</h1>
        
        {/* Swap Interface */}
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
              <button className="swap-direction-btn">
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

        {/* Description */}
        <p className="description">
          The largest onchain marketplace. Buy and sell crypto on Ethereum and 12+ other chains.
        </p>
      </main>
    </div>
  )
}

export default App
