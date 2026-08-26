"use client";
import { AlertTriangle, CheckCircle2, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { ARC_TESTNET_CHAIN_ID } from "@/config/arc";

export function WalletControl() {
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  if (!isConnected) return <button className="button button-secondary" disabled={isPending} onClick={() => connectors[0] && connect({ connector: connectors[0] })}><Wallet size={15} />{isPending ? "Connecting…" : "Connect wallet"}</button>;
  const correct = chainId === ARC_TESTNET_CHAIN_ID;
  return <div className="flex flex-wrap items-center gap-2">
    <span className={`status ${correct ? "status-ok" : "status-warn"}`}>{correct ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}{correct ? "Arc connected" : "Wrong network"}</span>
    <button className="font-mono text-xs text-muted hover:text-white" onClick={() => disconnect()}>{address?.slice(0, 6)}…{address?.slice(-4)}</button>
    {!correct && <button className="button button-small" disabled={switching} onClick={() => switchChain({ chainId: ARC_TESTNET_CHAIN_ID })}>{switching ? "Switching…" : "Switch to Arc"}</button>}
  </div>;
}
