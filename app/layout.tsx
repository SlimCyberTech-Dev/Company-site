import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
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
  icons: {
    icon: "/images/Logo.jpeg",
    shortcut: "/images/Logo.jpeg",
    apple: "/images/Logo.jpeg",
  },
  title: "SlimCyberTech | Software Development & Technology",
  description:
    "SlimCyberTech delivers software development, technology consulting, cybersecurity, and web/mobile app solutions for modern businesses.",
  keywords: [
    "SlimCyberTech",
    "software development",
    "technology consulting",
    "cybersecurity",
    "web development",
    "mobile apps",
    "Kampala software company",
  ],
  openGraph: {
    title: "SlimCyberTech | Software Development & Technology",
    description:
      "Building the Future With Code through secure, scalable, and strategy-led engineering.",
    images: ["/og-image.svg"],
    type: "website",
    siteName: "SlimCyberTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "SlimCyberTech | Software Development & Technology",
    description:
      "Software development, cybersecurity, and technology consulting for ambitious teams.",
    images: ["/og-image.svg"],
  },
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
        <ThemeProvider>
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
