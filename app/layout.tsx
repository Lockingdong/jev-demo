import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jev Model System One Demo | OpenRouter",
  description: "Interactive playground for TypeSafe Jev System One decision models on OpenRouter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
