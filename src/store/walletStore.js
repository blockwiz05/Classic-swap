import { proxy } from 'valtio'

const walletStore = proxy({
  walletAddress: null,
  isConnected: false,
  
  setWalletAddress: (address) => {
    walletStore.walletAddress = address
    walletStore.isConnected = !!address
  },
  
  disconnect: () => {
    walletStore.walletAddress = null
    walletStore.isConnected = false
  }
})

export default walletStore 