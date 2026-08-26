import Link from "next/link";
import { Activity, Bot, Gauge, ListChecks, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./logo";
import { WalletControl } from "@/features/wallet/wallet-control";
const links = [{ href: "/app", label: "Control center", icon: Gauge }, { href: "/app/agents", label: "Agents", icon: Bot }, { href: "/app/policies", label: "Policies", icon: ShieldCheck }, { href: "/app/approvals", label: "Approvals", icon: ListChecks }, { href: "/app/activity", label: "Activity", icon: Activity }];
export function AppShell({ children }: { children: ReactNode }) { return <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
  <aside className="border-b border-line bg-panel md:min-h-screen md:border-b-0 md:border-r"><div className="p-5"><Logo /></div><nav className="flex overflow-x-auto px-3 pb-3 md:block">{links.map(({href,label,icon:Icon}) => <Link key={href} href={href} className="nav-link"><Icon size={16}/>{label}</Link>)}</nav><div className="hidden border-t border-line p-5 text-xs leading-5 text-muted md:block">PHASE 1 · PROTOTYPE<br/>No funds are executed.</div></aside>
  <div><header className="flex min-h-16 items-center justify-between border-b border-line px-5 lg:px-8"><span className="font-mono text-[10px] tracking-[.2em] text-muted">ARC CONTROL PLANE</span><WalletControl /></header><main className="p-5 lg:p-8">{children}</main></div>
</div>; }
