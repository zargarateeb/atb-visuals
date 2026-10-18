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
  metadataBase: new URL("https://atb-visuals.vercel.app"),

  applicationName: "ATB Visuals",

  title: {
    default: "ATB Visuals | Video Editor & Motion Designer",
    template: "%s | ATB Visuals",
  },

  description:
    "Cinematic short-form edits, motion graphics, and SaaS product animations. Portfolio of ATB Visuals.",

  keywords: [
    "ATB Visuals",
    "Video Editor",
    "Motion Designer",
    "Motion Graphics Artist",
    "Video Production Studio",
    "Reels Editor",
    "TikTok Video Editor",
    "YouTube Shorts Editor",
    "Short Form Edits",
    "Viral Video Editor",
    "Instagram Reels Editing",
    "Social Media Content Creator",
    "SaaS Animations",
    "SaaS Product Demo",
    "UI Animation",
    "App Preview Video",
    "Software Showcase Video",
    "Tech Explainer Video",
    "Cinematic Video Editing",
    "Motion Graphics",
    "3D Motion Graphics",
    "Visual Effects",
    "VFX Artist",
    "Color Grading",
    "Sound Design",
    "Kinetic Typography",
    "Video Post Production",
    "Freelance Video Editor",
    "Remote Video Editor",
    "Hire Motion Designer",
    "Promo Video Editor",
    "Commercial Video Editor",
    "Brand Video Creation",
    "Explainer Video Creator",
  ],

  openGraph: {
    title: "ATB Visuals | Video Editor & Motion Designer",
    description:
      "Cinematic short-form edits, motion graphics, and SaaS product animations.",
    url: "https://atb-visuals.vercel.app/",
    siteName: "ATB Visuals",
    images: [
      {
        url: "https://ik.imagekit.io/5xwchyocd7/potrailt.png",
        width: 1200,
        height: 630,
        alt: "ATB Visuals Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ATB Visuals | Video Editor & Motion Designer",
    description:
      "Cinematic short-form edits, motion graphics, and SaaS product animations.",
    images: ["https://ik.imagekit.io/5xwchyocd7/potrailt.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
