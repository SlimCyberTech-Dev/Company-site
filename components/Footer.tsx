"use client";

import Link from "next/link";
import Image from "next/image";
import { CodeXml, MessageCircle, Waypoints } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const servicesLinks = [
  { label: "Software Development", href: "#services" },
  { label: "Mobile Development", href: "#services" },
  { label: "Cybersecurity", href: "#services" },
  { label: "Tech Consulting", href: "#services" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", icon: CodeXml },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Waypoints },
  { label: "Twitter", href: "https://twitter.com", icon: MessageCircle },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-10 bg-[var(--card-bg-strong)]">
      <div className="h-px w-full bg-[var(--gradient)]" />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 md:px-10">
        <div className="mb-8 sm:mb-10">
          <Link href="#hero" className="inline-flex items-center gap-2">
            <Image
              src="/images/Slim.jpeg"
              alt="SlimCyberTech company wordmark"
              width={260}
              height={74}
              loading="lazy"
              className="h-8 w-auto object-contain sm:h-10"
            />
          </Link>
          <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
            Building the Future With Code through secure, scalable, and strategy-led engineering.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3">
          <div>
            <h4 className="font-heading text-lg text-[var(--white)]">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-[var(--cyan)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-[var(--white)]">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {servicesLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-[var(--cyan)]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading text-lg text-[var(--white)]">Contact Info</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>hello@slimcybertech.com</li>
              <li>+256 772 581510</li>
              <li>WestNile, Uganda</li>
            </ul>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)] text-[var(--white)] transition-colors duration-300 hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-5 text-center text-xs text-[var(--muted)] sm:mt-10 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {currentYear} SlimCyberTech. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">Built with ❤️ and Code</p>
        </div>
      </div>
    </footer>
  );
}
