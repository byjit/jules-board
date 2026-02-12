import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-providers";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constant";
import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Load custom fonts for the app
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for ProVibe - Project Management Platform
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
  ],
  assets: ["/favicon.ico", "/apple-touch-icon.png"],
  authors: [{ name: "Jit", url: "https://byjit.com" }],
  keywords: [],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: `${env.NEXT_PUBLIC_APP_URL}`,
    siteName: APP_NAME,
    images: [
      {
        url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    creator: "@jit_infinity",
    images: [`${env.NEXT_PUBLIC_APP_URL}/og-image.png`],
  },
  category: "",
  creator: "Jit",
  metadataBase: new URL(`${env.NEXT_PUBLIC_APP_URL}`),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={inter.variable} lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="#2563eb" name="theme-color" />
        {/* Tally.so widget for feedback/forms */}
        <Script async id="tally-so" src="https://tally.so/widgets/embed.js"></Script>
        {/* Google site verification for SEO */}
        <meta
          content="eV_8lm-A-X7GqiT1epPzizzLuGw542DEMsqF6j1wWQg"
          name="google-site-verification"
        />
        <link href={env.NEXT_PUBLIC_APP_URL} rel="canonical" />
        {/* Schema.org structured data for ProVibe */}
        <Script id="schema-org" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: APP_NAME,
            description: APP_DESCRIPTION,
            url: env.NEXT_PUBLIC_APP_URL,
            applicationCategory: "SaaS",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </Script>
        <Script async id="tally-so" src="https://tally.so/widgets/embed.js"></Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <TRPCReactProvider>
            <HydrateClient>{children}</HydrateClient>
          </TRPCReactProvider>
        </ThemeProvider>
        <Toaster />
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
