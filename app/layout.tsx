import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import ScrollProgress from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://slimcybertech.com"),
  title: {
    default: "SlimCyberTech | Software Development & Technology - Kampala, Uganda",
    template: "%s | SlimCyberTech",
  },
  description:
    "SlimCyberTech builds cutting-edge software, mobile apps, and cybersecurity solutions for businesses across Africa and beyond. Based in Kampala, Uganda.",
  keywords: [
    "software development Uganda",
    "web development Kampala",
    "mobile app development Africa",
    "cybersecurity Uganda",
    "tech consulting Kampala",
    "custom software Uganda",
    "Next.js development",
    "SlimCyberTech",
  ],
  alternates: {
    canonical: "https://slimcybertech.com",
  },
  authors: [{ name: "SlimCyberTech", url: "https://slimcybertech.com" }],
  creator: "SlimCyberTech",
  publisher: "SlimCyberTech",
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://slimcybertech.com",
    siteName: "SlimCyberTech",
    title: "SlimCyberTech | Software Development & Technology",
    description:
      "Cutting-edge software solutions, mobile apps, and cybersecurity services. Building the future with code - from Kampala, Uganda.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SlimCyberTech - Building the Future With Code",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@slimcybertech",
    creator: "@slimcybertech",
    title: "SlimCyberTech | Software Development & Technology",
    description:
      "Cutting-edge software, mobile apps, and cybersecurity - from Kampala, Uganda.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/images/Logo.jpeg", type: "image/jpeg", sizes: "192x192" },
    ],
    apple: "/images/Logo.jpeg",
    shortcut: "/images/Logo.jpeg",
  },
  manifest: "/site.webmanifest",
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
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} h-full scroll-smooth antialiased`}
      data-theme="dark"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',(s==='light'||s==='dark')?s:d);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--bg)] text-[var(--white)] font-sans">
        <JsonLd />
        <ThemeProvider>
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
