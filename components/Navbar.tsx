"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useTheme } from "@/components/ThemeProvider";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const navItems = [
  { label: "Home", href: "#hero", section: "hero" },
  { label: "Services", href: "#services", section: "services" },
  { label: "About", href: "#about", section: "about" },
  { label: "Portfolio", href: "#portfolio", section: "portfolio" },
  { label: "Contact", href: "#contact", section: "contact" },
];

const sectionLabelMap: Record<string, string> = {
  hero: "Home",
  services: "Services",
  about: "About",
  team: "About",
  portfolio: "Portfolio",
  testimonials: "Portfolio",
  contact: "Contact",
};

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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const sheetVariants: Variants = {
  hidden: { x: "100%", opacity: 0.98 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 360,
      damping: 34,
      mass: 0.8,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    x: "100%",
    opacity: 0.98,
    transition: { duration: 0.22, ease: "easeInOut", when: "afterChildren" },
  },
};

export default function Navbar() {
  const isScrolled = useScrollPosition(24);
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection();
  const { theme, toggleTheme } = useTheme();
  const activeLabel = sectionLabelMap[activeSection] ?? "Home";
  const footerDelay = navItems.length * 0.07 + 0.1;
  const scrollToHash = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleDelayedAnchorTap = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    delayMs: number,
  ) => {
    event.preventDefault();
    setIsOpen(false);
    window.setTimeout(() => {
      scrollToHash(href);
    }, delayMs);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          isScrolled
            ? "border-b border-[var(--cyan)]/55 bg-[var(--header-bg)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-6 lg:px-10"
        >
          <Link href="#hero" className="group flex min-w-0 items-center gap-2">
            <Image
              src="/images/Logo.jpeg"
              alt="SlimCyberTech logo"
              width={42}
              height={42}
              priority
              className="h-8 w-8 rounded-md object-cover sm:h-10 sm:w-10"
            />
            <span className="max-w-[130px] whitespace-nowrap leading-none sm:max-w-none">
              <span className="text-sm font-semibold tracking-[0.01em] text-[var(--white)] sm:text-lg">
                Slim
              </span>
              <span className="text-sm font-semibold tracking-[0.01em] text-[var(--cyan)] sm:text-lg">
                Cyber
              </span>
              <span className="text-sm font-semibold tracking-[0.01em] text-[var(--blue)] sm:text-lg">
                Tech
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative text-sm font-medium transition-colors hover:text-[var(--white)] ${
                  activeSection === item.section
                    ? "text-[var(--white)]"
                    : "text-[var(--white)]/90"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-[var(--cyan)] transition-transform duration-300 ease-out ${
                    activeSection === item.section
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)] transition-colors hover:border-[var(--cyan)]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="rounded-full border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--cyan)]">
              {activeLabel}
            </span>
            <Link
              href="#contact"
              className="group inline-flex rounded-full bg-[var(--gradient)] p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center rounded-full bg-[var(--bg)] px-5 py-2 text-sm font-semibold text-[var(--white)] transition-all duration-300 group-hover:bg-transparent group-hover:text-[var(--white)]">
                Get Started
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)]"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-hidden={!isOpen}
          >
            <button
              type="button"
              aria-label="Close menu backdrop"
              className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className="absolute top-0 right-0 z-50 flex h-screen min-h-[600px] w-full max-w-sm flex-col overflow-hidden border-l border-[#1e1e1e] bg-[#0f0f0f] [height:100dvh] shadow-2xl"
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-shrink-0 items-center justify-between border-b border-[#1e1e1e] px-6 py-5 landscape:py-3">
                <Link
                  href="#hero"
                  className="group flex min-w-0 items-center gap-2"
                  onClick={(event) => handleDelayedAnchorTap(event, "#hero", 350)}
                >
                  <Image
                    src="/images/Logo.jpeg"
                    alt="SlimCyberTech logo"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-md object-cover"
                  />
                  <span className="max-w-[150px] whitespace-nowrap leading-none">
                    <span className="text-sm font-semibold tracking-[0.01em] text-[var(--white)]">Slim</span>
                    <span className="text-sm font-semibold tracking-[0.01em] text-[var(--cyan)]">Cyber</span>
                    <span className="text-sm font-semibold tracking-[0.01em] text-[var(--blue)]">Tech</span>
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--white)]"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.div
                className="drawer-scroll flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#222]"
                variants={overlayVariants}
              >
                <div className="mb-1">
                  <span className="rounded-full border border-[var(--cyan)]/35 bg-[var(--cyan)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[var(--cyan)]">
                    Now viewing: {activeLabel}
                  </span>
                </div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--white)]/60">Navigation</div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = item.label === activeLabel;
                    return (
                      <motion.div key={item.label} variants={linkVariants} whileTap={{ scale: 0.97 }}>
                        <Link
                          href={item.href}
                          onClick={(event) => handleDelayedAnchorTap(event, item.href, 350)}
                          className={`flex min-h-16 items-center justify-between rounded-xl border px-4 py-3.5 text-base font-medium transition-colors active:scale-[0.98] landscape:text-sm ${
                            isActive
                              ? "border-[var(--mobile-active-border)] bg-[var(--mobile-active-bg)] text-[var(--white)]"
                              : "border-[var(--border)] bg-[var(--surface)] text-[var(--white)]/90 hover:border-[var(--cyan)]/45 hover:text-[var(--white)]"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive ? <span className="h-2 w-2 rounded-full bg-[var(--cyan)]" /> : null}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                className="relative flex flex-shrink-0 flex-col gap-4 border-t border-[#1e1e1e] bg-gradient-to-t from-[#0a0a0a] to-[#0f0f0f] px-6 py-5 landscape:py-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: footerDelay }}
              >
                <div className="pointer-events-none absolute left-0 top-0 h-6 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                <motion.a
                  href="#contact"
                  onClick={(event) => handleDelayedAnchorTap(event, "#contact", 300)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--gradient)] p-[1px] font-[var(--font-heading)]"
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="w-full rounded-full bg-[var(--bg)] px-6 py-3 text-center text-base font-semibold text-[var(--white)]">
                    Get Started
                  </span>
                </motion.a>
                <div className="rounded-xl border border-[#1e1e1e] bg-[#111] p-4">
                  <p className="mb-1 text-xs uppercase tracking-wider text-[var(--white)]/55">Quick Contact</p>
                  <a
                    href="mailto:hello@slimcybertech.com"
                    className="block truncate text-sm font-medium text-[var(--cyan)] hover:text-[var(--white)]"
                  >
                    hello@slimcybertech.com
                  </a>
                  <a
                    href="mailto:info@slimcybertech.com"
                    className="mt-1 block truncate text-sm font-medium text-[var(--cyan)] hover:text-[var(--white)]"
                  >
                    info@slimcybertech.com
                  </a>
                  <a
                    href="tel:+256772581510"
                    className="mt-1 block truncate text-sm font-medium text-[var(--cyan)] hover:text-[var(--white)]"
                  >
                    +256 772 581510
                  </a>
                </div>
              </motion.div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
