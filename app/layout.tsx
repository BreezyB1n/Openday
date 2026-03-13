import type { Metadata } from "next";
import "./globals.css";
import MetaBar from "@/components/MetaBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Openday",
  description: "海外留学申请开放通知平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="font-mono antialiased">
        <MetaBar />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
