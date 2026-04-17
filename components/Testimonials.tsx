"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TouchEvent, useEffect, useRef, useState } from "react";

const testimonials = [
  {
    id: 1,
    quote:
      "SlimCyberTech delivered our e-commerce platform ahead of schedule. The code quality was exceptional and their communication throughout the project was outstanding.",
    name: "Sarah Nakato",
    role: "CEO",
    company: "Nakato Retail Group",
    initials: "SN",
    rating: 5,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    quote:
      "Their cybersecurity audit identified vulnerabilities we had missed for years. Professional, thorough, and incredibly knowledgeable team.",
    name: "James Otieno",
    role: "CTO",
    company: "FinSecure Africa",
    initials: "JO",
    rating: 5,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 3,
    quote:
      "The mobile app they built for us has over 10,000 active users. Clean UI, fast performance, and zero major bugs since launch. Truly world-class work.",
    name: "Amara Diallo",
    role: "Product Manager",
    company: "HealthTrack Uganda",
    initials: "AD",
    rating: 5,
    color: "from-cyan-400 to-teal-600",
  },
  {
    id: 4,
    quote:
      "We brought SlimCyberTech in for a full system overhaul. They modernized our infrastructure, improved load times by 300%, and trained our internal team. Worth every shilling.",
    name: "David Ssemakula",
    role: "Director of Technology",
    company: "Kampala Metro Services",
    initials: "DS",
    rating: 5,
    color: "from-blue-600 to-cyan-500",
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToIndex = (nextIndex: number) => {
    const normalized = (nextIndex + testimonials.length) % testimonials.length;
    if (normalized === activeIndex) return;
    setDirection(normalized > activeIndex ? 1 : -1);
    setActiveIndex(normalized);
    setProgressMs(0);
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setProgressMs(0);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setProgressMs(0);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || !isInView) return;

    const interval = window.setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + 100;
        if (next >= AUTO_ADVANCE_MS) {
          goNext();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [isPaused, isInView]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isInView) return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInView]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext();
      if (delta < 0) goPrev();
    }
  };

  const active = testimonials[activeIndex];
  const progressPercent = (progressMs / AUTO_ADVANCE_MS) * 100;
  const currentDisplay = String(activeIndex + 1).padStart(2, "0");
  const totalDisplay = String(testimonials.length).padStart(2, "0");

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative mt-12 overflow-hidden bg-[#0a0a0a] px-4 py-16 md:px-8 md:py-24"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-36 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.08)_0%,rgba(0,114,255,0.06)_45%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
        <div className="relative w-full md:w-2/5">
          <p className="pointer-events-none absolute left-0 top-2 hidden select-none font-heading text-6xl font-bold tracking-[0.25em] text-white/[0.04] md:block">
            REVIEWS
          </p>

          <div className="relative z-10 text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <span className="h-px w-10 bg-[var(--cyan)]/80" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cyan)]">
                WHAT CLIENTS SAY
              </p>
            </div>

            <h2 className="mt-4 font-heading text-2xl leading-tight text-[var(--white)] md:text-4xl">
              Trusted By Those Who Build The Future
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)] md:text-base">
              Feedback from founders and technology leaders who partner with SlimCyberTech to
              deliver secure, scalable digital products.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--cyan)]/70 bg-[#101010] text-[var(--white)] transition-all duration-300 hover:bg-[var(--gradient)]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--cyan)]/70 bg-[#101010] text-[var(--white)] transition-all duration-300 hover:bg-[var(--gradient)]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 text-sm font-semibold tracking-[0.16em] text-[var(--white)]/85">
              {currentDisplay} / {totalDisplay}
            </div>

            <div className="mt-5 hidden h-28 w-[2px] overflow-hidden rounded-full bg-white/15 md:block">
              <motion.div
                className="w-full origin-top bg-[var(--gradient)]"
                animate={{ height: `${progressPercent}%` }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        <div
          className="relative w-full md:w-3/5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.article
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-[#222] bg-[#111] p-6 md:p-8"
            >
              <p className="pointer-events-none absolute left-4 top-2 font-heading text-8xl text-transparent opacity-30 [background:var(--gradient)] [background-clip:text] md:text-9xl">
                &quot;
              </p>

              <div className="relative z-10">
                <div className="flex items-center gap-1">
                  {Array.from({ length: active.rating }).map((_, index) => (
                    <Star
                      key={`${active.id}-star-${index}`}
                      className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b] drop-shadow-[0_0_6px_rgba(245,158,11,0.45)]"
                    />
                  ))}
                </div>

                <p className="mt-5 max-w-2xl text-base italic leading-8 text-[var(--white)] md:text-[1.1rem]">
                  {active.quote}
                </p>

                <div className="mt-6 h-px w-full bg-[linear-gradient(90deg,var(--cyan),var(--blue),transparent)]" />

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${active.color} ring-2 ring-cyan-400`}
                    >
                      <span className="text-xs font-semibold text-white">{active.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-base font-semibold text-[var(--white)]">
                        {active.name}
                      </p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        {active.role} - {active.company}
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 shrink-0 text-[var(--cyan)]" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-7 bg-[var(--cyan)]" : "w-2.5 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
