import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupportWidget from "@/components/SupportWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pristine Clean | Professional Cleaning Services",
  description: "Top-rated home and office cleaning services. Book online in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </main>
        <SupportWidget />
        <Footer />
      </body>
    </html>
  );
}
