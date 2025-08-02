import './App.css'
import Navbar from './components/Navbar'
import SwapInterface from './components/SwapInterface'

function App() {
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
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        <h1 className="main-headline">Swap anytime, anywhere.</h1>
        
        {/* Swap Interface */}
        <SwapInterface />

        {/* Description */}
        <p className="description">
          The largest onchain marketplace. Buy and sell crypto on Ethereum and 12+ other chains.
        </p>
      </main>
    </div>
  )
}

export default App
