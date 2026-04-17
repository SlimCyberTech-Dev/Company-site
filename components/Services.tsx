"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, VIEWPORT_ONCE } from "@/lib/motion";
import {
  AppWindowMac,
  CloudCog,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Waypoints,
} from "lucide-react";

const services = [
  {
    title: "Software Development",
    description: "Custom web platforms engineered for speed, stability, and scale.",
    highlights: ["Modern architecture", "API-first delivery", "Long-term maintainability"],
    icon: AppWindowMac,
  },
  {
    title: "Mobile Development",
    description: "Cross-platform mobile products that feel native and perform smoothly.",
    highlights: ["iOS & Android", "Optimized performance", "Release-ready QA"],
    icon: Smartphone,
  },
  {
    title: "Cybersecurity",
    description: "Security-first assessments and hardening to reduce risk across systems.",
    highlights: ["Threat analysis", "Secure architecture", "Continuous protection"],
    icon: ShieldCheck,
  },
  {
    title: "Cloud & DevOps",
    description: "Reliable cloud infrastructure and delivery pipelines built for growth.",
    highlights: ["Scalable cloud setup", "CI/CD automation", "Observability & uptime"],
    icon: CloudCog,
  },
  {
    title: "UI/UX Design",
    description: "Human-centered interface systems designed for conversion and clarity.",
    highlights: ["User flows", "Design systems", "Accessibility-first thinking"],
    icon: Sparkles,
  },
  {
    title: "Tech Consulting",
    description: "Practical technical strategy to accelerate digital transformation.",
    highlights: ["Architecture guidance", "Execution roadmap", "Team enablement"],
    icon: Waypoints,
  },
];

export default function Services() {
  return (
    <section id="services" className="relative mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 md:mt-12 md:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[radial-gradient(circle_at_20%_25%,rgba(0,198,255,0.08),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(0,114,255,0.07),transparent_50%)]" />

      <motion.div
        className="mb-8 text-center sm:mb-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        <h2 className="text-2xl font-bold text-[var(--white)] sm:text-3xl md:text-4xl">Our Services</h2>
        <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-[var(--gradient)]" />
        <p className="mx-auto mt-4 max-w-[34ch] text-sm leading-7 text-[var(--muted)] sm:max-w-2xl sm:text-base">
          End-to-end engineering expertise to design, build, secure, and scale modern products.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
      >
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            variants={staggerItem}
            custom={index}
            className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#0f1115] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--cyan)]/65 hover:shadow-[0_16px_40px_-24px_rgba(0,198,255,0.35)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
            <div className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--gradient)] transition-transform duration-300 group-hover:scale-x-100" />

            <div className="relative z-10 mb-5 inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-3">
              <service.icon
                className="h-6 w-6"
                style={{ stroke: `url(#serviceIconGradient-${index})` }}
              />
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient
                    id={`serviceIconGradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="var(--cyan)" />
                    <stop offset="100%" stopColor="var(--blue)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h3 className="relative z-10 font-heading text-xl leading-snug text-[var(--white)]">
              {service.title}
            </h3>
            <p className="relative z-10 mt-3 text-sm leading-7 text-[var(--muted)]">
              {service.description}
            </p>

            <ul className="relative z-10 mt-4 space-y-2">
              {service.highlights.map((point) => (
                <li key={`${service.title}-${point}`} className="flex items-start gap-2 text-xs text-[var(--white)]/85">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cyan)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Link
              href="#contact"
              className="relative z-10 mt-6 inline-flex items-center text-sm font-medium text-[var(--cyan)]"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                Learn More
                <span className="ml-1 inline-block">→</span>
              </span>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
