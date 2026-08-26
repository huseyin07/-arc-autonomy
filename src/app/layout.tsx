import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
export const metadata: Metadata = { title: "ARC AUTONOMY", description: "Programmable financial control for autonomous agents on Arc." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="font-sans"><Providers>{children}</Providers></body></html>; }
