"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })

        setAddress(accounts[0])
        setChainId(Number.parseInt(chainId, 16))
        setIsConnected(true)
      } else {
        alert("Please install MetaMask or another Web3 wallet")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setChainId(null)
    setIsConnected(false)
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            return window.ethereum.request({ method: "eth_chainId" })
          }
        })
        .then((chainId: string) => {
          if (chainId) {
            setChainId(Number.parseInt(chainId, 16))
          }
        })
        .catch(console.error)

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect, chainId }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}