import Footer from "@/app/_components/footer";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { ThemeSwitcher } from "./_components/theme-switcher";

import "highlight.js/styles/github-dark.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://www.blog.milanmareels.be";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    template: "%s | Milan Mareels - Tech, AI & Web Development",
    default: "Milan Mareels | Full Stack Developer, AI & Testing Blog",
  },
  keywords: ["Next.js", "React", "Web Development", "Clean Code", "AI", "Testing", "Software Engineering", "Milan Mareels", "Tech Blog Belgium"],
  description: "A personal blog by Milan Mareels sharing insights on Clean Code, AI, Testing, and modern web development.",

  publisher: "Milan Mareels",
  authors: [{ name: "Milan Mareels", url: SITE_URL }],
  creator: "Milan Mareels",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Milan Mareels | Full Stack Developer & Tech Blog",
    description: "Insights regarding Clean Code, AI, and Software Craftsmanship.",
    url: SITE_URL,
    siteName: "Milan Mareels Tech Blog",
    images: [
      {
        url: HOME_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Milan Mareels Blog Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Milan Mareels Blog",
        description: "Insights on tech, AI, and web development.",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Milan Mareels",
        url: SITE_URL,
        sameAs: ["https://linkedin.com/in/milanmareels"],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/logo.webp" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/logo.webp" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/logo.webp" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicon/logo.webp" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="google-site-verification" content="xQptRvZ6etRrEmjGfJ48DMkar0KNedlzIr1hPfie9GI" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />
      </head>
      <body className={cn(inter.className, "dark:bg-slate-900 dark:text-slate-400")}>
        <ThemeSwitcher />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
