import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ATB Visuals — Video Editor & Motion Designer",
  description:
    "Cinematic short-form edits, motion graphics, and SaaS animations.",
  icons: {
    icon: "https://ik.imagekit.io/5xwchyocd7/potrailt.png",
    shortcut: "https://ik.imagekit.io/5xwchyocd7/potrailt.png",
    apple: "https://ik.imagekit.io/5xwchyocd7/potrailt.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}