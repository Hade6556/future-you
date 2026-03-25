import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Barlow, JetBrains_Mono, Libre_Baskerville, Cormorant } from "next/font/google";
import "./globals.css";
import Shell from "./components/Shell";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const siteTitle = "Future YOU – Daily Action Plan & AI Coaching | Close the Gap";
const siteDescription =
  "For driven professionals who have a clear direction but no clear system. Future YOU translates your real behavioral data into a structured daily action plan — so you always know the exact next move.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "daily action plan",
    "AI coaching",
    "professional development",
    "habit system",
    "gap closure",
    "LinkedIn growth",
    "behavioral coaching",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Future YOU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#060912",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${barlow.variable} ${jetbrainsMono.variable} ${libreBaskerville.variable} ${cormorant.variable} antialiased`}
        style={{ fontFamily: "var(--font-barlow), -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
