"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold border-0"
            size="sm"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
          <DropdownMenuItem
            onClick={disconnect}
            className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
          >
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={connect}
      className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-semibold border-0"
      size="sm"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
