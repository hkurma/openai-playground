import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://openai-playground-plus.vercel.app"),
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    "openai",
    "api",
    "playground",
    "nextjs",
    "tailwindcss",
    "feather-icons",
  ],
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    siteName: APP_TITLE,
    url: "/",
    images: ["/screenshot.png"],
    type: "website",
    locale: "en-US",
  },
  twitter: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ["/screenshot.png"],
    card: "summary_large_image",
  },
  icons: [
    {
      type: "image/svg+xml",
      url: "/favicon.svg",
    },
    {
      type: "image/png",
      url: "/favicon.png",
    },
  ],
};

const RootLayout = (props: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        {props.children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
