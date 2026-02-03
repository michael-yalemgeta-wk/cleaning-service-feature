import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggleFAB from "@/components/ThemeToggleFAB";
import ThemeProvider from "@/providers/ThemeProvider";
import fs from 'fs/promises';
import path from 'path';

const inter = Inter({ subsets: ["latin"] });

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const companyName = settings.companyName || "Cleaning Services";
  
  return {
    title: `${companyName} | Professional Cleaning Services`,
    description: "Top-rated home and office cleaning services. Book online in seconds.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <ThemeToggleFAB />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
