import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AIO-STUFF · A curated atlas of tools",
    template: "%s · AIO-STUFF",
  },
  description:
    "A curated, navigable atlas of tools, skills, and resources for AI — covering AI tooling, dev tools, design, and productivity.",
  keywords: [
    "AIO-STUFF",
    "tools",
    "directory",
    "atlas",
    "AI",
    "developer tools",
    "design",
    "productivity",
  ],
  authors: [{ name: "AIO-STUFF" }],
  metadataBase: new URL("https://testplay-byte.github.io/AIO-STUFF/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 w-full">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
