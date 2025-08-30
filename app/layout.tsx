import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { FlowgladProvider } from "@flowglad/nextjs";
import { HonchoProvider } from "@/context/honchoProvider";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FlowGlad Marketplace",
  description: "AI-powered broker-augmented marketplace for smart negotiations",
  generator: 'FlowGlad',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FlowgladProvider loadBilling={!!user}>
            <HonchoProvider>
              {children}
              <Toaster closeButton position="bottom-right" />
            </HonchoProvider>
          </FlowgladProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
