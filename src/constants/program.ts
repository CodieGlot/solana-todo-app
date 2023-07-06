import { PublicKey, clusterApiUrl } from "@solana/web3.js";

export const programID = new PublicKey(
  "B1WJVWaGLBkAfsyUghEiDKQFafcvRxqUrtxdXu4nLJur"
);

export const network = clusterApiUrl("devnet");

export const connectionOpts = {
  preflightCommitment: "processed",
};
