"use client";

import type React from "react";
import { WalletProvider } from "@/contexts/wallet-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
