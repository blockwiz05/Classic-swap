import ConnectWallet from './ConnectWallet'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <span>1Dash</span>
        </div>
      </div>
      
      <ConnectWallet />
    </nav>
  )
}

export default Navbar 