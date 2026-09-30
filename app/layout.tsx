import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: "Personal Dispatch | Bookchaowalit", description: "A local priority-aware todo board." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
