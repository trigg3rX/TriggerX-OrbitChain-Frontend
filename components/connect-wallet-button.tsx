"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
// Removed lucide-react import to fix module error
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Debug logging
  console.log("ConnectWalletButton render:", { address, isConnected, showDropdown })

  const handleCopyAddress = async () => {
    console.log("Copy address clicked, address:", address)
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
        console.log("Address copied successfully")
      } catch (err) {
        console.error('Failed to copy address:', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = address
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const handleDisconnect = () => {
    console.log("Disconnect clicked")
    setShowDropdown(false)
    disconnect()
  }

  const handleCopyAndClose = () => {
    handleCopyAddress()
    setShowDropdown(false)
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          onClick={() => {
            console.log("Wallet button clicked, toggling dropdown")
            setShowDropdown(!showDropdown)
          }}
          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold border-0"
          size="sm"
        >
          💳 {`${address.slice(0, 6)}...${address.slice(-4)}`} ▼
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-[180px]">
            <button
              onClick={handleCopyAndClose}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              📋 {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              🚪 Disconnect Wallet
            </button>
          </div>
        )}
        
        {/* Click outside to close */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              console.log("Click outside detected, closing dropdown")
              setShowDropdown(false)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <Button
      onClick={connect}
      className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold border-0"
      size="sm"
    >
      💳 Connect Wallet
    </Button>
  )
}
