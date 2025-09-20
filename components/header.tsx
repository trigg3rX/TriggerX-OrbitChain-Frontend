"use client";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Typography } from "./ui/typography";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#141414] border-b border-[#1A1A1A] relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141414] rounded-xl flex items-center justify-center shadow-lg hover:shadow-[#82FBD0]/25 transition-all duration-300 hover:scale-105 group border border-[#FFF282]/30">
            <Globe className="w-6 h-6 text-[#FFF282] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <Link href="/" onClick={closeMobileMenu}>
            <Typography variant="h3" className="triggerx-logo">
              <span
                className="text-2xl text-[#FFFFFF] hover:text-[#FFF282] transition-all duration-300 cursor-pointer"
                style={{
                  fontFamily: "var(--font-family-actay-regular)",
                  fontWeight: "bold",
                }}
              >
                OrbitChain
              </span>
            </Typography>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 bg-[#181818F0] rounded-full z-10 px-3 py-1">
          <Button
            variant="ghost"
            asChild
            className="text-md px-4 py-2 rounded-full text-[#FFFFFF] hover:border border-[#4B4A4A] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-family-actay-regular)" }}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-md px-4 py-2 rounded-full text-[#FFFFFF] hover:border border-[#4B4A4A] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ fontFamily: "var(--font-family-actay-regular)" }}
          >
            <Link href="/create">Deploy Chain</Link>
          </Button>
        </nav>

        {/* Desktop Connect Wallet Button */}
        <div className="hidden md:flex items-center gap-6">
          <ConnectWalletButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ConnectWalletButton />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2 text-[#FFFFFF] hover:bg-[#1A1A1A] transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#141414] border-b border-[#1A1A1A] z-50 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        }`}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          <Button
            variant="ghost"
            asChild
            className="text-lg px-6 py-4 rounded-xl text-[#FFFFFF] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] transition-all duration-300 text-left justify-start"
            style={{ fontFamily: "var(--font-family-actay-regular)" }}
            onClick={closeMobileMenu}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="text-lg px-6 py-4 rounded-xl text-[#FFFFFF] hover:bg-gradient-to-r from-[#D9D9D924] to-[#14131324] transition-all duration-300 text-left justify-start"
            style={{ fontFamily: "var(--font-family-actay-regular)" }}
            onClick={closeMobileMenu}
          >
            <Link href="/create">Deploy Chain</Link>
          </Button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}
