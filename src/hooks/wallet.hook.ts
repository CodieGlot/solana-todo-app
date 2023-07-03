import { useState } from "react";

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return { walletAddress, setWalletAddress };
}
