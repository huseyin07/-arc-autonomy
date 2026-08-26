import { defineChain } from "viem";

export const ARC_TESTNET_CHAIN_ID = 5_042_002;
export const ARC_RPC_URL = process.env.NEXT_PUBLIC_ARC_RPC_URL ?? "https://rpc.testnet.arc.network";

/** The only chain supported by this application. Replace this module for mainnet rollout. */
export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Public Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: [ARC_RPC_URL] } },
  blockExplorers: { default: { name: "Arc Testnet Explorer", url: "https://testnet.arcscan.app" } },
  testnet: true,
});
