import { useEffect } from "react";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    solana: any;
  }
}

type WalletConnectProviderProps = {
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
};

export function WalletConnectProvider({
  walletAddress,
  setWalletAddress,
}: WalletConnectProviderProps) {
  const checkIfWalletConnected = async () => {
    if (window.solana.isPhantom) {
      const response = await window.solana.connect({ onlyIfTrusted: true });
      setWalletAddress(response.publicKey.toString());
    } else {
      toast.error("Phantom wallet not found!");
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
