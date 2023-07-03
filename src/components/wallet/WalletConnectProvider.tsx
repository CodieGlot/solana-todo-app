import { useEffect, useState } from "react";

declare global {
  interface Window {
    solana: any;
  }
}

export function WalletConnectProvider() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const checkIfWalletConnected = async () => {
    if (window.solana.isPhantom) {
      const response = await window.solana.connect({ onlyIfTrusted: true });
      setWalletAddress(response.publicKey.toString());
    } else {
      alert("Phantom wallet not found!");
    }
  };

  const connectWallet = async () => {
    if (window.solana) {
      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      {walletAddress ? (
        <button>{walletAddress}</button>
      ) : (
        <button onClick={() => connectWallet()}>Connect To Wallet</button>
      )}
    </>
  );
}
