import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Shell from "./components/Shell";

const apercu = localFont({
  variable: "--font-apercu",
  src: [
    {
      path: "./fonts/apercu/apercu_regular_pro.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/apercu/apercu_regular_italic_pro.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/apercu/apercu_medium_pro.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/apercu/apercu_medium_italic_pro.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/apercu/apercu_bold_pro.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/apercu/apercu_bold_italic_pro.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const siteTitle = "Behavio – Daily Action Plan & AI Coaching | Close the Gap";
const siteDescription =
  "For driven professionals who have a clear direction but no clear system. Behavio translates your real behavioral data into a structured daily action plan — so you always know the exact next move.";

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
    title: "Behavio",
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
        className={`${apercu.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} antialiased`}
        style={{ fontFamily: "var(--font-apercu), -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
