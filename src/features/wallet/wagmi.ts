import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { arcTestnet, ARC_RPC_URL } from "@/config/arc";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const connectors = projectId
  ? [injected({ shimDisconnect: true }), walletConnect({ projectId, metadata: { name: "ARC AUTONOMY", description: "Programmable financial control for autonomous agents on Arc.", url: "https://arc-autonomy.example", icons: [] } })]
  : [injected({ shimDisconnect: true })];

export const wagmiConfig = createConfig({ chains: [arcTestnet], connectors, transports: { [arcTestnet.id]: http(ARC_RPC_URL) }, ssr: true });
