import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { FlowgladProvider } from "@flowglad/nextjs";
import { HonchoProvider } from '@/context/honchoProvider';
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FlowGlad Marketplace",
  description: "AI-powered marketplace with smart negotiations",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
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
      <body className={`${geistSans.className} antialiased min-h-screen bg-neutral-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FlowgladProvider loadBilling={!!user}>
            <HonchoProvider>
              <Header user={user} />
              <main>{children}</main>
              <Toaster position="bottom-right" />
            </HonchoProvider>
          </FlowgladProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
