"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: { when: "afterChildren", staggerChildren: 0.06, staggerDirection: -1 },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 14, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const isScrolled = useScrollPosition(24);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          isScrolled
            ? "border-b border-[var(--cyan)]/55 bg-[rgba(10,10,10,0.7)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-10">
          <Link href="#home" className="group flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="/images/Logo.jpeg"
              alt="SlimCyberTech logo"
              width={44}
              height={44}
              priority
              className="h-9 w-9 rounded-md object-cover sm:h-10 sm:w-10"
            />
            <div className="min-w-0">
              <p className="truncate font-heading text-sm leading-tight sm:text-base">
                <span className="text-[var(--white)]">Slim</span>
                <span className="text-[var(--cyan)]">Cyber</span>
                <span className="text-[var(--white)]">Tech</span>
              </p>
              <p className="truncate font-heading text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] sm:text-[10px]">
                Building the future with code
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-sm font-medium text-[var(--white)]/90 transition-colors hover:text-[var(--white)]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--cyan)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="#contact"
              className="group inline-flex rounded-full bg-[var(--gradient)] p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center rounded-full bg-[var(--bg)] px-5 py-2 text-sm font-semibold text-[var(--white)] transition-all duration-300 group-hover:bg-transparent group-hover:text-[var(--white)]">
                Get Started
              </span>
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)] md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed inset-0 z-[70] flex min-h-screen flex-col bg-[rgba(10,10,10,0.96)] px-8 pb-10 pt-24 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute right-4 top-4">
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)]"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-1 flex-col justify-center gap-7">
              {navLinks.map((item) => (
                <motion.div key={item.label} variants={linkVariants}>
                  <Link
                    href={item.href}
                    className="text-3xl font-semibold text-[var(--white)]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={linkVariants} className="pt-6">
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full justify-center rounded-full bg-[var(--gradient)] p-[1px]"
              >
                <span className="w-full rounded-full bg-[var(--bg)] px-6 py-3 text-center text-base font-semibold text-[var(--white)]">
                  Get Started
                </span>
              </Link>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
