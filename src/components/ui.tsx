import type { ReactNode } from "react";
export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) { return <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/[.06] pb-6"><div><div className="eyebrow">{eyebrow}</div><h1 className="mt-2 text-3xl font-medium tracking-[-.03em] text-white sm:text-4xl">{title}</h1></div>{action}</div>; }
export function Panel({ children, className="" }: { children: ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
export function Status({ children, tone="neutral" }: { children: ReactNode; tone?: "ok"|"warn"|"danger"|"neutral" }) { return <span className={`status status-${tone}`}>{children}</span>; }
export function AddressText({ value }: { value: string }) { return <span className="rounded-md border border-white/[.06] bg-black/20 px-2 py-1 font-mono text-xs text-white/70">{value.slice(0,6)}…{value.slice(-4)}</span>; }
