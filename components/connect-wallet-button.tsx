"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/wallet-context";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";
// Removed lucide-react import to fix module error
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Supported chains configuration
const SUPPORTED_CHAINS = {
  1: { name: "Ethereum", symbol: "ETH", explorer: "https://etherscan.io" },
  42161: {
    name: "Arbitrum One",
    symbol: "ETH",
    explorer: "https://arbiscan.io",
  },
  421614: {
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    explorer: "https://sepolia.arbiscan.io",
  },
  137: {
    name: "Polygon",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
  },
  80001: {
    name: "Polygon Mumbai",
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
  },
} as const;

// Default supported chain (you can change this to your preferred chain)
const DEFAULT_CHAIN_ID = 42161; // Arbitrum One

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect, chainId } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);

  // Check if current chain is supported
  const isWrongChain =
    chainId && !SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS];
  const currentChain = chainId
    ? SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS]
    : null;

  // Debug logging
  console.log("ConnectWalletButton render:", {
    address,
    isConnected,
    showDropdown,
  });

  const handleCopyAddress = async () => {
    console.log("Copy address clicked, address:", address);
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        console.log("Address copied successfully");
      } catch (err) {
        console.error("Failed to copy address:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDisconnect = () => {
    console.log("Disconnect clicked");
    setShowDropdown(false);
    disconnect();
  };

  const handleCopyAndClose = () => {
    handleCopyAddress();
    setShowDropdown(false);
  };

  const switchToSupportedChain = async () => {
    if (!window.ethereum) return;

    setIsSwitchingChain(true);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain doesn't exist, try to add it
      if (error.code === 4902) {
        try {
          const chainConfig =
            SUPPORTED_CHAINS[DEFAULT_CHAIN_ID as keyof typeof SUPPORTED_CHAINS];
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}`,
                chainName: chainConfig.name,
                nativeCurrency: {
                  name: chainConfig.symbol,
                  symbol: chainConfig.symbol,
                  decimals: 18,
                },
                rpcUrls: ["https://arb1.arbitrum.io/rpc"], // You can customize this
                blockExplorerUrls: [chainConfig.explorer],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add chain:", addError);
        }
      } else {
        console.error("Failed to switch chain:", error);
      }
    } finally {
      setIsSwitchingChain(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        {/* Wrong Chain Warning */}
        {isWrongChain && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap z-50 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Wrong Network
          </div>
        )}

        <button
          onClick={() => {
            console.log("Wallet button clicked, toggling dropdown");
            setShowDropdown(!showDropdown);
          }}
          className={`relative text-[#000000] px-6 py-2 sm:px-8 sm:py-3 lg:px-6 xl:px-8 rounded-lg group transition-transform ${
            isWrongChain ? "ring-2 ring-red-500 ring-opacity-50" : ""
          }`}
        >
          <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
          <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
          <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
            {`${address.slice(0, 6)}...${address.slice(-4)}`} ▼{" "}
          </span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 bg-[#0a0a0a] border border-[#FFFFFF80]/20 shadow-2xl rounded-lg z-50 min-w-[250px] overflow-hidden backdrop-blur-sm">
            <div className="p-1">
              {/* Chain Information */}
              <div className="px-4 py-3 border-b border-[#FFFFFF80]/10">
                <div className="text-xs text-gray-400 mb-1">
                  Current Network
                </div>
                <div className="flex items-center gap-2">
                  {isWrongChain ? (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  ) : (
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {currentChain ? currentChain.name : `Chain ${chainId}`}
                  </span>
                </div>
              </div>

              {/* Wrong Chain Warning and Switch Button */}
              {isWrongChain && (
                <>
                  <div className="px-4 py-3 bg-red-500/10 border-l-4 border-red-500">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Unsupported Network
                    </div>
                    <p className="text-xs text-gray-300 mb-3">
                      Please switch to a supported network to continue.
                    </p>
                    <button
                      onClick={switchToSupportedChain}
                      disabled={isSwitchingChain}
                      className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isSwitchingChain ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Switching...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Switch to{" "}
                          {
                            SUPPORTED_CHAINS[
                              DEFAULT_CHAIN_ID as keyof typeof SUPPORTED_CHAINS
                            ].name
                          }
                        </>
                      )}
                    </button>
                  </div>
                  <div className="h-px bg-[#FFFFFF80]/10 my-1"></div>
                </>
              )}

              {/* Copy Address */}
              <button
                onClick={handleCopyAndClose}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#F8FF7C] hover:text-black cursor-pointer flex items-center gap-3 transition-all duration-200 font-actayRegular rounded-md group"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-200">
                  📋
                </span>
                <span className="font-medium">
                  {copied ? "Copied!" : "Copy Address"}
                </span>
              </button>

              {/* View on Explorer */}
              {currentChain && (
                <button
                  onClick={() => {
                    window.open(
                      `${currentChain.explorer}/address/${address}`,
                      "_blank"
                    );
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#F8FF7C] hover:text-black cursor-pointer flex items-center gap-3 transition-all duration-200 font-actayRegular rounded-md group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">View on Explorer</span>
                </button>
              )}

              <div className="h-px bg-[#FFFFFF80]/10 my-1"></div>

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#F8FF7C] hover:text-black cursor-pointer flex items-center gap-3 transition-all duration-200 font-actayRegular rounded-md group"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-200">
                  🚪
                </span>
                <span className="font-medium">Disconnect Wallet</span>
              </button>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              console.log("Click outside detected, closing dropdown");
              setShowDropdown(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={connect}
        className="relative  text-[#000000] px-6 py-2 sm:px-8 sm:py-3  lg:px-6 xl:px-8 rounded-lg group transition-transform"
      >
        <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
        <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
        <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
          Connect Wallet
        </span>
      </button>
    </div>
  );
}
