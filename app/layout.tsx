import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "UZUN CHOI",
  description: "UZUN — photography, film, design, development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/jpr2tcu.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0c0c0c] text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
