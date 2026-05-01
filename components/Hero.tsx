"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const rotatingText = [
  "Software Development",
  "Cybersecurity",
  "Mobile Apps",
  "Tech Consulting",
];
const heroHeading = "Building The Future With Code";

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1 + index * 0.12,
    },
  }),
};

export default function Hero() {
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [heroVisibleLength, setHeroVisibleLength] = useState(0);
  const [isHeroDeleting, setIsHeroDeleting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }).map((_, index) => ({
        id: index,
        size: 2 + Math.random() * 2.2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        dx: -0.018 + Math.random() * 0.036,
        dy: -0.02 + Math.random() * 0.04,
      })),
    );
  }, []);

  useEffect(() => {
    const atStart = heroVisibleLength === 0;
    const atEnd = heroVisibleLength === heroHeading.length;

    let timeoutDelay = isHeroDeleting ? 40 : 70;
    if (atEnd && !isHeroDeleting) timeoutDelay = 1300;
    if (atStart && isHeroDeleting) timeoutDelay = 500;

    const timeout = window.setTimeout(() => {
      if (atEnd && !isHeroDeleting) {
        setIsHeroDeleting(true);
        return;
      }

      if (atStart && isHeroDeleting) {
        setIsHeroDeleting(false);
        return;
      }

      setHeroVisibleLength((prev) => prev + (isHeroDeleting ? -1 : 1));
    }, timeoutDelay);

    return () => window.clearTimeout(timeout);
  }, [heroVisibleLength, isHeroDeleting]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTextIndex((prev) => (prev + 1) % rotatingText.length);
      setVisibleLength(0);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const current = rotatingText[activeTextIndex];

    const typing = setInterval(() => {
      setVisibleLength((prev) => {
        if (prev >= current.length) {
          clearInterval(typing);
          return prev;
        }
        return prev + 1;
      });
    }, 36);

    return () => clearInterval(typing);
  }, [activeTextIndex]);

  const displayedText = rotatingText[activeTextIndex].slice(0, visibleLength);

  return (
    <section
      id="hero"
      aria-label="SlimCyberTech Hero"
      className="relative flex min-h-[94svh] items-center overflow-hidden pb-14 pt-[calc(6.25rem+env(safe-area-inset-top))] sm:min-h-screen sm:pb-16 sm:pt-32"
    >
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/Gemini_Generated_Image_wsz9hbwsz9hbwsz9.png"
          alt="Futuristic analytics visualization background"
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PSc5Jz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nOScgZmlsbD0nIzA0MGExNScvPjwvc3ZnPg=="
          className="object-cover"
          style={{ opacity: "var(--hero-background-opacity)" }}
        />
      </div>
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: "var(--image-overlay-strong)" }} />

      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {particles.map((particle, index) => (
            <g key={particle.id}>
              {particles.slice(index + 1).map((other) => {
                const distance = Math.hypot(other.x - particle.x, other.y - particle.y);
                if (distance > 23) return null;

                return (
                  <motion.line
                    key={`${particle.id}-${other.id}`}
                    x1={`${particle.x}%`}
                    y1={`${particle.y}%`}
                    x2={`${other.x}%`}
                    y2={`${other.y}%`}
                    stroke="url(#lineGradient)"
                    strokeOpacity={0.16}
                    strokeWidth="0.08"
                    initial={{ opacity: 0.06 }}
                    animate={{ opacity: [0.04, 0.2, 0.04] }}
                    transition={{
                      duration: 5 + ((particle.id + other.id) % 4),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}

              <motion.circle
                cx={`${particle.x}%`}
                cy={`${particle.y}%`}
                r={particle.size / 6}
                fill={particle.id % 2 ? "var(--cyan)" : "var(--blue)"}
                fillOpacity={0.4}
                animate={{
                  cx: [`${particle.x}%`, `${particle.x + particle.dx * 80}%`, `${particle.x}%`],
                  cy: [`${particle.y}%`, `${particle.y + particle.dy * 80}%`, `${particle.y}%`],
                }}
                transition={{
                  duration: 14 + (particle.id % 5) * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--cyan)" />
              <stop offset="100%" stopColor="var(--blue)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 md:px-10">
        <div
          className="w-full max-w-5xl rounded-3xl px-4 py-6 sm:px-6 sm:py-7"
          style={{
            background: "linear-gradient(180deg,var(--image-overlay-medium),rgba(255,255,255,0))",
            backdropFilter: "blur(1px)",
          }}
        >
        <motion.h1
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[min(100%,22ch)] text-balance text-[clamp(2rem,8.8vw,3.8rem)] font-bold leading-[1.1] text-[var(--white)] [text-shadow:0_2px_8px_rgba(0,0,0,0.18)] sm:max-w-full sm:whitespace-nowrap sm:leading-tight"
        >
          {heroHeading.slice(0, heroVisibleLength)}
          <span className="ml-1 inline-block h-[0.95em] w-[2px] animate-pulse bg-[var(--cyan)] align-[-0.1em]" />
        </motion.h1>

        <motion.p
          custom={1}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-5 max-w-[36ch] text-base leading-relaxed text-[var(--white)] [text-shadow:0_1px_5px_rgba(0,0,0,0.12)] sm:mt-6 sm:max-w-3xl sm:text-lg sm:leading-8"
        >
          We craft cutting-edge software solutions that push the boundaries of what&apos;s
          possible.
        </motion.p>

        <motion.div
          custom={2}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-5 min-h-9 text-sm text-[var(--cyan)] [text-shadow:0_1px_4px_rgba(255,255,255,0.32)] sm:text-base"
        >
          <span className="text-[var(--muted)]">Expertise:</span>{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeTextIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="inline-block min-w-[180px] text-left sm:min-w-[200px]"
            >
              {displayedText}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[var(--cyan)] align-middle" />
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div
          custom={3}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-9 flex w-full max-w-sm flex-col gap-3.5 sm:mt-10 sm:max-w-md sm:flex-row sm:justify-center sm:gap-4"
        >
          <Link
            href="#contact"
            className="w-full rounded-full bg-[var(--gradient)] px-8 py-3.5 text-base font-semibold text-[var(--white)] transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto sm:py-3.5"
          >
            Start a Project
          </Link>
          <Link
            href="#portfolio"
            className="w-full rounded-full border border-[var(--cyan)]/65 bg-[var(--surface)]/55 px-8 py-3.5 text-base font-semibold text-[var(--white)] shadow-sm transition-colors duration-300 hover:border-[var(--blue)] hover:bg-[var(--surface2)] sm:w-auto sm:py-3.5"
          >
            View Our Work
          </Link>
        </motion.div>
        </div>

        <motion.div
          custom={4}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 w-full max-w-3xl sm:mt-8"
        >
          <div
            className="relative h-[155px] overflow-hidden rounded-2xl border border-[var(--border)] sm:h-[170px]"
            style={{ backgroundColor: "var(--image-overlay-soft)" }}
          >
            <Image
              src="/images/Gemini_Generated_Image_lyyz1qlyyz1qlyyz.png"
              alt="SlimCyberTech engineering control room"
              fill
              loading="lazy"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,var(--image-gradient-from),var(--image-gradient-via),var(--image-gradient-to))",
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[var(--cyan)]/75 sm:bottom-7"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-7 w-7" />
      </motion.div>
    </section>
  );
}
