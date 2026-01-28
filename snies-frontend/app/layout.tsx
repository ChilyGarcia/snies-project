import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PermissionsProvider } from "@/modules/auth/presentation/permissions-provider";
import "./globals.css";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
export const metadata: Metadata = {
    title: "SNIES",
    description: "Sistema de gestión",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/logo-fesc.png",
                type: "image/png",
            },
        ],
    },
};
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <PermissionsProvider>
            {children}
            <Toaster richColors closeButton/>
          </PermissionsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>);
}
